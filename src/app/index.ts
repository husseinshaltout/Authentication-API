import Application from '@loaders/app';

import authController from '@app/auth/auth.controller';
import userController from '@app/user/user.controller';

const appRouters = [
  { route: '/auth', router: authController.router },
  { route: '/', router: userController.router },
];

const app = new Application();
app.setApiRouters(appRouters);

export default app;
