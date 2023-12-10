import { User } from '@models/user.model';

import BadRequestError from '@common/errors/badRequestError';

class UserService {
  constructor() {}

  async getUserById(userId: string) {
    const user = await User.findById(userId);

    if (!user) throw new BadRequestError('User not found');

    return user;
  }
}

const userService = new UserService();
export default userService;
