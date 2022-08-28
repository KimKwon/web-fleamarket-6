export const MAX_COOKIE_AGE = 1000 * 60 * 60 * 24 * 10;
export const TOKEN_NAME = 'user_token';
export const JWT_ERROR_MAP = {
  'jwt malformed': () => {
    throw new Error('JWT is Malformed.');
  },
  'jwt expired': () => {
    throw new Error('JWT is Expired.');
  },
};
