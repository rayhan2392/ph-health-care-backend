import express from 'express';
import { UserRoutes } from '../modules/user/user.route.js';
import { authRoutes } from '../modules/auth/auth.route.js';
import { scheduleRoutes } from '../modules/schedules/schedules.route.js';
import { doctorScheduleRoutes } from '../modules/doctorSchedules/doctorSchedules.routes.js';
import { SpecialtiesRoutes } from '../modules/specialities/specialities.route.js';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/schedule',
        route: scheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    },
    {
        path: '/specialities',
        route: SpecialtiesRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;