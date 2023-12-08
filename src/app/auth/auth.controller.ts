import { Request, Response, Router } from 'express';

import HttpStatus from '@common/enums/httpStatus';

import catchAsync from '@common/middlewares/catchAsync';

class AuthController {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', catchAsync(this.index));
  }

  private async index(req: Request, res: Response) {
    res.status(HttpStatus.OK).json({
      msg: `Auth Index`,
    });
  }
}

const authController = new AuthController();
export default authController;
