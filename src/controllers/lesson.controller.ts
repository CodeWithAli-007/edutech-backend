import { NextFunction, Request, Response } from 'express';
import { 
  createLesson, 
  getLesson, 
  findLessonsByCourse, 
  findLessonsByTeacher, 
  updateLesson, 
  deleteLesson,
  getTeacherCourses 
} from '../services/lesson.service';
import AppError from '../utils/appError';
import { 
  CreateLessonInput, 
  UpdateLessonInput, 
  GetLessonInput, 
  DeleteLessonInput, 
  GetLessonsByCourseInput 
} from '../schemas/lesson.schema';

export const createLessonHandler = async (
  req: Request<{}, {}, CreateLessonInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lesson = await createLesson(req.body, res.locals.user);

    res.status(201).json({
      status: 'success',
      message: 'Lesson created successfully',
      data: {
        lesson: {
          lesson_id: lesson.lesson_id,
          title: lesson.title,
          lesson_type: lesson.lesson_type,
          lessonUrl: lesson.lessonUrl,
          status: lesson.status,
          position: lesson.position,
          hasExam: lesson.hasExam,
          courseId: lesson.courseId,
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
        },
      },
    });
  } catch (err: any) {
    if (err.message.includes('Course not found')) {
      return next(new AppError(404, err.message));
    }
    if (err.message.includes('You can only create lessons for courses assigned to you')) {
      return next(new AppError(403, err.message));
    }
    if (err.message.includes('Only teachers can create lessons')) {
      return next(new AppError(403, err.message));
    }
    next(err);
  }
};

export const getLessonHandler = async (
  req: Request<GetLessonInput['params']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lesson = await getLesson(req.params.lessonId);
    if (!lesson) {
      return next(new AppError(404, 'Lesson not found'));
    }

    res.status(200).json({
      status: 'success',
      data: {
        lesson: {
          lesson_id: lesson.lesson_id,
          title: lesson.title,
          lesson_type: lesson.lesson_type,
          lessonUrl: lesson.lessonUrl,
          status: lesson.status,
          position: lesson.position,
          hasExam: lesson.hasExam,
          courseId: lesson.courseId,
          course: lesson.course,
          user: lesson.user,
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
        },
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getLessonsByCourseHandler = async (
  req: Request<GetLessonsByCourseInput['params']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessons = await findLessonsByCourse(req.params.courseId, res.locals.user);

    res.status(200).json({
      status: 'success',
      results: lessons.length,
      data: {
        lessons: lessons.map(lesson => ({
          lesson_id: lesson.lesson_id,
          title: lesson.title,
          lesson_type: lesson.lesson_type,
          lessonUrl: lesson.lessonUrl,
          status: lesson.status,
          position: lesson.position,
          hasExam: lesson.hasExam,
          courseId: lesson.courseId,
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
        })),
      },
    });
  } catch (err: any) {
    if (err.message.includes('Course not found')) {
      return next(new AppError(404, err.message));
    }
    if (err.message.includes('You can only view lessons for courses assigned to you')) {
      return next(new AppError(403, err.message));
    }
    next(err);
  }
};

export const getLessonsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessons = await findLessonsByTeacher(req, res.locals.user);

    res.status(200).json({
      status: 'success',
      results: lessons.length,
      data: {
        lessons: lessons.map(lesson => ({
          lesson_id: lesson.lesson_id,
          title: lesson.title,
          lesson_type: lesson.lesson_type,
          lessonUrl: lesson.lessonUrl,
          status: lesson.status,
          position: lesson.position,
          hasExam: lesson.hasExam,
          courseId: lesson.courseId,
          course: lesson.course,
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
        })),
      },
    });
  } catch (err: any) {
    if (err.message.includes('Only teachers can view lessons')) {
      return next(new AppError(403, err.message));
    }
    next(err);
  }
};

export const updateLessonHandler = async (
  req: Request<UpdateLessonInput['params'], {}, UpdateLessonInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lesson = await updateLesson(req.params.lessonId, req.body, res.locals.user);

    res.status(200).json({
      status: 'success',
      message: 'Lesson updated successfully',
      data: {
        lesson: {
          lesson_id: lesson.lesson_id,
          title: lesson.title,
          lesson_type: lesson.lesson_type,
          lessonUrl: lesson.lessonUrl,
          status: lesson.status,
          position: lesson.position,
          hasExam: lesson.hasExam,
          courseId: lesson.courseId,
          updatedAt: lesson.updatedAt,
        },
      },
    });
  } catch (err: any) {
    if (err.message.includes('Lesson not found')) {
      return next(new AppError(404, err.message));
    }
    if (err.message.includes('You can only update lessons for courses assigned to you')) {
      return next(new AppError(403, err.message));
    }
    if (err.message.includes('Only teachers can update lessons')) {
      return next(new AppError(403, err.message));
    }
    next(err);
  }
};

export const deleteLessonHandler = async (
  req: Request<DeleteLessonInput['params']>,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteLesson(req.params.lessonId, res.locals.user);

    res.status(200).json({
      status: 'success',
      message: 'Lesson deleted successfully',
    });
  } catch (err: any) {
    if (err.message.includes('Lesson not found')) {
      return next(new AppError(404, err.message));
    }
    if (err.message.includes('You can only delete lessons for courses assigned to you')) {
      return next(new AppError(403, err.message));
    }
    if (err.message.includes('Only teachers can delete lessons')) {
      return next(new AppError(403, err.message));
    }
    next(err);
  }
};

export const getTeacherCoursesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await getTeacherCourses(res.locals.user);

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses: courses.map(course => ({
          course_id: course.course_id,
          title: course.title,
          description: course.description,
          teacherId: course.teacherId,
          instituteId: course.instituteId,
        })),
      },
    });
  } catch (err: any) {
    if (err.message.includes('Only teachers can view their courses')) {
      return next(new AppError(403, err.message));
    }
    next(err);
  }
};