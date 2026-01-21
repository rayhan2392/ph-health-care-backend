import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller.js';
import { fileUploader } from '../../helper/fileUploader.js';
import { UserValidation } from './user.validation.js';
import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/client/enums.js';


const router = express.Router();

router.get("/", UserController.getAllUsers);

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

router.post("/create-admin",
    auth(UserRole.ADMIN),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("req.body:", req.body);
            console.log("req.body.data:", req.body.data);

            if (!req.body.data) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide data field with admin information"
                });
            }

            const parsedData = JSON.parse(req.body.data);
            console.log("parsedData:", parsedData);
            req.body = UserValidation.createAdminValidationSchema.parse(parsedData);
            next();
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Invalid data format",
                error: error
            });
        }
    },
    UserController.createAdmin
)

router.post("/create-doctor",
    auth(UserRole.ADMIN),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body.data) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide data field with doctor information"
                });
            }

            const parsedData = JSON.parse(req.body.data);
            req.body = UserValidation.createDoctorValidationSchema.parse(parsedData);
            next();
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Invalid data format",
                error: error
            });
        }
    },
    UserController.createDoctor
)

export const UserRoutes = router;