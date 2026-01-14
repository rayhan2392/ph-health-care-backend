import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller.js';
import { fileUploader } from '../../helper/fileUploader.js';
import { UserValidation } from './user.validation.js';


const router = express.Router();

router.post("/create-patient",
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body.data) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide data field with patient information"
                });
            }

            const parsedData = JSON.parse(req.body.data);
            req.body = UserValidation.createPatientValidationSchema.parse(parsedData);
            next();
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Invalid data format",
                error: error
            });
        }
    },
    UserController.createPatient
);

export const UserRoutes = router;