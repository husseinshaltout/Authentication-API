declare module 'xss-clean' {
  import { Request, Response, NextFunction } from 'express';
  const value: () => (req: Request, res: Response, next: NextFunction) => void;

  export default value;
}
