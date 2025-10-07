
import { NextFunction, Request, Response } from 'express';
import { findUserById } from '../services/user.service';
import AppError from '../utils/appError';
import { createTeacher, findTeachers, getTeacher, updateTeacher, deleteTeacher } from '../services/teacher.service';
import { CreateUserDetailsInput, DeleteUserDetailsInput, GetUserDetailsInput, mapResponseToUserDetails, UpdateUserDetailsInput } from '../schemas/userDetails.schema';
import { DeleteTeacherInput } from '../schemas/teacher.schema';

export const createTeacherHandler = async (
  req: Request<{}, {}, CreateUserDetailsInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Only check for existing teacher if userId is provided
    if (req.body.userId) {
      const teacherExists = await getTeacher(req.body.userId);
      if (teacherExists) {
        return res.status(409).json({
          status: 'fail',
          message: 'teacher with that userId already exist',
        });
      }
    }
    const user = await findUserById(res.locals.user_id as string);
    const teacher = await createTeacher(mapResponseToUserDetails(req.body), user);

    res.status(201).json({
      status: 'success',
      message: 'teacher created successfully',
      data: {
        firstName: teacher.firstName,
        middleName: teacher.middleName,
        lastName: teacher.lastName,
        updatedBy: teacher.updatedBy,
        instituteId: teacher.instituteId,
      },
    });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'teacher with that name already exist',
      });
    }
    next(err);
  }
};

export const getTeacherHandler = async (
  req: Request<GetUserDetailsInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const teacher = await getTeacher(req.params.teacherId);
    if (!teacher) {
      return next(new AppError(404, 'teacherId not found'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        teacher: teacher,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getTeachersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Teachers = await findTeachers(req, res.locals.user);

    res.status(200).json({
      status: 'success',
      results: Teachers.length,
      data: {
        teachers: Teachers,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateTeacherHandler = async (
  req: Request<UpdateUserDetailsInput['params'], {}, UpdateUserDetailsInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const teacher = await getTeacher(req.params.teacherId);

    if (!teacher) {
      return next(new AppError(404, 'Update Teacher with that ID not found'));
    }

    const updatedTeacher = await updateTeacher(req.params.teacherId, mapResponseToUserDetails(req.body));

    res.status(200).json({
      status: 'success',
      data: {
        teacher: updatedTeacher,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteTeacherHandler = async (
  req: Request<DeleteTeacherInput['params']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const teacher = await getTeacher(req.params.teacherId);

    if (!teacher) {
      return next(new AppError(404, 'Teacher with that ID not found'));
    }

    await deleteTeacher(req.params.teacherId);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};
