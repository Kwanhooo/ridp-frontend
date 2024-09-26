export interface ChartData {
    title: string | number;
    content: {
        time: string | Date;
        value: number;
    }[];
}
