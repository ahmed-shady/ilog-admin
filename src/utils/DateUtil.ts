export const formatDateTime = (datetime: Date): string => {

    const formattedDate = datetime.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    return formattedDate;
}

export const formatDate = (datetime: Date): string => {

    const formattedDate = datetime.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour12: true,
    });
    return formattedDate;
}

export const getLocalTimeZoneOffset = (): number => {
  return new Date().getTimezoneOffset() / (-60);
}