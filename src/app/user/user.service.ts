import jwt, { JwtPayload } from 'jsonwebtoken';

import config from '@config';

import { User } from '@models/user.model';

import BadRequestError from '@common/errors/badRequestError';

class UserService {
  constructor() {}

  async getUserById(userId: string) {
    const user = await User.findById(userId);

    if (!user) throw new BadRequestError('User not found');

    return user;
  }

  async getMe(bearerToken: string) {
    const authHeader = bearerToken?.split(' ')[1] as string;
    const decoded = jwt.verify(
      authHeader,
      config.AUTH.ACCESS_TOKEN.SECRET
    ) as JwtPayload;

    const user = await this.getUserById(decoded.userId);
    return user;
  }
}

const userService = new UserService();
export default userService;
