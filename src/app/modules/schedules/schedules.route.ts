import express from "express";
import { SchedulesController } from "./schedules.controller.js";
import auth from "../../middlewares/auth.js";
import { UserRole } from "../../../generated/client/enums.js";

const router = express.Router();

router.get("/", auth(UserRole.DOCTOR,UserRole.ADMIN), SchedulesController.schedulesForDoctor);

router.post("/", SchedulesController.createSchedule);
router.delete("/:id", SchedulesController.deleteSchedule);

export const scheduleRoutes = router;