import * as express from 'express';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import {
  createInstituteSchema,
  deleteInstituteSchema,
  getInstituteSchema,
  updateInstituteSchema,
} from '../schemas/institute.schema';
import { createInstituteHandler, deleteInstituteHandler, getInstituteHandler, getInstitutesHandler, updateInstituteHandler } from '../controllers/institute.controller';

const router = express.Router();

router.use(deserializeUser, requireUser);
router
  .route('/')
  .post(validate(createInstituteSchema), createInstituteHandler)
  .get(getInstitutesHandler);

router
  .route('/:instituteId')
  .get(validate(getInstituteSchema), getInstituteHandler)
  .patch(validate(updateInstituteSchema), updateInstituteHandler)
  .delete(validate(deleteInstituteSchema), deleteInstituteHandler);

export default router;