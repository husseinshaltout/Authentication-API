import HttpStatus from '@common/enums/httpStatus';
import AppError from '../appError';

import { MongoError } from 'mongodb';

export default class MongoDuplicateError extends AppError {
  statusCode = HttpStatus.CONFLICT;

  constructor(private error: MongoError) {
    super(
      MongoDuplicateError.getFields(error).concat(
        ' already exists. Please use another!'
      )
    );
  }

  serializeErrors() {
    return [{ message: this.message }];
  }

  private static getFields(error: MongoError) {
    return error.errmsg
      ? error.errmsg
          .split('index: ')[1]
          .split(' ')[0]
          .split('_1')[0]
          .replace('_1', '')
          .replace('s.', ' ')
      : ' ';
  }
}
