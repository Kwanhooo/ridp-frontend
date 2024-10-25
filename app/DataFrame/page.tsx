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

const DataFrame = () => {
    const [selectedBridge, setSelectedBridge] = React.useState('武广高铁淦河连续梁桥' as string);
    const [selectedTime, setSelectedTime] = React.useState('2024-4-10 06:19:38:39884' as string);
    const [selectedType, setSelectedType] = React.useState('ZZWY1' as string);
    const [chartData, setChartData] = React.useState(initialChartData);
    // 删除页面中的aside
    document.querySelectorAll('aside').forEach(function (aside) {
        aside.remove();
    });


    React.useEffect(() => {
        const refreshChartData = async () => {
            if (!selectedBridge || !selectedTime || !selectedType) return;

            try {
                const data = await fetchChartData(selectedBridge, selectedTime, selectedType);
                setChartData({
                    title: data.FileName,
                    content: JSON.parse(data.FileContent),
                });
            } catch (error) {
                showErrorToast('更新图表数据失败，请稍后再试。', error);
            }
        };

        refreshChartData();
    }, [selectedBridge, selectedTime, selectedType]);


    return (
        <div className="h-full flex flex-col bg-black">
            <NoHeadLineChart data={chartData}/>
        </div>
    );
};

export default DataFrame;
