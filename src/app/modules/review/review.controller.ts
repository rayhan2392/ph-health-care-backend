import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { IJWTPayload } from "../../types/common.js";
import sendResponse from "../../shared/sendResponse.js";
import httpStatus from "http-status"
import { ReviewService } from "./review.service.js";

const insertIntoDB = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.insertIntoDB(user as IJWTPayload, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review created successfully',
        data: result,
    });
});

export const ReviewController = {
    insertIntoDB
}