import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { UserService } from "./user.service.js";


const createPatient = catchAsync(async (req, res) => {
    const result = await UserService.createPatient(req.body);
    console.log("Created Patient:", result);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient created successfully',
        data: result
    });
})


export const UserController = {
    createPatient
};