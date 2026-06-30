export const secondsToString = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const hoursString = hours < 10 ? `0${hours}` : hours.toString();
    const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();

    return `${hoursString}:${minutesString}`;
};
