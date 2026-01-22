import express from "express";
import { DoctorScheduleController } from "./doctorSchedules.controller.js";
import auth from "../../middlewares/auth.js";
import { UserRole } from "../../../generated/client/browser.js";


const router = express.Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    DoctorScheduleController.createDoctorSchedules
)

export const doctorScheduleRoutes = router;