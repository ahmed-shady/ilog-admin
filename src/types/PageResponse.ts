import Doctor from "./Doctor";

export interface PageResponse<T>{
    content: T[],
    pageable: {
        pageNumber: number,
        pageSize: number,
        sort: {
            sorted: boolean,
            unsorted: boolean,
            empty: boolean
        },
        offset: number,
        paged: boolean,
        unpaged: boolean
    },
    totalElements: number,
    totalPages: number,
    last: boolean,
    size: number,
    number: number,
    sort: {
        sorted: boolean,
        unsorted: boolean,
        empty: boolean
    },
    numberOfElements: number,
    first: boolean,
    empty: boolean 
}