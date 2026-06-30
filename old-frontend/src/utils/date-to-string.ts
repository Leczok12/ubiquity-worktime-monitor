export const dateToString = (date: Date | Date[]) => {
    if (Array.isArray(date)) {
        const [startDate, endDate] = date;
        const startDateString = startDate.toLocaleDateString();
        const endDateString = endDate.toLocaleDateString();

        if (startDateString === endDateString) {
            return startDateString;
        }
        return `${startDateString} - ${endDateString}`;
    }
    return date.toLocaleDateString();
};
