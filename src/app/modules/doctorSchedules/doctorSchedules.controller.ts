import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { IJWTPayload } from "../../types/common.js";
import { DoctorScheduleService } from "./doctorSchedules.service.js";


const createDoctorSchedules = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleService.createDoctorSchedules(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Schedule created successfully!",
        data: result
    })
});


export const DoctorScheduleController = {
    createDoctorSchedules,
}