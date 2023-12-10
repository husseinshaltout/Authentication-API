// Import Dependencies
import { format, createLogger, transports } from 'winston';
import config from '@config';

// Create a File Logger Transport
const fileTransport = new transports.File({
  filename: 'logs/server.log',
  format: format.combine(format.json(), format.prettyPrint()),
});

// Create a Console Logger Transport
const consoleTransport = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.printf(({ level, message, timestamp, stack }) => {
      if (stack) return `[${timestamp}] | ${level}: ${message} \n${stack}`;
      return `[${timestamp}] | ${level}: ${message}`;
    })
  ),
});

// Create a Logger and Load [Console] in case (DEV) and Load [Console + File] in case (PROD)
const logger = createLogger({
  level: config.LOG_LEVEL,
  format: format.combine(
    format.errors({ stack: true }),
    format.splat(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    })
  ),
  transports:
    config.NODE_ENV === 'production'
      ? [fileTransport, consoleTransport]
      : [consoleTransport],
});

export default logger;
