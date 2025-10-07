import * as express from 'express';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import { createTeacherSchema, deleteTeacherSchema, getTeacherSchema, updateTeacherSchema } from '../schemas/teacher.schema';
import { createTeacherHandler, getTeacherHandler, updateTeacherHandler, deleteTeacherHandler, getTeachersHandler } from '../controllers/teacher.controller';

const router = express.Router();

router.use(deserializeUser, requireUser);
router
    .route('/')
    .post(validate(createTeacherSchema), createTeacherHandler)
    .get(getTeachersHandler);

router
    .route('/:teacherId')
    .get(validate(getTeacherSchema), getTeacherHandler)
    .patch(validate(updateTeacherSchema), updateTeacherHandler)
    .put(validate(updateTeacherSchema), updateTeacherHandler)
    .delete(validate(deleteTeacherSchema), deleteTeacherHandler);

export default router;