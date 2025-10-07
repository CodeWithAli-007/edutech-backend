import * as express from 'express';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import { 
  createLessonSchema, 
  updateLessonSchema, 
  getLessonSchema, 
  deleteLessonSchema, 
  getLessonsByCourseSchema 
} from '../schemas/lesson.schema';
import { 
  createLessonHandler, 
  getLessonHandler, 
  getLessonsByCourseHandler, 
  getLessonsHandler, 
  updateLessonHandler, 
  deleteLessonHandler,
  getTeacherCoursesHandler 
} from '../controllers/lesson.controller';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(deserializeUser, requireUser);

// Get teacher's courses (for dropdown in lesson creation)
router.get('/courses', getTeacherCoursesHandler);

// Get all lessons for the authenticated teacher
router.get('/', getLessonsHandler);

// Get lessons by course ID
router.get('/course/:courseId', validate(getLessonsByCourseSchema), getLessonsByCourseHandler);

// Create a new lesson
router.post('/', validate(createLessonSchema), createLessonHandler);

// Get a specific lesson
router.get('/:lessonId', validate(getLessonSchema), getLessonHandler);

// Update a lesson
router.patch('/:lessonId', validate(updateLessonSchema), updateLessonHandler);
router.put('/:lessonId', validate(updateLessonSchema), updateLessonHandler);

// Delete a lesson
router.delete('/:lessonId', validate(deleteLessonSchema), deleteLessonHandler);

export default router;