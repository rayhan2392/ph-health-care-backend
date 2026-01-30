import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js';
import pick from '../../helper/pick.js';
import { PatientService } from './patient.service.js';
import sendResponse from '../../shared/sendResponse.js';
import { patientFilterableFields } from './patient.constants.js';


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await PatientService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await PatientService.getByIdFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient retrieval successfully',
        data: result,
    });
});

const softDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.softDelete(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient soft deleted successfully',
        data: result,
    });
});

export const PatientController = {
    getAllFromDB,
    getByIdFromDB,
    softDelete,
};