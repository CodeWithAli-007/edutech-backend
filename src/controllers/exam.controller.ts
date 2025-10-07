import { Request, Response } from 'express';
import { User } from '../entities/User.entity';
import {
  createExam,
  getExam,
  findExamsByCourse,
  findExamsByTeacher,
  updateExam,
  deleteExam,
  getTeacherCourses,
  getTeacherLessons
} from '../services/exam.service';
import { CreateExamInput, UpdateExamInput } from '../schemas/exam.schema';

export const createExamHandler = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user as User;
    const exam = await createExam(req.body, user);
    
    res.status(201).json({
      status: 'success',
      data: exam
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getExamHandler = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user as User;
    const exam = await getExam(req.params.examId, user);
    
    res.status(200).json({
      status: 'success',
      data: exam
    });
  } catch (error: any) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getExamsByCourseHandler = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user as User;
    const exams = await findExamsByCourse(req.params.courseId, user);
    
    res.status(200).json({
      status: 'success',
      data: exams
    });
  } catch (error: any) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getExamsHandler = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user as User;
    const exams = await findExamsByTeacher(req, user);
    
    res.status(200).json({
      status: 'success',
      data: exams
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const updateExamHandler = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user as User;
    const exam = await updateExam(req.params.examId, req.body, user);
    
    res.status(200).json({
      status: 'success',
      data: exam
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const deleteExamHandler = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user as User;
    const result = await deleteExam(req.params.examId, user);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getTeacherCoursesHandler = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user as User;
    const courses = await getTeacherCourses(user);
    
    res.status(200).json({
      status: 'success',
      data: courses
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getTeacherLessonsHandler = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user as User;
    const lessons = await getTeacherLessons(req.params.courseId, user);
    
    res.status(200).json({
      status: 'success',
      data: lessons
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};