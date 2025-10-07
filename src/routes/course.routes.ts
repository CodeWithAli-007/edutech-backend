import { Router } from 'express';
import { 
  createCourseHandler,
  getCourseHandler,
  getCoursesHandler,
  updateCourseHandler,
  deleteCourseHandler,
  assignTeacherHandler
} from '../controllers/course.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';

const courseRouter = Router();

// All routes require authentication
courseRouter.use(deserializeUser, requireUser);

courseRouter.route('/')
  .get(getCoursesHandler)
  .post(createCourseHandler);

courseRouter.route('/:id')
  .get(getCourseHandler)
  .patch(updateCourseHandler)
  .delete(deleteCourseHandler);

courseRouter.patch('/:courseId/assign-teacher', assignTeacherHandler);

export default courseRouter;
