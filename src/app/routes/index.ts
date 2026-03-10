import express from 'express';
import { UserRoutes } from '../modules/user/user.route.js';
import { authRoutes } from '../modules/auth/auth.route.js';
import { scheduleRoutes } from '../modules/schedules/schedules.route.js';
import { doctorScheduleRoutes } from '../modules/doctorSchedules/doctorSchedules.routes.js';
import { SpecialtiesRoutes } from '../modules/specialities/specialities.route.js';
import { DoctorRoutes } from '../modules/doctor/doctor.route.js';
import { PatientRoutes } from '../modules/patient/patient.route.js';
import { AdminRoutes } from '../modules/admin/admin.route.js';
import { AppointmentRoutes } from '../modules/appointment/appointment.route.js';
import { PrescriptionRoutes } from '../modules/prescription/prescription.route.js';


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
    },
    {
        path: '/doctor',
        route: DoctorRoutes
    },
    {
        path: '/patient',
        route: PatientRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    },
    {
        path: '/appointment',
        route: AppointmentRoutes
    },
    {
        path: '/prescription',
        route: PrescriptionRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;