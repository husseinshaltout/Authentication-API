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
  });
});
