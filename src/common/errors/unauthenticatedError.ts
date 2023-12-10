import AppError from './appError';
import HttpStatus from '@common/enums/httpStatus';

export default class UnauthenticatedError extends AppError {
  statusCode = HttpStatus.FORBIDDEN;

  constructor(
    message: string = "Unauthorized: You don't have permission for this"
  ) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
