export interface Country{
    id: number,
    name: string,
    nameAr: string,
    code: string,
    dialCode: string,
    image: string,
    latitude: number,
    longitude: number,
    bbox: number[],
    doctorsCount?: number
}