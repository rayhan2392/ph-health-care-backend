import express from 'express';
import { DoctorController } from './doctor.controller.js';
import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/client/enums.js';


const router = express.Router();

router.get("/", DoctorController.getAllFromDB);
router.post("/suggestion", DoctorController.getAISuggestions);
router.patch("/:id",auth(UserRole.ADMIN,UserRole.DOCTOR), DoctorController.updateIntoDB);
router.get("/:id", DoctorController.getByIdFromDB);
router.delete("/:id",auth(UserRole.ADMIN), DoctorController.deleteFromDB);


export const DoctorRoutes = router;

