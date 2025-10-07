import * as express from 'express';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { restrictTo } from '../middleware/restrictTo';
import { RoleEnumType } from '../entities/User.entity';
import {
  getEnrolledCoursesHandler,
  getCourseDetailsHandler,
  getCourseLessonsHandler,
  getExamsHandler,
  getExamDetailsHandler,
  submitExamAttemptHandler
} from '../controllers/student.controller';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(deserializeUser, requireUser, restrictTo(RoleEnumType.STUDENT));

// Student course routes
router.get('/enrolled', getEnrolledCoursesHandler);
router.get('/:courseId', getCourseDetailsHandler);
router.get('/:courseId/lessons', getCourseLessonsHandler);

// Student exam routes
router.get('/:courseId/exams', getExamsHandler);
router.get('/exams/:examId', getExamDetailsHandler);
router.post('/exams/:examId/attempt', submitExamAttemptHandler);

export default router;
