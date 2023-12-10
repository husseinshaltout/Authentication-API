import { Request, Response, Router } from 'express';

import HttpStatus from '@common/enums/httpStatus';

import catchAsync from '@common/middlewares/catchAsync';

import userService from '@app/user/user.service';
import UnauthorizedError from '@common/errors/unauthorizedError';

class UserController {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/me', catchAsync(this.getMe));
  }

  private async getMe(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      throw new UnauthorizedError('Unauthorized: No token provided');

    const user = await userService.getMe(authHeader);

    res.status(HttpStatus.OK).json({
      userID: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }
}

const userController = new UserController();
export default userController;
