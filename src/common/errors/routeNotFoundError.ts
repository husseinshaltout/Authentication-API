import HttpStatus from '@common/enums/httpStatus';
import AppError from './appError';

export default class RouteNotFoundError extends AppError {
  statusCode = HttpStatus.NOT_FOUND;

  constructor(private url: string) {
    super(`Error: Requested Route (${url}) Not Found`);
  }

  serializeErrors() {
    return [{ message: this.message, path: this.url }];
  }
}
