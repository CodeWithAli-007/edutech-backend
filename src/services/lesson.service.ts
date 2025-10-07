import { Request } from 'express';
import { User } from '../entities/User.entity';
import { AppDataSource } from '../utils/data-source';
import { Lesson } from '../entities/lesson.entity';
import { Course } from '../entities/course.entity';
import { Exam, MCQQuestion } from '../entities/exam.entity';

const lessonRepository = AppDataSource.getRepository(Lesson);
const courseRepository = AppDataSource.getRepository(Course);
const examRepository = AppDataSource.getRepository(Exam);

// Dummy MCQs for lessons with hasExam = true
const getDummyMCQs = (lessonTitle: string): MCQQuestion[] => [
  {
    question: `What is the main topic covered in "${lessonTitle}"?`,
    options: {
      A: "Basic concepts",
      B: "Advanced techniques", 
      C: "Practical applications",
      D: "All of the above"
    },
    correctAnswer: "D",
    points: 5
  },
  {
    question: `Which of the following is most important when studying "${lessonTitle}"?`,
    options: {
      A: "Memorizing facts",
      B: "Understanding concepts",
      C: "Taking notes",
      D: "Reading quickly"
    },
    correctAnswer: "B",
    points: 5
  },
  {
    question: `What should you do after completing "${lessonTitle}"?`,
    options: {
      A: "Move to next lesson",
      B: "Review the material",
      C: "Take a break",
      D: "Ask questions"
    },
    correctAnswer: "B",
    points: 5
  }
];

export const createLesson = async (input: Partial<Lesson>, user: User) => {
  // Check if user has teacher role first
  if (user.role !== 'teacher') {
    throw new Error('Only teachers can create lessons');
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
    throw new Error('You can only create lessons for courses assigned to you');
  }

  const lesson = await lessonRepository.save(lessonRepository.create({ 
    ...input, 
    userId: user.user_id,
    updatedBy: user.user_id 
  }));

  // If hasExam is true, automatically create an exam with dummy MCQs
  if (input.hasExam) {
    const dummyMCQs = getDummyMCQs(input.title || 'Lesson');
    
    await examRepository.save(examRepository.create({
      courseId: input.courseId,
      lessonId: lesson.lesson_id,
      title: `${input.title} - Quiz`,
      examType: 'quiz',
      examTotalMarks: 15, // 3 questions × 5 points each
      noOfQuestions: 3,
      threshold: 9, // 60% of 15 marks
      questionFormat: dummyMCQs,
      userId: user.user_id,
      updatedBy: user.user_id
    }));
  }

  return lesson;
};

export const getLesson = async (lessonId: string) => {
  return await lessonRepository.findOne({
    where: { lesson_id: lessonId },
    relations: ['course', 'user']
  });
};

export const findLessonsByCourse = async (courseId: string, user: User) => {
  // Verify that the course exists and the user is assigned as teacher to this course
  const course = await courseRepository.findOne({
    where: { course_id: courseId },
    relations: ['user']
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Check if the current user is the teacher assigned to this course
  if (course.teacherId !== user.user_id) {
    throw new Error('You can only view lessons for courses assigned to you');
  }

  return await lessonRepository.find({
    where: { courseId },
    relations: ['course', 'user'],
    order: { position: 'ASC', createdAt: 'ASC' }
  });
};

export const findLessonsByTeacher = async (req: Request, user: User) => {
  // Check if user has teacher role
  if (user.role !== 'teacher') {
    throw new Error('Only teachers can view lessons');
  }

  const builder = lessonRepository.createQueryBuilder('Lesson')
    .leftJoinAndSelect('Lesson.course', 'Course')
    .leftJoinAndSelect('Lesson.user', 'User')
    .where('Lesson.userId = :teacherId', { teacherId: user.user_id });

  if (req.query.search) {
    builder.andWhere('Lesson.title LIKE :search', {
      search: `%${req.query.search}%`,
    });
  }

  if (req.query.courseId) {
    builder.andWhere('Lesson.courseId = :courseId', {
      courseId: req.query.courseId,
    });
  }

  if (req.query.status) {
    builder.andWhere('Lesson.status = :status', {
      status: req.query.status,
    });
  }

  if (req.query.sort) {
    const sortField = req.query.sort === 'title' ? 'Lesson.title' : 'Lesson.createdAt';
    const sortOrder = req.query.order === 'desc' ? 'DESC' : 'ASC';
    builder.orderBy(sortField, sortOrder);
  } else {
    builder.orderBy('Lesson.position', 'ASC').addOrderBy('Lesson.createdAt', 'ASC');
  }

  return await builder.getMany();
};

export const updateLesson = async (lessonId: string, input: Partial<Lesson>, user: User) => {
  const lesson = await getLesson(lessonId);
  if (!lesson) {
    throw new Error('Lesson not found');
  }

  // Check if the current user is the teacher assigned to this course
  if (lesson.course.teacherId !== user.user_id) {
    throw new Error('You can only update lessons for courses assigned to you');
  }

  // Check if user has teacher role
  if (user.role !== 'teacher') {
    throw new Error('Only teachers can update lessons');
  }

  // Check if hasExam is being changed from false to true
  const wasHasExamFalse = !lesson.hasExam;
  const isHasExamTrue = input.hasExam === true;

  Object.assign(lesson, input);
  lesson.updatedBy = user.user_id;
  const updatedLesson = await lessonRepository.save(lesson);

  // If hasExam changed from false to true, create an exam with dummy MCQs
  if (wasHasExamFalse && isHasExamTrue) {
    const dummyMCQs = getDummyMCQs(lesson.title);
    
    await examRepository.save(examRepository.create({
      courseId: lesson.courseId,
      lessonId: lesson.lesson_id,
      title: `${lesson.title} - Quiz`,
      examType: 'quiz',
      examTotalMarks: 15, // 3 questions × 5 points each
      noOfQuestions: 3,
      threshold: 9, // 60% of 15 marks
      questionFormat: dummyMCQs,
      userId: user.user_id,
      updatedBy: user.user_id
    }));
  }

  return updatedLesson;
};

export const deleteLesson = async (lessonId: string, user: User) => {
  const lesson = await getLesson(lessonId);
  if (!lesson) {
    throw new Error('Lesson not found');
  }

  // Check if the current user is the teacher assigned to this course
  if (lesson.course.teacherId !== user.user_id) {
    throw new Error('You can only delete lessons for courses assigned to you');
  }

  // Check if user has teacher role
  if (user.role !== 'teacher') {
    throw new Error('Only teachers can delete lessons');
  }

  return await lessonRepository.remove(lesson);
};

export const getTeacherCourses = async (user: User) => {
  // Check if user has teacher role
  if (user.role !== 'teacher') {
    throw new Error('Only teachers can view their courses');
  }

  return await courseRepository.find({
    where: { 
      teacherId: user.user_id,
      instituteId: user.instituteId 
    },
    order: { title: 'ASC' }
  });
};