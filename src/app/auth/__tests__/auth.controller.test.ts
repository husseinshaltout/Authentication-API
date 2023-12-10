import server from 'server';
import request from 'supertest';

import HttpStatus from '@common/enums/httpStatus';

const app = server.getExpressApp();

describe('AuthController', () => {
  describe('POST /signup', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(HttpStatus.CREATED);

      expect(response.body.msg).toEqual(
        `Created User ${userData.firstName} ${userData.lastName} Successfully`
      );
    });

    describe('POST /signup - Bad Scenarios', () => {
      it('should return validation error for incomplete data', async () => {
        const incompleteUserData = {
          email: 'incomplete@example.com',
          password: 'password123',
        };

        const response = await request(app)
          .post('/api/auth/signup')
          .send(incompleteUserData)
          .expect(HttpStatus.BAD_REQUEST);

        expect(response.body).toEqual(
          expect.objectContaining({
            error: 'Bad Request',
            message: 'Validation failed',
            statusCode: 400,
            validation: {
              body: {
                keys: ['passwordConfirm'],
                message: '"passwordConfirm" is required',
                source: 'body',
              },
            },
          })
        );
      });

      it('should return validation error for invalid data', async () => {
        const invalidUserData = {
          firstName: 'Invalid*Name',
          lastName: '123',
          email: 'invalidemail',
          password: 'pass',
          passwordConfirm: 'password',
        };

        const response = await request(app)
          .post('/api/auth/signup')
          .send(invalidUserData)
          .expect(HttpStatus.BAD_REQUEST);

        expect(response.body).toEqual(
          expect.objectContaining({
            error: 'Bad Request',
            message: 'Validation failed',
            statusCode: 400,
            validation: {
              body: {
                keys: ['firstName'],
                message:
                  '"firstName" must only contain alpha-numeric characters',
                source: 'body',
              },
            },
          })
        );
      });
    });
  });

  describe('POST /signin', () => {
    it('should log in the user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password',
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(loginData)
        .expect(HttpStatus.OK);

      expect(response.body.userID).toBeDefined();
      expect(response.body.firstName).toBeDefined();
      expect(response.body.lastName).toBeDefined();
      expect(response.body.email).toBe(loginData.email);
      expect(response.body.accessToken).toBeDefined();
    });
    describe('POST /signin - Bad Scenarios', () => {
      it('should return validation error for incomplete data', async () => {
        const incompleteLoginData = {
          password: 'password123',
        };

        const response = await request(app)
          .post('/api/auth/signin')
          .send(incompleteLoginData)
          .expect(HttpStatus.BAD_REQUEST);

        expect(response.body).toEqual(
          expect.objectContaining({
            error: 'Bad Request',
            message: 'Validation failed',
            statusCode: 400,
            validation: {
              body: {
                keys: ['email'],
                message: '"email" is required',
                source: 'body',
              },
            },
          })
        );
      });

      it('should return unauthorized for incorrect credentials', async () => {
        const incorrectLoginData = {
          email: 'test@example.com',
          password: 'incorrectpassword',
        };

        const response = await request(app)
          .post('/api/auth/signin')
          .send(incorrectLoginData)
          .expect(HttpStatus.UNAUTHORIZED);

        expect(response.body).toEqual({
          errors: [
            {
              message: 'Wrong Email or Password! Please Try Again',
            },
          ],
          message: 'Wrong Email or Password! Please Try Again',
        });
      });
    });
  });
});
