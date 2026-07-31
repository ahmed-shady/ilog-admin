import DoctorTypeEnum from "./DoctorTypeEnum";

export interface SpecialityDistributionFilter {
    specialitiesIds?: number[];
    countries?: string[];
    types?: DoctorTypeEnum[];
    verified?: boolean | null;
}
