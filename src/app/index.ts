import Application from '@loaders/app';

import authController from '@app/auth/auth.controller';

const appRouters = [{ route: '/', router: authController.router }];

const app = new Application();
app.setApiRouters(appRouters);

export default app;
