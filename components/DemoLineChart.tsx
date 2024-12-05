import * as React from "react";
import 'react-toastify/dist/ReactToastify.css'; // 引入样式
import NoHeadLineChart from '@/components/NoHeadLineChart';
import {get} from "@/app/utils/HttpAxios";
import {ChartData} from "@/types/ChartData";
import {showErrorToast} from "@/app/utils/toast";

// API响应类型
type MetricsResponse = { time: string | Date; value: number; }[];

// API 调用：获取图表数据
const fetchChartData = (bridge: string, time: string, type: string) =>
    get<MetricsResponse>('/metrics', {bridge, time, pointName: type});

const initialChartData = {
    title: "",
    content: [],
} as ChartData;

interface DemoLineChartProps {
    bridge: string;
    time: string;
    type: string;
    clear: boolean;
    refreshSignal: boolean; // 用来触发刷新数据
}

const DemoLineChart: React.FC<DemoLineChartProps> = ({bridge, time, type, clear, refreshSignal}) => {
    const [chartData, setChartData] = React.useState(initialChartData);

    React.useEffect(() => {
        const refreshChartData = async () => {
            if (!bridge || !time || !type) return;

            try {
                const data = await fetchChartData(bridge, time, type);
                setChartData({
                    title: '',
                    content: data,
                });
            } catch (error) {
                showErrorToast('更新图表数据失败，请稍后再试。', error);
            }
        };

        if (refreshSignal) {
            refreshChartData();
        }
    }, [bridge, time, type, refreshSignal]);

    React.useEffect(() => {
        if (clear) {
            setChartData(initialChartData);
        }
    }, [clear]);

    return (
        <div className="w-full h-full flex flex-col">
            <NoHeadLineChart data={chartData}/>
        </div>
    );
};

export default DemoLineChart;
