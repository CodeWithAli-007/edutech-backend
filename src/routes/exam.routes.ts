import * as express from 'express';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import {
  createExamSchema,
  updateExamSchema,
  getExamSchema,
  deleteExamSchema,
  getExamsByCourseSchema,
  getTeacherExamsSchema
} from '../schemas/exam.schema';
import {
  createExamHandler,
  getExamHandler,
  getExamsByCourseHandler,
  getExamsHandler,
  updateExamHandler,
  deleteExamHandler,
  getTeacherCoursesHandler,
  getTeacherLessonsHandler
} from '../controllers/exam.controller';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(deserializeUser, requireUser);

// Get teacher's courses (for dropdown in exam creation)
router.get('/courses', getTeacherCoursesHandler);

// Get teacher's lessons for a specific course (for dropdown in exam creation)
router.get('/courses/:courseId/lessons', getTeacherLessonsHandler);

// Get all exams for the authenticated teacher
router.get('/', validate(getTeacherExamsSchema), getExamsHandler);

// Get exams by course ID
router.get('/course/:courseId', validate(getExamsByCourseSchema), getExamsByCourseHandler);

// Create a new exam
router.post('/', validate(createExamSchema), createExamHandler);

// Get a specific exam
router.get('/:examId', validate(getExamSchema), getExamHandler);

// Update an exam
router.patch('/:examId', validate(updateExamSchema), updateExamHandler);
router.put('/:examId', validate(updateExamSchema), updateExamHandler);

// Delete an exam
router.delete('/:examId', validate(deleteExamSchema), deleteExamHandler);

export default router;