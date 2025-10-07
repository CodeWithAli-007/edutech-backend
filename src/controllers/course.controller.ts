import { Request, Response, NextFunction } from 'express';
import { 
  createCourse, 
  getCourse, 
  findCourses, 
  updateCourse, 
  deleteCourse,
  assignTeacherToCourse 
} from '../services/course.service';
import { AppError } from '../utils/appError';

export const createCourseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await createCourse(req.body, res.locals.user);
    res.status(201).json({
      status: 'success',
      data: {
        course,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getCourseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await getCourse(req.params.id);
    if (!course) {
      return next(new AppError(404, 'Course not found'));
    }
    res.status(200).json({
      status: 'success',
      data: {
        course,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getCoursesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await findCourses(req, res.locals.user);
    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateCourseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await updateCourse(req.params.id, req.body, res.locals.user);
    if (course.affected === 0) {
      return next(new AppError(404, 'Course not found'));
    }
    res.status(200).json({
      status: 'success',
      message: 'Course updated successfully',
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteCourseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await deleteCourse(req.params.id);
    if (course.affected === 0) {
      return next(new AppError(404, 'Course not found'));
    }
    res.status(200).json({
      status: 'success',
      message: 'Course deleted successfully',
    });
  } catch (err: any) {
    next(err);
  }
};

export const assignTeacherHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { teacherId } = req.body;
    const course = await assignTeacherToCourse(req.params.courseId, teacherId, res.locals.user);
    if (course.affected === 0) {
      return next(new AppError(404, 'Course not found'));
    }
    res.status(200).json({
      status: 'success',
      message: 'Teacher assigned to course successfully',
    });
  } catch (err: any) {
    next(err);
  }
};

