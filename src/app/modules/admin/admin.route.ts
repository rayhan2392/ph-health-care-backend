import express from 'express';
import { AdminController } from './admin.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/client/browser.js';
import { adminValidationSchemas } from './admin.validation.js';

const router = express.Router();

router.get(
    '/',
    auth(UserRole.ADMIN),
    AdminController.getAllFromDB
);

router.get(
    '/:id',
    auth(UserRole.ADMIN),
    AdminController.getByIdFromDB
);

router.patch(
    '/:id',
    auth(UserRole.ADMIN),
    validateRequest(adminValidationSchemas.update),
    AdminController.updateIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN),
    AdminController.deleteFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.ADMIN),
    AdminController.softDeleteFromDB
);

export const AdminRoutes = router;