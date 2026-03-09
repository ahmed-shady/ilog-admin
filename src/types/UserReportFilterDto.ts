export interface UserReportFilterDto{
    reportedIds?: number[];
    reporterIds?: number[];
    createdDateFrom?: string;
    createdDateTo?: string;
    statuses?: string[];
    reasons?: string[];
}