import UserRole from "./UserRole";

export default interface User{
    name: string,
    id: number,
    email: string,
    emailVerified: boolean,
    suspended: boolean,
    updatedAt: Date,
    role: UserRole

}
