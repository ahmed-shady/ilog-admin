import DoctorTypeEnum from "@app/types/DoctorTypeEnum";

const DOCTOR_TYPES_TEXT: Record<DoctorTypeEnum, string> = {
    [DoctorTypeEnum.TRAINEE] : "Trainee",
    [DoctorTypeEnum.CONSULTANT] : "Consultant",
    [DoctorTypeEnum.SPECIALIST] : "Specialist",
    [DoctorTypeEnum.HOSPITAL] : "Hospital"
}
export default DOCTOR_TYPES_TEXT;