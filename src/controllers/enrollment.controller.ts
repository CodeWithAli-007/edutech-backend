import { NextFunction, Request, Response } from 'express';
import { findUserById } from '../services/user.service';
import AppError from '../utils/appError';
import {
  createEnrollment,
  getEnrollment,
  findEnrollmentsByStudent,
  findEnrollmentsByCourse,
  findEnrollmentsByInstitute,
  updateEnrollment,
  deleteEnrollment,
  getAvailableStudents,
  getAvailableCourses
} from '../services/enrollment.service';

export const createEnrollmentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user_id);
    if (!user) {
      return next(new AppError(401, 'User not found'));
    }

    const enrollment = await createEnrollment(req.body, user);

    res.status(201).json({
      status: 'success',
      message: 'Student enrolled successfully',
      data: {
        enrollment: {
          enrollment_id: enrollment.enrollment_id,
          studentId: enrollment.studentId,
          courseId: enrollment.courseId,
          enrolledAt: enrollment.enrolledAt,
          updatedBy: enrollment.updatedBy
        }
      },
    });
  } catch (err: any) {
    if (err.message.includes('already enrolled')) {
      return res.status(409).json({
        status: 'fail',
        message: err.message,
      });
    }
    if (err.message.includes('not found') || err.message.includes('not belong')) {
      return res.status(404).json({
        status: 'fail',
        message: err.message,
      });
    }
    if (err.message.includes('Only institute admins') || err.message.includes('Access denied')) {
      return res.status(403).json({
        status: 'fail',
        message: err.message,
      });
    }
    next(err);
  }
};

export const getEnrollmentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const enrollment = await getEnrollment(req.params.enrollmentId);
    if (!enrollment) {
      return next(new AppError(404, 'Enrollment not found'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        enrollment: enrollment,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getEnrollmentsByStudentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user_id);
    if (!user) {
      return next(new AppError(401, 'User not found'));
    }

    const enrollments = await findEnrollmentsByStudent(req.params.studentId, user);

    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: {
        enrollments: enrollments,
      },
    });
  } catch (err: any) {
    if (err.message.includes('Access denied') || err.message.includes('not found')) {
      return res.status(403).json({
        status: 'fail',
        message: err.message,
      });
    }
    next(err);
  }
};

export const getEnrollmentsByCourseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user_id);
    if (!user) {
      return next(new AppError(401, 'User not found'));
    }

    const enrollments = await findEnrollmentsByCourse(req.params.courseId, user);

    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: {
        enrollments: enrollments,
      },
    });
  } catch (err: any) {
    if (err.message.includes('Access denied') || err.message.includes('not found') || err.message.includes('assigned to you')) {
      return res.status(403).json({
        status: 'fail',
        message: err.message,
      });
    }
    next(err);
  }
};

export const getEnrollmentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user_id);
    if (!user) {
      return next(new AppError(401, 'User not found'));
    }

    const result = await findEnrollmentsByInstitute(req, user);

    res.status(200).json({
      status: 'success',
      results: result.enrollments.length,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      data: {
        enrollments: result.enrollments,
      },
    });
  } catch (err: any) {
    if (err.message.includes('Only institute admins')) {
      return res.status(403).json({
        status: 'fail',
        message: err.message,
      });
    }
    next(err);
  }
};

export const updateEnrollmentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user_id);
    if (!user) {
      return next(new AppError(401, 'User not found'));
    }

    const enrollment = await updateEnrollment(req.params.enrollmentId, req.body, user);

    res.status(200).json({
      status: 'success',
      message: 'Enrollment updated successfully',
      data: {
        enrollment: enrollment,
      },
    });
  } catch (err: any) {
    if (err.message.includes('not found')) {
      return res.status(404).json({
        status: 'fail',
        message: err.message,
      });
    }
    if (err.message.includes('already enrolled') || err.message.includes('not belong') || err.message.includes('Only institute admins')) {
      return res.status(403).json({
        status: 'fail',
        message: err.message,
      });
    }
    next(err);
  }
};

export const deleteEnrollmentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user_id);
    if (!user) {
      return next(new AppError(401, 'User not found'));
    }

    await deleteEnrollment(req.params.enrollmentId, user);

    res.status(204).json({
      status: 'success',
      message: 'Enrollment deleted successfully',
      data: null,
    });
  } catch (err: any) {
    if (err.message.includes('not found')) {
      return res.status(404).json({
        status: 'fail',
        message: err.message,
      });
    }
    if (err.message.includes('Only institute admins')) {
      return res.status(403).json({
        status: 'fail',
        message: err.message,
      });
    }
    next(err);
  }
};

export const getAvailableStudentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user_id);
    if (!user) {
      return next(new AppError(401, 'User not found'));
    }

    const students = await getAvailableStudents(user);

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: {
        students: students,
      },
    });
  } catch (err: any) {
    if (err.message.includes('Only institute admins')) {
      return res.status(403).json({
        status: 'fail',
        message: err.message,
      });
    }
    next(err);
  }
};

export const getAvailableCoursesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(res.locals.user_id);
    if (!user) {
      return next(new AppError(401, 'User not found'));
    }

    const courses = await getAvailableCourses(user);

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses: courses,
      },
    });
  } catch (err: any) {
    if (err.message.includes('Only institute admins')) {
      return res.status(403).json({
        status: 'fail',
        message: err.message,
      });
    }
    next(err);
  }
};
