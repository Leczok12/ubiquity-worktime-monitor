export interface ApiGetStatistics {
    workerCount: {
        showed: number;
        all?: number;
    };
    groupCount: {
        showed: number;
        all?: number;
    };
    deviceCount: {
        used: number;
        all?: number;
    };
    todayEventsCount: number;
    todayWorkEventsCount: number;
}
