import express from "express";

import auth from "../../middlewares/auth.js";
import { UserRole } from "../../../generated/client/enums.js";
import { AppointmentController } from "./apointment.controller.js";


const router = express.Router();

router.post(
    "/",
    auth(UserRole.PATIENT),
    AppointmentController.createAppointment
)

export const AppointmentRoutes = router;