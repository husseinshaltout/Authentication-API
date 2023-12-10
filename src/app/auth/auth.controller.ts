import { Request, Response, Router } from 'express';

import HttpStatus from '@common/enums/httpStatus';

import {
  validateSignUp,
  validateLogin,
} from '@common/middlewares/validateBody.middleware';
import catchAsync from '@common/middlewares/catchAsync';
import protect from './middleware/protect';

import authService from '@app/auth/auth.service';
import UnauthorizedError from '@common/errors/unauthorizedError';
import defaultCookieOptions from './util/cookieConfig';
import config from '@config';

class AuthController {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signup', validateSignUp, catchAsync(this.signUp));
    this.router.post(
      '/login',
      validateLogin,
      catchAsync(this.login.bind(this))
    );
    this.router.patch(
      '/refresh-token',
      catchAsync(this.refreshTokens.bind(this))
    );
    this.router.post('/logout', protect, catchAsync(this.logout));
  }

  private async signUp(req: Request, res: Response) {
    const newUser = await authService.signUp(req.body);

    res.status(HttpStatus.CREATED).json({
      msg: `Created User ${newUser.user.firstName} ${newUser.user.lastName} Successfully`,
      accessToken: newUser.accessToken,
    });
  }

  private async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password
    );

    if (refreshToken) this.attachCookie(refreshToken, res);

    res.status(HttpStatus.OK).json({
      userID: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: email,
      accessToken: accessToken,
    });
  }

  private async refreshTokens(req: Request, res: Response) {
    const token = req.cookies[config.AUTH.REFRESH_TOKEN.COOKIE_NAME];

    if (!token) throw new UnauthorizedError();

    let newTokens;

    try {
      newTokens = await authService.refreshTokens(token);
    } catch (err) {
      res.clearCookie(config.AUTH.REFRESH_TOKEN.COOKIE_NAME);
      throw err;
    }

    this.attachCookie(newTokens.refreshToken, res);

    res.status(HttpStatus.OK).json({
      ...newTokens.userData,
      accessToken: newTokens.accessToken,
    });
  }

  private attachCookie(
    attachedToken: { token: string; expiry: Date },
    res: Response
  ) {
    const cookieOptions = {
      ...defaultCookieOptions,
      path: config.AUTH.REFRESH_TOKEN.COOKIE_PATH,
      expires: attachedToken.expiry,
    };

    res.cookie(
      config.AUTH.REFRESH_TOKEN.COOKIE_NAME,
      attachedToken.token,
      cookieOptions
    );
  }

  private async logout(req: Request, res: Response) {
    authService.logout(req.body.userId, req.body.sessionId);

    res.status(HttpStatus.OK).end();
  }
}

const authController = new AuthController();
export default authController;
