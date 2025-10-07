
import * as express from 'express';

export const getMeHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = res.locals.user;

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

