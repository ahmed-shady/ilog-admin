import DoctorTypeEnum from "./DoctorTypeEnum"
import Identity from "./Identity"
import Speciality from "./Speciality"
import User from "./user"

export default interface Doctor{

    id: number,
    jobTitle?: string,
    name: string,
    country: string,
    state?: string
    imageUrl?: string,
    hospital?: string,
    speciality: Speciality,
    phoneNumber: string,
    type: DoctorTypeEnum,
    verified: boolean,
    verifiedById?: number,
    identity: Identity,
    user: User

}