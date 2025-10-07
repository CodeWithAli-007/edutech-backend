import * as express from 'express';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import {
  createEnrollmentSchema,
  getEnrollmentSchema,
  updateEnrollmentSchema,
  deleteEnrollmentSchema,
  getEnrollmentsByStudentSchema,
  getEnrollmentsByCourseSchema,
  getEnrollmentsByInstituteSchema
} from '../schemas/enrollment.schema';
import {
  createEnrollmentHandler,
  getEnrollmentHandler,
  getEnrollmentsByStudentHandler,
  getEnrollmentsByCourseHandler,
  getEnrollmentsHandler,
  updateEnrollmentHandler,
  deleteEnrollmentHandler,
  getAvailableStudentsHandler,
  getAvailableCoursesHandler
} from '../controllers/enrollment.controller';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(deserializeUser, requireUser);

// Get available students and courses for enrollment
router.get('/students', getAvailableStudentsHandler);
router.get('/courses', getAvailableCoursesHandler);

// Get all enrollments for the authenticated institute admin
router.get('/', validate(getEnrollmentsByInstituteSchema), getEnrollmentsHandler);

// Get enrollments by student ID
router.get('/student/:studentId', validate(getEnrollmentsByStudentSchema), getEnrollmentsByStudentHandler);

// Get enrollments by course ID
router.get('/course/:courseId', validate(getEnrollmentsByCourseSchema), getEnrollmentsByCourseHandler);

// Create a new enrollment
router.post('/', validate(createEnrollmentSchema), createEnrollmentHandler);

// Get a specific enrollment
router.get('/:enrollmentId', validate(getEnrollmentSchema), getEnrollmentHandler);

// Update an enrollment
router.patch('/:enrollmentId', validate(updateEnrollmentSchema), updateEnrollmentHandler);
router.put('/:enrollmentId', validate(updateEnrollmentSchema), updateEnrollmentHandler);

// Delete an enrollment
router.delete('/:enrollmentId', validate(deleteEnrollmentSchema), deleteEnrollmentHandler);

export default router;
