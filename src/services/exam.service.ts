import { Request } from 'express';
import { User } from '../entities/User.entity';
import { AppDataSource } from '../utils/data-source';
import { Exam, MCQQuestion } from '../entities/exam.entity';
import { Course } from '../entities/course.entity';
import { Lesson } from '../entities/lesson.entity';
import { CreateExamInput, UpdateExamInput } from '../schemas/exam.schema';

const examRepository = AppDataSource.getRepository(Exam);
const courseRepository = AppDataSource.getRepository(Course);
const lessonRepository = AppDataSource.getRepository(Lesson);

export const createExam = async (input: CreateExamInput, user: User) => {
  // Check if user has teacher role
  if (user.role !== 'teacher') {
    throw new Error('Only teachers can create exams');
  }

  // Verify that the course exists and the user is assigned as teacher to this course
  const course = await courseRepository.findOne({
    where: { course_id: input.courseId },
    relations: ['user']
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Check if the current user is the teacher assigned to this course
  if (course.teacherId !== user.user_id) {
    throw new Error('You can only create exams for courses assigned to you');
  }

  // If lessonId is provided, verify the lesson exists and belongs to the course
  if (input.lessonId) {
    const lesson = await lessonRepository.findOne({
      where: { lesson_id: input.lessonId, courseId: input.courseId }
    });

    if (!lesson) {
      throw new Error('Lesson not found or does not belong to this course');
    }
  }

  // Validate that question format matches number of questions
  if (input.questionFormat.length !== input.noOfQuestions) {
    throw new Error('Number of questions in questionFormat must match noOfQuestions');
  }

  // Calculate total marks from questions
  const calculatedTotalMarks = input.questionFormat.reduce((sum, question) => sum + question.points, 0);
  if (calculatedTotalMarks !== input.examTotalMarks) {
    throw new Error('Total marks must equal the sum of all question points');
  }

  return await examRepository.save(examRepository.create({
    ...input,
    userId: user.user_id,
    updatedBy: user.user_id
  }));
};

export const getExam = async (examId: string, user: User) => {
  const exam = await examRepository.findOne({
    where: { exam_id: examId },
    relations: ['course', 'lesson', 'user']
  });

  if (!exam) {
    throw new Error('Exam not found');
  }

  // Check if user is the teacher who created the exam
  if (exam.userId !== user.user_id && user.role !== 'admin') {
    throw new Error('You can only view exams you created');
  }

  return exam;
};

export const findExamsByCourse = async (courseId: string, user: User) => {
  // Verify that the course exists and the user is assigned as teacher to this course
  const course = await courseRepository.findOne({
    where: { course_id: courseId },
    relations: ['user']
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Check if the current user is the teacher assigned to this course
  if (course.teacherId !== user.user_id && user.role !== 'admin') {
    throw new Error('You can only view exams for courses assigned to you');
  }

  return await examRepository.find({
    where: { courseId },
    relations: ['course', 'lesson', 'user'],
    order: { createdAt: 'DESC' }
  });
};

export const findExamsByTeacher = async (req: Request, user: User) => {
  // Check if user has teacher role
  if (user.role !== 'teacher') {
    throw new Error('Only teachers can view exams');
  }

  const builder = examRepository.createQueryBuilder('Exam')
    .leftJoinAndSelect('Exam.course', 'Course')
    .leftJoinAndSelect('Exam.lesson', 'Lesson')
    .leftJoinAndSelect('Exam.user', 'User')
    .where('Exam.userId = :teacherId', { teacherId: user.user_id });

  if (req.query.search) {
    builder.andWhere('(Exam.title ILIKE :search OR Course.title ILIKE :search)', {
      search: `%${req.query.search}%`
    });
  }

  if (req.query.examType) {
    builder.andWhere('Exam.examType = :examType', { examType: req.query.examType });
  }

  if (req.query.courseId) {
    builder.andWhere('Exam.courseId = :courseId', { courseId: req.query.courseId });
  }

  return await builder
    .orderBy('Exam.createdAt', 'DESC')
    .getMany();
};

export const updateExam = async (examId: string, input: UpdateExamInput, user: User) => {
  const exam = await examRepository.findOne({
    where: { exam_id: examId },
    relations: ['course', 'user']
  });

  if (!exam) {
    throw new Error('Exam not found');
  }

  // Check if user is the teacher who created the exam
  if (exam.userId !== user.user_id && user.role !== 'admin') {
    throw new Error('You can only update exams you created');
  }

  // If updating question format, validate the data
  if (input.questionFormat) {
    if (input.noOfQuestions && input.questionFormat.length !== input.noOfQuestions) {
      throw new Error('Number of questions in questionFormat must match noOfQuestions');
    }

    const calculatedTotalMarks = input.questionFormat.reduce((sum, question) => sum + question.points, 0);
    if (input.examTotalMarks && calculatedTotalMarks !== input.examTotalMarks) {
      throw new Error('Total marks must equal the sum of all question points');
    }
  }

  Object.assign(exam, input);
  exam.updatedBy = user.user_id;

  return await examRepository.save(exam);
};

export const deleteExam = async (examId: string, user: User) => {
  const exam = await examRepository.findOne({
    where: { exam_id: examId },
    relations: ['course', 'user']
  });

  if (!exam) {
    throw new Error('Exam not found');
  }

  // Check if user is the teacher who created the exam
  if (exam.userId !== user.user_id && user.role !== 'admin') {
    throw new Error('You can only delete exams you created');
  }

  await examRepository.remove(exam);
  return { message: 'Exam deleted successfully' };
};

export const getTeacherCourses = async (user: User) => {
  if (user.role !== 'teacher') {
    throw new Error('Only teachers can access this endpoint');
  }

  return await courseRepository.find({
    where: { teacherId: user.user_id },
    select: ['course_id', 'title', 'description'],
    order: { title: 'ASC' }
  });
};

export const getTeacherLessons = async (courseId: string, user: User) => {
  if (user.role !== 'teacher') {
    throw new Error('Only teachers can access this endpoint');
  }

  // Verify that the course exists and the user is assigned as teacher to this course
  const course = await courseRepository.findOne({
    where: { course_id: courseId },
    relations: ['user']
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (course.teacherId !== user.user_id) {
    throw new Error('You can only access lessons for courses assigned to you');
  }

  return await lessonRepository.find({
    where: { courseId },
    select: ['lesson_id', 'title', 'lesson_type'],
    order: { position: 'ASC', createdAt: 'ASC' }
  });
};