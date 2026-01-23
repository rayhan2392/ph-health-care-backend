import { Gender } from "../../../generated/client/enums.js";


export type IDoctorUpdateInput = {
    email: string;
    contactNumber: string;
    gender: Gender;
    appointmentFee: number;
    name: string;
    address: string;
    registrationNumber: string;
    experience: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    isDeleted: boolean;
    specialties: {
        specialtyId: string;
        isDeleted?: boolean;
    }[]
}