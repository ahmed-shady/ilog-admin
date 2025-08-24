export default interface ProcedureOption{
    value: string,
    id?: number,
    optionName?: string | null,
    options?: ProcedureOption[],
    identifier: string
}