import DoctorTypeEnum from "./DoctorTypeEnum";

export interface DoctorFilterDto{
    name?: string,
    specialitiesIds?: number[],
    countries?: string[],
    states?: string[],
    verified?: boolean,
    hasPendingDocuments?: boolean,
    types?: DoctorTypeEnum[]
}