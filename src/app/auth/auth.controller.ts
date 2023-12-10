import { Request, Response, Router } from 'express';

import HttpStatus from '@common/enums/httpStatus';

import {
  validateSignUp,
  validateLogin,
} from '@common/middlewares/validateBody.middleware';
import catchAsync from '@common/middlewares/catchAsync';

import authService from '@app/auth/auth.service';

class AuthController {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signup', validateSignUp, catchAsync(this.signUp));
    this.router.post('/login', validateLogin, catchAsync(this.login));
  }

  private async signUp(req: Request, res: Response) {
    let newUser = await authService.signUp(req.body);
    res.status(HttpStatus.CREATED).json({
      msg: `Created User ${newUser.user.firstName} ${newUser.user.lastName} Successfully`,
      accessToken: newUser.accessToken,
    });
  }

  private async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { accessToken, user } = await authService.login(email, password);

    res.status(HttpStatus.OK).json({
      userID: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: email,
      accessToken: accessToken,
    });
  }
}

const authController = new AuthController();
export default authController;
