import DoctorTypeEnum from "./DoctorTypeEnum";
import Document from "./Document";

export default interface Requirement {
  id?: number;
  name: string;
  doctorType: DoctorTypeEnum;
  document?: Document;
  // optional: boolean
}
