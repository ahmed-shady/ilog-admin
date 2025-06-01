import DoctorTypeEnum from "@app/types/DoctorTypeEnum";

const DOCTOR_TYPES_TEXT: any = {};

DOCTOR_TYPES_TEXT[DoctorTypeEnum.TRAINEE] = "Trainee";
DOCTOR_TYPES_TEXT[DoctorTypeEnum.CONSULTANT] = "Consultant";
DOCTOR_TYPES_TEXT[DoctorTypeEnum.SPECIALIST] = "Specialist";

export default DOCTOR_TYPES_TEXT;