"use client";
import * as React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NoHeadLineChart from '@/components/NoHeadLineChart';
import { get } from "@/app/uitils/HttpAxios";

/**
 * 类型定义
 */

// API响应
type BridgeListResponse = string[];
type TypeListResponse = string[];
type TimeListResponse = string[];
type ChartDataResponse = {
    Filename: string;
    FileContent: { time: string; value: number }[];
};

// 数据
type ChartData = {
    filename: string;
    file_content: { time: string; value: number }[];
}

/**
 * API
 */

// 获取桥梁列表
const fetchBridgeList = async (): Promise<BridgeListResponse> => {
    try {
        const data: BridgeListResponse = await get<BridgeListResponse>('/bridges');
        console.log('Bridge Names:', data);
        return data;
    } catch (error) {
        console.error('Error fetching bridge names:', error);
        throw error;
    }
};

// 获取时间列表
const fetchTimeList = async (bridge: string): Promise<TimeListResponse> => {
    try {
        const data: TimeListResponse = await get<TimeListResponse>('/bridges', { bridge });
        console.log('Time Names:', data);
        return data;
    } catch (error) {
        console.error('Error fetching time names:', error);
        throw error;
    }
};

// 获取指标类型列表
const fetchTypeList = async (): Promise<TypeListResponse> => {
    try {
        const data: TypeListResponse = await get<TypeListResponse>('/types');
        console.log('Types Names:', data);
        return data;
    } catch (error) {
        console.error('Error fetching types names:', error);
        throw error;
    }
};

// 获取按照桥梁、时间、指标获取图表数据
const fetchChartData = async (bridge: string, time: string, type: string): Promise<ChartDataResponse> => {
    try {
        const data: ChartDataResponse = await get<ChartDataResponse>('/mertics', { bridge, time, type });
        console.log('Chart Data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching Chart Data:', error);
        throw error;
    }
};

/**
 * Data
 */
const containerStyle = {
    height: `calc(100% - 106px)`
};

const initialChartData = {
    filename: "",
    file_content: [],
} as ChartData;

const DataDashboard = () => {
    const [selectedBridge, setSelectedBridge] = React.useState('' as string);
    const [bridgeOptions, setBridgeOptions] = React.useState([] as string[]);
    const [selectedTime, setSelectedTime] = React.useState('' as string);
    const [timeOptions, setTimeOptions] = React.useState([] as string[]);
    const [selectedType, setSelectedType] = React.useState('' as string);
    const [typeOptions, setTypeOptions] = React.useState([] as string[]);
    const [chartData, setChartData] = React.useState(initialChartData);

    // 选项刷新函数
    const refreshSelectionData = async () => {
        try {
            setBridgeOptions(await fetchBridgeList());
            setTypeOptions(await fetchTypeList());
        } catch (e) {
            console.error('选项刷新请求错误', e);
        }
    };

    React.useEffect(() => {
        const fetchTimeOptions = async () => {
            if (selectedBridge) {
                try {
                    const timeList = await fetchTimeList(selectedBridge);
                    setTimeOptions(timeList);
                } catch (error) {
                    console.error('获取时间选项错误', error);
                }
            } else {
                setTimeOptions([]); // 清空时间选项
            }
        };

        fetchTimeOptions();
    }, [selectedBridge]);

    React.useEffect(() => {
        const refreshChartData = async () => {
            if (selectedBridge && selectedTime && selectedType) {
                try {
                    const data = await fetchChartData(selectedBridge, selectedTime, selectedType);
                    setChartData({
                        filename: data.Filename,
                        file_content: data.FileContent,
                    });
                } catch (error) {
                    console.error('更新图表数据错误', error);
                }
            }
        };

        refreshChartData();
    }, [selectedBridge, selectedTime, selectedType]);

    // 立即获取一次
    React.useEffect(() => {
        refreshSelectionData();
    }, []);

    return (
        <div className="h-full flex flex-col bg-black">
            {/* 顶部选择部分 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-700 p-2 pb-3">
                {/* 桥梁选择 */}
                <div className="flex items-start flex-col">
                    <label htmlFor="bridge" className="text-white font-bold px-2">
                        桥梁
                    </label>
                    <Select onValueChange={(value) => setSelectedBridge(value)}>
                        <SelectTrigger className="w-[250px] text-white">
                            <SelectValue placeholder="选择桥梁" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>桥梁列表</SelectLabel>
                                {bridgeOptions.map((bridge) => (
                                    <SelectItem key={bridge} value={bridge}>
                                        {bridge}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* 时间选择 */}
                <div className="flex items-start flex-col">
                    <label htmlFor="time" className="text-white font-bold px-2">
                        时间
                    </label>
                    <Select onValueChange={(value) => setSelectedTime(value)}>
                        <SelectTrigger className="w-[250px] text-white">
                            <SelectValue placeholder="选择时间" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>时间列表</SelectLabel>
                                {timeOptions.map((time) => (
                                    <SelectItem key={time} value={time}>
                                        {time}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* 指标选择 */}
                <div className="flex items-start flex-col">
                    <label htmlFor="indicator" className="text-white font-bold px-2">
                        指标
                    </label>
                    <Select onValueChange={(value) => setSelectedType(value)}>
                        <SelectTrigger className="w-[250px] text-white">
                            <SelectValue placeholder="选择指标" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>指标列表</SelectLabel>
                                {typeOptions.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 数据总览卡片 */}
            <div className="h-full w-full p-4">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">数据总览</CardTitle>
                        <CardDescription>{chartData.filename}</CardDescription>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        <div className="h-full w-full">
                            <NoHeadLineChart data={chartData} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DataDashboard;
