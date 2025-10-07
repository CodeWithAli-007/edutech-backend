import { NextFunction, Request, Response } from 'express';
import {
  getStudentEnrolledCourses,
  getStudentCourseDetails,
  getStudentCourseLessons,
  getStudentExams,
  getStudentExamDetails,
  submitExamAttempt
} from '../services/student.service';
import AppError from '../utils/appError';

// Get student's enrolled courses
export const getEnrolledCoursesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const enrollments = await getStudentEnrolledCourses(res.locals.user);

    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: {
        enrollments
      }
    });
  } catch (err: any) {
    next(err);
  }
};

// Get course details with lessons for a student
export const getCourseDetailsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const course = await getStudentCourseDetails(courseId, res.locals.user);

    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (err: any) {
    next(err);
  }
};

// Get lessons for a specific course (for enrolled students)
export const getCourseLessonsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.params;
    const lessons = await getStudentCourseLessons(courseId, res.locals.user);

    res.status(200).json({
      status: 'success',
      results: lessons.length,
      data: {
        lessons
      }
    });
  } catch (err: any) {
    next(err);
  }
};

// Get exams available for a student's enrolled courses
export const getExamsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { courseId } = req.query;
    const exams = await getStudentExams(res.locals.user, courseId as string);

    res.status(200).json({
      status: 'success',
      results: exams.length,
      data: {
        exams
      }
    });
  } catch (err: any) {
    next(err);
  }
};

// Get specific exam details for a student
export const getExamDetailsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { examId } = req.params;
    const exam = await getStudentExamDetails(examId, res.locals.user);

    res.status(200).json({
      status: 'success',
      data: {
        exam
      }
    });
  } catch (err: any) {
    next(err);
  }
};

// Submit exam attempt
export const submitExamAttemptHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;
    
    const result = await submitExamAttempt(examId, res.locals.user, answers);

    res.status(200).json({
      status: 'success',
      message: 'Exam submitted successfully',
      data: {
        result
      }
    });
  } catch (err: any) {
    next(err);
  }
};