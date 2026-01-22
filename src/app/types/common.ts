import { UserRole } from "../../generated/client/enums.js";


export type IJWTPayload = {
    email: string;
    role: UserRole;
}