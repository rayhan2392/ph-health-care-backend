import express from "express";
import auth from "../../middlewares/auth.js";
import { UserRole } from "../../../generated/client/enums.js";
import { AppointmentController } from "./apointment.controller.js";


const router = express.Router();

router.get(
    "/my-appointments",
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.getMyAppointment
)


router.post(
    "/",
    auth(UserRole.PATIENT),
    AppointmentController.createAppointment
)

router.patch(
    "/status/:id",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    AppointmentController.updateAppointmentStatus
)

export const AppointmentRoutes = router;