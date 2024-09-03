import User from "./user";

export default interface LoginResponse {
    token?: string,
    user: User
}