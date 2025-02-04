enum NotificationType{
    NEW_USERS="NEW_USERS",
    NEW_DOCUMENTS="NEW_DOCUMENTS",
    NEW_MESSAGES="NEW_MESSAGES"
}

export default NotificationType;

export const NON_REPETITIVE_NOTIFICATIONS = [
    NotificationType.NEW_USERS,
    NotificationType.NEW_DOCUMENTS,
    NotificationType.NEW_MESSAGES
];