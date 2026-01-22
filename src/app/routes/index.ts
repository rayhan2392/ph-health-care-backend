import express from 'express';
import { UserRoutes } from '../modules/user/user.route.js';
import { authRoutes } from '../modules/auth/auth.route.js';
import { scheduleRoutes } from '../modules/schedules/schedules.route.js';


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
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;