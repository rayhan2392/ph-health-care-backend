import express, { NextFunction, Request, Response } from 'express';
import { SpecialtiesController } from './specialities.controller.js';
import { fileUploader } from '../../helper/fileUploader.js';
import { SpecialtiesValidtaion } from './specialities.validation.js';
import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/client/browser.js';



const router = express.Router();


router.get(
    '/',
    SpecialtiesController.getAllFromDB
);

router.post(
    '/',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidtaion.create.parse(JSON.parse(req.body.data))
        return SpecialtiesController.inserIntoDB(req, res, next)
    }
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.ADMIN),
    SpecialtiesController.deleteFromDB
);

export const SpecialtiesRoutes = router;