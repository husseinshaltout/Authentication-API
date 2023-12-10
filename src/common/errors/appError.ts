import HttpStatus from '@common/enums/httpStatus';

export default abstract class AppError extends Error {
  abstract statusCode: HttpStatus;

  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  abstract serializeErrors(): { message: string; path?: string }[];

  get status() {
    return `${this.statusCode}`.startsWith('4') ? 'Fail' : 'Error';
  }
}
