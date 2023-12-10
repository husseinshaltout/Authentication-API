import { Request, Response, Router } from 'express';

import HttpStatus from '@common/enums/httpStatus';

import catchAsync from '@common/middlewares/catchAsync';

import userService from '@app/user/user.service';
import protect from '@app/auth/middleware/protect';

class UserController {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/me', protect, catchAsync(this.getMe));
  }

  private async getMe(req: Request, res: Response) {
    const userId = req.body.userId;
    const user = await userService.getUserById(userId);

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
