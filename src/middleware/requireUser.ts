
import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return next(
        new AppError(400, `Session has expired or user doesn't exist`)
      );
    }

    // Add user_id to res.locals for easy access
    res.locals.user_id = user.user_id;

    next();
  } catch (err: any) {
    next(err);
  }
};
