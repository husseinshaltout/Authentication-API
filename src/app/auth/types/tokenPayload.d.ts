export type accessTokenPayload = {
  userId: string;
  email: string;
  sessionId: string;
  exp?: number;
};

export type refreshTokenPayload = {
  userId: string;
  sessionId: string;
  tokenVersion: number;
  exp?: number;
};
