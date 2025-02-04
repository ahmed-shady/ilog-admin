import NotificationType from "./NotificationType";

export default interface Notification{
    id: number,
    title: string,
    message: string,
    targetId: number,
    resourceId: number,
    owner: any,
    type: NotificationType,
    read: boolean,
    createdAt: string,
    updatedAt: string,
    relativeDate?: string
    
}

