import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../shared/prisma.js";
import { IJWTPayload } from "../../types/common.js";
import { IOptions, paginationHelper } from "../../helper/paginationHelper.js";
import { Prisma } from "../../../generated/client/client.js";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError.js";


const createSchedule = async (payload: any) => {
    const { startDate, endDate, startTime, endTime } = payload;
    const intervalTime = 30;
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0]) // 11:00
                ),
                Number(startTime.split(":")[1])
            )
        )

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0]) // 11:00
                ),
                Number(endTime.split(":")[1])
            )
        )

        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime; // 10:30
            const slotEndDateTime = addMinutes(startDateTime, intervalTime); // 11:00

            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleData
            })

            if (existingSchedule) {
                throw new ApiError(httpStatus.CONFLICT, `Schedule already exists for ${slotStartDateTime.toISOString()} - ${slotEndDateTime.toISOString()}`);
            }

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result)
            }

            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime);
        }

        currentDate.setDate(currentDate.getDate() + 1)
    }

    return schedules;
}


const schedulesForDoctor = async (
     user: IJWTPayload
    , filters:any
    , options:IOptions) => {
    //doctors schedules logic here
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } = filters;
    const andConditions: Prisma.ScheduleWhereInput[] = [];

    if (filterStartDateTime && filterEndDateTime) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: filterStartDateTime
                    }
                },
                {
                    endDateTime: {
                        lte: filterEndDateTime
                    }
                }
            ]
        })
    }
    const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}
    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user.email
            }
        },
        select: {
            scheduleId: true
        }
    });

    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId);

    const result = await prisma.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        }
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };

}

const deleteSchedule = async (id: string) => {
    const deletedSchedule = await prisma.schedule.delete({
        where: {
            id
        }
    });

    return deletedSchedule;
}

export const SchedulesService = {
    createSchedule,
    schedulesForDoctor,
    deleteSchedule
}