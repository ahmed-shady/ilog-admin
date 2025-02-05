import UserRole from "./UserRole";

export default interface User{
    name: string,
    id: number,
    email: string,
    emailVerified: boolean,
    suspended: boolean,
    updatedAt: string,
    createdAt: Date,
    role: UserRole,
    profileImage: string

}
