// Import Dependencies
import express from 'express';
import cookieParser from 'cookie-parser';

import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import sanitize from 'mongo-sanitize';

import logger from '@loaders/logger';
import CrossOriginError from '@common/errors/crossOriginError';
import RouteNotFoundError from '@common/errors/routeNotFoundError';

import exceptionsController from '@common/middlewares/exceptionController';

// Declare Type for Route-Router Mapping
type appRouter = { route: string; router: express.Router };

export default class Application {
  app;
  apiRouters: appRouter[];
  server: http.Server;

  // Constructor: Create an E-Tag Disable express app on construction
  constructor() {
    this.app = express().set('etag', false);
  }

  // Set all main API Router List
  setApiRouters(apiRouters: appRouter[]) {
    this.apiRouters = apiRouters;
  }

  // Add On App Features
  enableRequestLimiter(numRequestsPerHr: number) {
    this.app.use(
      rateLimit({
        windowMs: 60 * 60 * 1000,
        max: numRequestsPerHr,
        message: 'Too many requests. Please try again later',
      })
    );
    return this;
  }

  enableRequestLogging() {
    this.app.use(morgan('dev'));
    return this;
  }

  enableSecurityHeaders() {
    this.app.use(helmet());
    return this;
  }

  enableCORS(whitelist: string[]) {
    const corsOptions: cors.CorsOptions = {
      origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new CrossOriginError());
        }
      },
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 1000,
    };

    this.app.use(cors(corsOptions));
    return this;
  }

  enableTrustProxy() {
    this.app.set('trust proxy', 1);
    return this;
  }

  enableBodyParser() {
    this.app.use(express.urlencoded({ extended: true, limit: '5kb' }));
    this.app.use(express.json({ limit: '5kb' }));
    return this;
  }

  enableCookieParser() {
    this.app.use(cookieParser());
    return this;
  }

  enableXssProtection() {
    this.app.use(xss());
    return this;
  }

  enableErrorController() {
    this.app.use(exceptionsController);
    return this;
  }

  enableMongoSanitize() {
    this.app.use((req, res, next) => {
      req.body = sanitize(req.body);
      req.params = sanitize(req.params);
      req.query = sanitize(req.query);
      next();
    });
    return this;
  }

  // Private function to use one router at a time
  private useApiRoute(route: string, router: express.Router) {
    this.app.use(`${route}`, router);
    return this;
  }

  // Adding all router in list
  useApiRouters() {
    this.apiRouters.forEach((router) => {
      this.useApiRoute(`/api${router.route}`, router.router);
    });
    return this;
  }

  // Add Unknown Route Handling
  redirectToNotFound() {
    this.app.all('*', (req) => {
      throw new RouteNotFoundError(req.originalUrl);
    });
    return this;
  }

  // Start Express Server
  startServer(port: number) {
    this.server = this.app.listen(port, () => {
      logger.info(`Server Started and Listening on port ${port}...`);
    });
  }

  // Close Express Server
  closeServer() {
    return this.server.close();
  }
}
