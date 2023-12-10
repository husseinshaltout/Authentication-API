import jwt from 'jsonwebtoken';
import moment from 'moment';

import config from '@config';

import {
  User,
  UserDocument,
  UserAttributes,
  UserSession,
} from '@models/user.model';

import ConflictError from '@common/errors/conflictError';
import UnauthorizedError from '@common/errors/unauthorizedError';
import InvalidTokenError from '@common/errors/exceptionErrors/invalidTokenError';

import { accessTokenPayload, refreshTokenPayload } from './types/tokenPayload';
import generateNanoId from '@common/util/generateNanoID';
import logger from '@loaders/logger';

class AuthService {
  constructor() {}
  async signUp(data: Partial<UserAttributes>) {
    const userFields: Partial<UserAttributes> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    };

    if (userFields.email && (await User.isEmailExists(userFields.email)))
      throw new ConflictError('Email already taken');

    let user = await User.create(userFields);

    return user;
  }

  async login(email: string, password: string) {
    let user = await User.findOne({ email: email }).select('+password');

    if (!user || !(await user.isCorrectPassword(password, user.password)))
      throw new UnauthorizedError('Wrong Email or Password! Please Try Again');

    const newSession: UserSession = {
      sessionID: await generateNanoId(),
      refTokenVersion: 0,
      lastRefresh: new Date(),
    };

    user.userSessions = [...user.userSessions, newSession];

    user.save().catch((error) => {
      logger.error(error);
    });

    return {
      user: user,
      accessToken: this.generateAccessToken(user, newSession),
      refreshToken: this.generateRefreshToken(user, newSession),
    };
  }

  private generateAccessToken(user: UserAttributes, session: UserSession) {
    const expiryDate = moment(new Date()).add(
      config.AUTH.ACCESS_TOKEN.EXPIRY,
      'minutes'
    );

    const payload: accessTokenPayload = {
      userId: user._id,
      email: user.email,
      sessionId: session.sessionID,
      exp: expiryDate.unix(),
    };

    const token = jwt.sign(payload, config.AUTH.ACCESS_TOKEN.SECRET);

    return {
      token,
      expiry: expiryDate.toDate(),
    };
  }

  protect(accessToken: string) {
    return jwt.verify(
      accessToken,
      config.AUTH.ACCESS_TOKEN.SECRET
    ) as accessTokenPayload;
  }

  private generateRefreshToken(user: UserAttributes, session: UserSession) {
    const expiryDate = moment(new Date()).add(
      config.AUTH.REFRESH_TOKEN.EXPIRY,
      'minutes'
    );

    const payload: refreshTokenPayload = {
      userId: user._id,
      tokenVersion: session.refTokenVersion,
      sessionId: session.sessionID,
      exp: expiryDate.unix(),
    };

    const token = jwt.sign(payload, config.AUTH.REFRESH_TOKEN.SECRET);

    return {
      token,
      expiry: expiryDate.toDate(),
    };
  }

  async refreshTokens(refreshToken: string) {
    const { user, session } = await this.validateRefreshToken(refreshToken);

    session.refTokenVersion += 1;
    session.lastRefresh = new Date();

    user.save().catch((error) => logger.log(error));

    const newAccessToken = this.generateAccessToken(user, session);
    const newRefreshToken = this.generateRefreshToken(user, session);

    return {
      userData: {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  private async validateRefreshToken(refreshToken: string) {
    const { userId, sessionId, tokenVersion } = jwt.decode(
      refreshToken
    ) as refreshTokenPayload;

    const user = await User.findOne({
      _id: userId,
      'userSessions.sessionID': sessionId,
    });

    if (!user) {
      throw new UnauthorizedError(
        'Associated user not found or is not activated!'
      );
    }

    const session = user.userSessions.find(
      (session) => session.sessionID === sessionId
    );

    if (!session) {
      throw new UnauthorizedError('Associated session not found!');
    }

    if (session.refTokenVersion !== tokenVersion) throw new InvalidTokenError();

    jwt.verify(refreshToken, config.AUTH.REFRESH_TOKEN.SECRET);

    return { user, session };
  }

  async logout(userId: string, sessionId: string) {
    const user = await User.findOne({
      _id: userId,
      'userSessions.sessionID': sessionId,
    });

    if (!user) {
      throw new UnauthorizedError(
        'You are not Logged In! Please Log In First!'
      );
    }

    user.userSessions = user.userSessions.filter(
      (session) => session.sessionID !== sessionId
    );

    user.save().catch((err) => {
      logger.log(err);
    });
  }
}

const authService = new AuthService();
export default authService;
