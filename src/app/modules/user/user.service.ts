import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader.js";
import { prisma } from "../../shared/prisma.js";
import { createPatientInput } from "./user.interface.js";
import bcrypt from 'bcrypt';


const createPatient = async (req: Request) => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)
        req.body.patient.profilePhoto = uploadResult?.secure_url
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: req.body.patient.email,
                password: hashPassword
            }
        });

        return await tnx.patient.create({
            data: req.body.patient
        })
    })

    return result;
}



export const UserService = {
    createPatient
};