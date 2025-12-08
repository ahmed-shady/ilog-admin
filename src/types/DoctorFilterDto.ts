import DoctorTypeEnum from "./DoctorTypeEnum";
import SortDirEnum from "./SortDirEnum";

export interface DoctorFilterDto{
    name?: string,
    specialitiesIds?: number[],
    countries?: string[],
    states?: string[],
    verified?: boolean,
    hasPendingDocuments?: boolean,
    types?: DoctorTypeEnum[],
    query?: string,
    sortBy?: string,
    sortDir?: SortDirEnum
}