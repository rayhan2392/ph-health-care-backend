import express from 'express'
import { ReviewController } from './review.controller.js';
import auth from '../../middlewares/auth.js';
import { UserRole } from '../../../generated/client/enums.js';


const router = express.Router();

router.post(
    '/',
    auth(UserRole.PATIENT),
    ReviewController.insertIntoDB
);


export const ReviewRoutes = router;