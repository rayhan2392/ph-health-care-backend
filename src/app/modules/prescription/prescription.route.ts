
import express from 'express';
import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/client/enums.js';
import { PrescriptionController } from './prescription.controller.js';

const router = express.Router();


router.post(
    "/",
    auth(UserRole.DOCTOR),
    PrescriptionController.createPrescription
);

export const PrescriptionRoutes = router;