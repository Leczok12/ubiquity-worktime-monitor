export const dateToStringHours = (date: Date[]) => {
    const [startDate, endDate] = date;
    const startHours = startDate.getHours().toString().padStart(2, '0');
    const startMinutes = startDate.getMinutes().toString().padStart(2, '0');
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

    return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
};
