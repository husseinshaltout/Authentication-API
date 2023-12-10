import config from '@config';

const defaultCookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production' ? true : false,
  sameSite: config.NODE_ENV === 'production' ? true : 'none',
} as const;

export default defaultCookieOptions;
