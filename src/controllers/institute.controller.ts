
import { NextFunction, Request, Response } from 'express';
import { findUserById } from '../services/user.service';
import AppError from '../utils/appError';
import { createInstitute, findInstitutes, getInstitute, updateInstitute, deleteInstitute } from '../services/institute.service';
import { CreateInstituteInput, DeleteInstituteInput, GetInstituteInput, mapResponseToInstitute, UpdateInstituteInput } from '../schemas/institute.schema';

export const createInstituteHandler = async (
  req: Request<{}, {}, CreateInstituteInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user_id as string);
    const institute = await createInstitute(mapResponseToInstitute(req.body), user);

    res.status(201).json({
      status: 'success',
      message: 'Institute created successfully',
      data: {
        instituteId: institute.institute_id,
        name: institute.name,
        createdAt: institute.createdAt,
      },
    });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'institute with that name already exist',
      });
    }
    next(err);
  }
};

export const getInstituteHandler = async (
  req: Request<GetInstituteInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const institute = await getInstitute(req.params.instituteId);
    if (!institute) {
      return next(new AppError(404, 'InstituteId not found'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        institute: institute,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getInstitutesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const institutes = await findInstitutes(req);
    res.status(200).json({
      status: 'success',
      results: institutes.length,
      data: {
        institute: institutes,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateInstituteHandler = async (
  req: Request<UpdateInstituteInput['params'], {}, UpdateInstituteInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedInstitute = await updateInstitute(req.params.instituteId, mapResponseToInstitute(req.body));

    res.status(200).json({
      status: 'success',
      data: {
        institute: updatedInstitute,
      },
    });
  } catch (err: any) {
    if (err.message === 'Institute not found') {
      return next(new AppError(404, 'Update institute with that ID not found'));
    }
    next(err);
  }
};

export const deleteInstituteHandler = async (
  req: Request<DeleteInstituteInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const institute = await getInstitute(req.params.instituteId);

    if (!institute) {
      return next(new AppError(404, 'Institute with that ID not found'));
    }

    const deleted = await deleteInstitute(req.params.instituteId);

    if (!deleted) {
      return next(new AppError(500, 'Failed to delete institute'));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};
