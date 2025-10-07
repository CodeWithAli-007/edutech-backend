
import { NextFunction, Request, Response } from 'express';
import { findUserById } from '../services/user.service';
import AppError from '../utils/appError';
import { createStudent, findStudents, getStudent, updateStudent } from '../services/student.service';
import { createUser } from '../services/user.service';
import { RoleEnumType } from '../entities/User.entity';
import { CreateUserDetailsInput, DeleteUserDetailsInput, GetUserDetailsInput, mapResponseToUserDetails, UpdateUserDetailsInput } from '../schemas/userDetails.schema';
import { DeleteStudentInput } from '../schemas/student.schema';

export const createStudentHandler = async (
  req: Request<{}, {}, CreateUserDetailsInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if student already exists (only if userId is provided)
    if (req.body.userId) {
      const studentExists = await getStudent(req.body.userId);
      if (studentExists) {
        return res.status(409).json({
          status: 'fail',
          message: 'student with that userId already exist',
        });
      }
    }

    // Get the authenticated user
    const userId = res.locals.user_id;
    if (!userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required',
      });
    }

    const authenticatedUser = await findUserById(userId);
    if (!authenticatedUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    // Create student using the new service function
    const student = await createStudent(mapResponseToUserDetails(req.body), authenticatedUser);

    res.status(201).json({
      status: 'success',
      message: 'Student created successfully',
      data: {
        student: student,
      },
    });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'student with that name already exist',
      });
    }
    next(err);
  }
};

export const getStudentHandler = async (
  req: Request<GetUserDetailsInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const student = await getStudent(req.params.userId);
    if (!student) {
      return next(new AppError(404, 'studentId not found'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        student,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getStudentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Students = await findStudents(req, res.locals.user);

    res.status(200).json({
      status: 'success',
      results: Students.length,
      data: {
        students: Students,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateStudentHandler = async (
  req: Request<UpdateUserDetailsInput['params'], {}, UpdateUserDetailsInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const student = await getStudent(req.params.userId);

    if (!student) {
      return next(new AppError(404, 'Update student with that ID not found'));
    }

    const updatedStudent = await updateStudent(req.params.userId, mapResponseToUserDetails(req.body));

    res.status(200).json({
      status: 'success',
      message: 'Student updated successfully',
      data: {
        student: updatedStudent,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteStudentHandler = async (
  req: Request<DeleteStudentInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const student = await getStudent(req.params.userId);

    if (!student) {
      return next(new AppError(404, 'Student with that ID not found'));
    }

    await student.remove();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};
