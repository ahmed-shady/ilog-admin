export default interface ContactusMessage{
    id: number;
    content: string;
    title: string;
    email: string;
    read: boolean;
    ownerId: number;
    updatedAt: string;
    createdAt: string;
}