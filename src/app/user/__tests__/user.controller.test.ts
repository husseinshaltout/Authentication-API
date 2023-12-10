import server from 'server';
import request from 'supertest';
import HttpStatus from '@common/enums/httpStatus';
import userService from '@app/user/user.service';

const app = server.getExpressApp();

jest.mock('@app/user/user.service');

jest.mock('@app/auth/auth.service', () => ({
  protect: jest.fn((token: string) => {
    return {
      userId: '65762443f268cff8708190f1',
      tokenVersion: 0,
      sessionId: 'WWY8F7CXADT6',
      exp: new Date('2023-12-13T09:26:08.510Z'),
    };
  }),
}));

describe('UserController', () => {
  describe('GET /me', () => {
    it('should get user details successfully', async () => {
      const mockUser = {
        _id: '65762443f268cff8708190f1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'data.emanil@example.com',
      };

      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTc2MjQ0M2YyNjhjZmY4NzA4MTkwZjEiLCJlbWFpbCI6ImRhdGEuZW1hbmlsQGV4YW1wbGUuY29tIiwic2Vzc2lvbklkIjoiV1dZOEY3Q1hBRFQ2IiwiZXhwIjoxNzAyNDU5NTY4LCJpYXQiOjE3MDIyNDM1Njh9.sldu1d0kkkBaaiVbRTTh2DMFx_8SQYxE6BOpqYoAbos';

      const res = await request(app)
        .get('/api/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        userID: mockUser._id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
      });
    });
  });
});
