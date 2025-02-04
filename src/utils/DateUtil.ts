export const formatDateTime = (datetime: Date): string => {
    const date = new Date(); // Replace with your date object

    const formattedDate = date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    return formattedDate;
}