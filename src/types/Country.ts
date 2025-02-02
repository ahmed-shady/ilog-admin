export interface Country{
    id: number,
    name: string,
    code: string,
    dialCode: string,
    image: string,
    latitude: number,
    longitude: number,
    bbox: number[],
    doctorsCount?: number
}