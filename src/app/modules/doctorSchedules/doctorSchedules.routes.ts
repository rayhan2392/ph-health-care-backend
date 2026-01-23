import express from "express";
import { DoctorScheduleController } from "./doctorSchedules.controller.js";
import auth from "../../middlewares/auth.js";
import { UserRole } from "../../../generated/client/browser.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { DoctorScheduleValidation } from "./doctorSchedules.validations.js";


const router = express.Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    validateRequest(DoctorScheduleValidation.createDoctorScheduleValidationSchema),
    DoctorScheduleController.createDoctorSchedules
)

export const doctorScheduleRoutes = router;