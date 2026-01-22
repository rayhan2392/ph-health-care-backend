import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { SchedulesService } from "./schedules.service.js";
import { IJWTPayload } from "../../types/common.js";
import pick from "../../helper/pick.js";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await SchedulesService.createSchedule(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule created successfully!",
        data: result
    })
});

const schedulesForDoctor = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pick(req.query, ["startDateTime", "endDateTime"])
    const user = req.user;

    const result = await SchedulesService.schedulesForDoctor(user as IJWTPayload, fillters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Available Schedules retrieved successfully!",
        data: result.data,
        meta: result.meta
    })
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await SchedulesService.deleteSchedule(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule deleted successfully!",
        data: result
    });
});

export const SchedulesController = {
    createSchedule,
    schedulesForDoctor,
    deleteSchedule
}