import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { UserService } from "./user.service.js";
import pick from "../../helper/pick.js";
import { userFilterableFields } from "./user.constants.js";


const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient created successfully',
        data: result
    });
})

const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createAdmin(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createDoctor(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Created successfuly!",
        data: result
    })
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields); //serching and filtering
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]); // pagination and sorting

    const result = await UserService.getAllUsers(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users retrieved successfully',
        meta: result.meta,
        data: result.data
    });
});


export const UserController = {
    createPatient,
    getAllUsers,
    createAdmin,
    createDoctor
};