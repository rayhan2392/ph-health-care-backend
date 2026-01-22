import { string } from "zod";
import { IJWTPayload } from "../../types/common.js";
import { prisma } from "../../shared/prisma.js";

const createDoctorSchedules = async(user:IJWTPayload, payload:{
    scheduleIds:string[]
})=>{
    // Logic to create doctor schedules
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })

    const doctorSchedulesData = payload.scheduleIds.map((scheduleId)=>({
        doctorId:doctorData.id,
        scheduleId
    }))

     return await prisma.doctorSchedules.createMany({
        data: doctorSchedulesData
    });
}


export const DoctorScheduleService = {
    createDoctorSchedules,
}