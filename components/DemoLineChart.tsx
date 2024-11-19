"use client"
import * as React from "react";
import 'react-toastify/dist/ReactToastify.css'; // 引入样式
import NoHeadLineChart from '@/components/NoHeadLineChart';
import {get} from "@/app/uitils/HttpAxios";
import {ChartData} from "@/types/ChartData";
import {showErrorToast} from "@/app/uitils/toast";

/**
 * 类型定义
 */

// API响应
type MetricsResponse = {
    FileName: string;
    FileContent: string;
};

/**
 * API 调用
 */
// 获取图表数据
const fetchChartData = (bridge: string, time: string, type: string) =>
    get<MetricsResponse>('/metrics', {bridge, time, type});

const initialChartData = {
    title: "",
    content: [],
} as ChartData;

interface DemoLineChartProps {
    bridge: string;
    time: string;
    type: string;
}

const DemoLineChart: React.FC<DemoLineChartProps> = ({bridge, time, type}) => {
    const [chartData, setChartData] = React.useState(initialChartData);

    React.useEffect(() => {
        const refreshChartData = async () => {
            if (!bridge || !time || !type) return;

            try {
                const data = await fetchChartData(bridge, time, type);
                setChartData({
                    title: data.FileName,
                    content: JSON.parse(data.FileContent),
                });
            } catch (error) {
                showErrorToast('更新图表数据失败，请稍后再试。', error);
            }
        };

        refreshChartData();
    }, [bridge, time, type]);

    return (
        <div className="h-full flex flex-col">
            <NoHeadLineChart data={chartData}/>
        </div>
    );
};

export default DemoLineChart;
