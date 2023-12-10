import jwt from 'jsonwebtoken';
import moment from 'moment';

import config from '@config';

import { User, UserDocument, UserAttributes } from '@models/user.model';

import BadRequestError from '@common/errors/badRequestError';
import ConflictError from '@common/errors/conflictError';
import { accessTokenPayload } from './types/tokenPayload';

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

    let newUser = await User.create(userFields);

    return { user: newUser, accessToken: this.generateAccessToken(newUser) };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email: email }).select('+password');

    if (!user || !(await user.isCorrectPassword(password, user.password)))
      throw new Error('Wrong Email or Password! Please Try Again');

    return { user: user, accessToken: this.generateAccessToken(user) };
  }

  private generateAccessToken(user: UserAttributes) {
    const expiryDate = moment(new Date()).add(
      config.AUTH.ACCESS_TOKEN.EXPIRY,
      'minutes'
    );

    const payload: accessTokenPayload = {
      userId: user._id,
      email: user.email,
      exp: expiryDate.unix(),
    };

    const token = jwt.sign(payload, config.AUTH.ACCESS_TOKEN.SECRET);

    return {
      token,
      expiry: expiryDate.toDate(),
    };
  }
}

const authService = new AuthService();
export default authService;
