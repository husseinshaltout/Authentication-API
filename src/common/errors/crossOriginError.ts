import HttpStatus from '@common/enums/httpStatus';
import AppError from './appError';

export default class CrossOriginError extends AppError {
  statusCode = HttpStatus.UNAUTHORIZED;

  constructor() {
    super('Error: Cross-origin request is blocked');
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
