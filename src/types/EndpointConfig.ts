export default interface EndpointConfig{
    url?:string,
    method?:string,
    requireBody?: boolean,
    public?: boolean,
    success?: {
        toast?: boolean,
        defaultMessage?: string
    },
    error?: {
        toast?: boolean,
        defaultMessage?: string
    }

}