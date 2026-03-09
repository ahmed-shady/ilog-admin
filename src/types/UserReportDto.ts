import User from "./user";

export enum UserReportStatus {
    PENDING = "PENDING",
    FALSE_REPORT = "FALSE_REPORT",
    ACTION_TAKEN = "ACTION_TAKEN"
}

export interface UserReportDto {
    id: number;
    userId?: number;
    updatedAt?: string;
    createdAt: string;
    reporter: User;
    reported: User;
    reporterId?: number;
    reportedId?: number;
    reasonCode: string;
    details: string;
    reviewedById?: number;
    reviewedBy?: User;
    status?: UserReportStatus;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}
