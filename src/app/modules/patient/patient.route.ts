import express from 'express';
import { PatientController } from './patient.controller.js';
import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/client/enums.js';

const router = express.Router();

router.get(
    '/',
    PatientController.getAllFromDB
);

router.get(
    '/:id',
    PatientController.getByIdFromDB
);

router.patch("/",
    auth(UserRole.PATIENT),
    PatientController.updateIntoDB
)

router.delete(
    '/soft/:id',
    PatientController.softDelete
);

export const PatientRoutes = router;