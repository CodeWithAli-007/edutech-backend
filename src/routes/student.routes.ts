import * as express from 'express';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import { createStudentHandler, getStudentHandler, updateStudentHandler, deleteStudentHandler, getStudentsHandler } from '../controllers/student.controller';
import { createStudentSchema, getStudentSchema, updateStudentSchema, deleteStudentSchema } from '../schemas/student.schema';
import { createUserDetailsSchema } from '../schemas/userDetails.schema';

const router = express.Router();

router.use(deserializeUser, requireUser);
router
  .route('/')
  .post(validate(createStudentSchema), createStudentHandler)
  .get(getStudentsHandler);

router
  .route('/:studentId')
  .get(validate(getStudentSchema), getStudentHandler)
  .patch(validate(updateStudentSchema), updateStudentHandler)
  .delete(validate(deleteStudentSchema), deleteStudentHandler);

export default router;