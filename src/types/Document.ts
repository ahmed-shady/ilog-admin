import DocumentVerification from "./DocumentVerification";

export default interface Document{
    id: number,
    documentUrl: string,
    userId: number,
    requirementId: number,
    verification: DocumentVerification
}