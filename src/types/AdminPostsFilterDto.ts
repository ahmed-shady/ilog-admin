
export default interface AdminPostsFilterDto{
    countriesIds?: number[];
    specialitiesIds?: number[];
    createdFromDate?: string;
    createdToDate?: string;
    types?: string[];
    query?: string;
}