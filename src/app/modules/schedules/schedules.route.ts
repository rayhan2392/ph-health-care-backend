import express from "express";
import { SchedulesController } from "./schedules.controller.js";
import auth from "../../middlewares/auth.js";
import { UserRole } from "../../../generated/client/enums.js";

const router = express.Router();

router.get("/", auth(UserRole.DOCTOR), SchedulesController.schedulesForDoctor);

router.post("/", SchedulesController.createSchedule);

export const scheduleRoutes = router;