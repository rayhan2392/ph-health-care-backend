import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader.js";
import { prisma } from "../../shared/prisma.js";
import bcrypt from 'bcrypt';
import { IOptions, paginationHelper } from "../../helper/paginationHelper.js";
import { Admin, Doctor, Prisma, UserRole } from '../../../generated/client/client.js';
import { userSearchableFields } from "./user.constants.js";
import config from "../../../config/index.js";


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

const createAdmin = async (req: Request): Promise<Admin> => {

    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 10)

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    });

    return result;
};

// const createDoctor = async (req: Request): Promise<Doctor> => {

//     const file = req.file;

//     if (file) {
//         const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
//         req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url
//     }
//     const hashedPassword: string = await bcrypt.hash(req.body.password, 10)

//     const userData = {
//         email: req.body.doctor.email,
//         password: hashedPassword,
//         role: UserRole.DOCTOR
//     }
    

//     const result = await prisma.$transaction(async (transactionClient) => {
//         await transactionClient.user.create({
//             data: userData
//         });

//         const createdDoctorData = await transactionClient.doctor.create({
//             data: req.body.doctor
//         });

//         return createdDoctorData;
//     });

//     return result;
// };

const createDoctor = async (req: Request): Promise<Doctor> => {
    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
    }

    const hashedPassword: string = await bcrypt.hash(
        req.body.password,
        Number(config.salt_round)
    );

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR,
    };

    // Extract specialties from doctor data
    const { specialties, ...doctorData } = req.body.doctor;

    const result = await prisma.$transaction(async (transactionClient) => {
        // Step 1: Create user
        await transactionClient.user.create({
            data: userData,
        });

        // Step 2: Create doctor
        const createdDoctorData = await transactionClient.doctor.create({
            data: doctorData,
        });

        // Step 3: Create doctor specialties if provided
        if (specialties && Array.isArray(specialties) && specialties.length > 0) {
            // Verify all specialties exist
            const existingSpecialties = await transactionClient.specialties.findMany({
                where: {
                    id: {
                        in: specialties,
                    },
                },
                select: {
                    id: true,
                },
            });

            const existingSpecialtyIds = existingSpecialties.map((s) => s.id);
            const invalidSpecialties = specialties.filter(
                (id) => !existingSpecialtyIds.includes(id)
            );

            if (invalidSpecialties.length > 0) {
                throw new Error(
                    `Invalid specialty IDs: ${invalidSpecialties.join(", ")}`
                );
            }

            // Create doctor specialties relations
            const doctorSpecialtiesData = specialties.map((specialtyId) => ({
                doctorId: createdDoctorData.id,
                specialitiesId: specialtyId,
            }));

            await transactionClient.doctorSpecialties.createMany({
                data: doctorSpecialtiesData,
            });
        }

        // Step 4: Return doctor with specialties
        const doctorWithSpecialties = await transactionClient.doctor.findUnique({
            where: {
                id: createdDoctorData.id,
            },
            include: {
                doctorSpecialties: {
                    include: {
                        specialities: true,
                    },
                },
            },
        });

        return doctorWithSpecialties!;
    });

    return result;
};

const getAllUsers = async (params: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}


    const result = await prisma.user.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.user.count({
        where: whereConditions
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


export const UserService = {
    createPatient,
    getAllUsers,
    createAdmin,
    createDoctor
};