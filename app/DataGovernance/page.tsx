"use client"
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NoHeadLineChart from '@/components/NoHeadLineChart';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartData } from "@/types/ChartData";
import { get } from "@/app/uitils/HttpAxios";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { showErrorToast } from "@/app/uitils/toast";
import {log} from "node:util";

// 数据类型声明
type BridgeListResponse = string[];
type TimeListResponse = string[];
type TypeListResponse = string[];
type RawDataResponse = { Filename: string; FileContent: { time: string; value: number }[]; };
type ProcessedDataResponse = { data: { time: string, value: number }[]; max_abs: number; status: string; };
type CleanDataResponse = { result: { [key: string]: string | boolean }; status: string };

const initChartData = { title: "", content: [] } as ChartData;
const containerStyle = { height: 'calc(100% - 102px)' };
const wrapperStyle = { height: 'calc(100% - 85px)' };

// 数据获取函数
const fetchData = async <T,>(url: string, params?: object): Promise<T> => {
    try {
        return await get<T>(url, params);
    } catch (error) {
        showErrorToast(url + " 获取失败，请稍后再试", error);
        throw error;
    }
};

const Page = () => {
    const [selectedBridge, setSelectedBridge] = React.useState('');
    const [bridgeOptions, setBridgeOptions] = React.useState<string[]>([]);
    const [selectedTime, setSelectedTime] = React.useState('');
    const [timeOptions, setTimeOptions] = React.useState<string[]>([]);
    const [selectedType, setSelectedType] = React.useState('');
    const [typeOptions, setTypeOptions] = React.useState<string[]>([]);
    const [selectedThreshold, setSelectedThreshold] = React.useState(0.01);
    const [selectedWindowSize, setSelectedWindowSize] = React.useState(100);
    const [selectedExtension, setSelectedExtension] = React.useState(0.05);
    const [rawData, setRawData] = React.useState(initChartData);
    const [cleanData, setCleanData] = React.useState<CleanDataResponse | null>(null);
    const [filteredData, setFilteredData] = React.useState(initChartData);
    const [processData, setProcessData] = React.useState(initChartData);

    const loadData = async () => {
        if (selectedBridge && selectedTime && selectedType) {
            await Promise.all([
                fetchData<RawDataResponse>('/metrics', { bridge: selectedBridge, time: selectedTime, type: selectedType })
                    .then(data => setRawData({ title: data.Filename, content: JSON.parse(data.FileContent) })),
                fetchData<CleanDataResponse>('/model-management/clean', { bridge: selectedBridge, time: selectedTime, type: selectedType, Parameters: JSON.stringify({ threshold: [0.01,0.01,0.01,0.01] }) })
                    .then(data => {
                        console.log(data)
                        setCleanData(data)
                    }),
                fetchData<ProcessedDataResponse>('/model-management/process', { bridge: selectedBridge, time: selectedTime, type: selectedType,Parameters: JSON.stringify({threshold: [0.01,0.01,0.01,0.01],extension:0.05 })  })
                    .then(data => setFilteredData({ title: data.max_abs, content: data.data })),
                fetchData<ProcessedDataResponse>('/model-management/filter', { bridge: selectedBridge, time: selectedTime, type: selectedType, Parameters: JSON.stringify({ window_size: selectedWindowSize }) })
                    .then(data => setProcessData({ title: data.max_abs, content: data.data })),
            ]);
        }
    };

    React.useEffect(() => {
        const loadOptions = async () => {
            try {
                const bridges = await fetchData<BridgeListResponse>('/bridges', {});
                const types = await fetchData<TypeListResponse>('/types', {});
                setBridgeOptions(bridges);
                setTypeOptions(types);
            } catch (error) {}
        };
        loadOptions();
    }, []);

    React.useEffect(() => {
        if (selectedBridge) {
            fetchData<TimeListResponse>('/times', { bridge: selectedBridge })
                .then(times => setTimeOptions(times));
        }
    }, [selectedBridge]);

    React.useEffect(() => {
        loadData();
    }, [selectedBridge, selectedTime, selectedType]);

    return (
        <div className="h-full bg-black">
            <ToastContainer />
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-2 pb-3 border-b-[1px] border-gray-600">
                {/* 桥梁选择器 */}
                <div className="flex items-start flex-col">
                    <label className="text-white font-bold px-2">桥梁</label>
                    <Select onValueChange={setSelectedBridge}>
                        <SelectTrigger className="w-[180px] text-white">
                            <SelectValue placeholder="选择桥梁" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>桥梁列表</SelectLabel>
                                {bridgeOptions.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* 时间选择器 */}
                <div className="flex items-start flex-col">
                    <label className="text-white font-bold px-2">时间</label>
                    <Select onValueChange={setSelectedTime}>
                        <SelectTrigger className="w-[180px] text-white">
                            <SelectValue placeholder="选择时间" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>时间列表</SelectLabel>
                                {timeOptions.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* 指标选择器 */}
                <div className="flex items-start flex-col">
                    <label className="text-white font-bold px-2">指标</label>
                    <Select onValueChange={setSelectedType}>
                        <SelectTrigger className="w-[180px] text-white">
                            <SelectValue placeholder="选择指标" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>指标列表</SelectLabel>
                                {typeOptions.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* 阈值选择器 */}
                <div className="flex items-start flex-col">
                    <label className="text-white font-bold px-2">阈值</label>
                    <Select onValueChange={setSelectedThreshold}>
                        <SelectTrigger className="w-[180px] text-white">
                            <SelectValue placeholder="选择阈值" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>阈值列表</SelectLabel>
                                {["0.1", "0.01", "0.001"].map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* 窗口大小选择器 */}
                <div className="flex items-start flex-col">
                    <label className="text-white font-bold px-2">窗口大小</label>
                    <Select onValueChange={setSelectedWindowSize}>
                        <SelectTrigger className="w-[180px] text-white">
                            <SelectValue placeholder="选择窗口大小" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>窗口大小列表</SelectLabel>
                                {["0.05", "0.005"].map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* 扩展选择器 */}
                <div className="flex items-start flex-col">
                    <label className="text-white font-bold px-2">扩展</label>
                    <Select onValueChange={setSelectedExtension}>
                        <SelectTrigger className="w-[180px] text-white">
                            <SelectValue placeholder="选择扩展" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>扩展列表</SelectLabel>
                                {["0.05", "0.005"].map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6" style={wrapperStyle}>
                {/* 渲染图表 */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">原始数据</CardTitle>
                        <CardDescription>{rawData.title}</CardDescription>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        <NoHeadLineChart data={rawData} />
                    </CardContent>
                </Card>

                {/* 数据清洗反馈 - 使用粗体标题和正常文字显示 */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">数据清洗反馈</CardTitle>
                        <CardDescription>清洗结果</CardDescription>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        {cleanData ? (
                            <div className="text-black space-y-2 text-l">
                                {Object.entries(cleanData.result).map(([key, value]) => (
                                    <div key={key}>
                                        <span className="font-bold mr-2">{key}:</span>
                                    {/* 如果value是bool值，输出字符串的true或false，如果是字符串，则直接输出 */}
                                        {typeof value === "boolean" ? (value ? "true" : "false") : value}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-white">暂无数据</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">切割后数据</CardTitle>
                        <CardDescription>{filteredData.title}</CardDescription>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        <NoHeadLineChart data={filteredData} />
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">平滑后数据</CardTitle>
                        <CardDescription>{processData.title}</CardDescription>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        <NoHeadLineChart data={processData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Page;
