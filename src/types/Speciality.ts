import ProcedureOption from "./ProcedureOption";

export default interface Speciality{
    name: string,
    id?: number,
    procedures?: ProcedureOption[],
    proceduresCount?: number
}