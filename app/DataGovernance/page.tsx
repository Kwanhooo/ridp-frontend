"use client"
import * as React from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import NoHeadLineChart from '@/components/NoHeadLineChart';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {ChartData} from "@/types/ChartData";
import {get} from "@/app/uitils/HttpAxios";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {showErrorToast} from "@/app/uitils/toast";

type BridgeListResponse = string[];
type TimeListResponse = string[];
type TypeListResponse = string[];
type RawDataResponse = { Filename: string; FileContent: { time: string; value: number }[]; };
type ProcessedDataResponse = { data: { time: string, value: number }[]; max_abs: number; status: string; }

const initChartData = {title: "", content: []} as ChartData;
const containerStyle = {height: `calc(100% - 102px)`};
const wrapperStyle = {height: `calc(100% - 85px)`};

// 数据获取函数
const fetchData = async <T, >(url: string, params?: object): Promise<T> => {
    try {
        return await get<T>(url, params);
    } catch (error) {
        showErrorToast(url + " 获取失败，请稍后再试", error);
        throw error;
    }
};

const Page = () => {
    const [selectedBridge, setSelectedBridge] = React.useState('' as string);
    const [bridgeOptions, setBridgeOptions] = React.useState<string[]>([]);
    const [selectedTime, setSelectedTime] = React.useState('' as string);
    const [selectedExtension, setSelectedExtension] = React.useState('');
    const [timeOptions, setTimeOptions] = React.useState<string[]>([]);
    const [selectedThreshold, setSelectedThreshold] = React.useState('');
    const [selectedWindowSize, setSelectedWindowSize] = React.useState('');
    const [selectedType, setSelectedType] = React.useState('' as string);
    const [typeOptions, setTypeOptions] = React.useState<string[]>([]);
    const [rawData, setRawData] = React.useState(initChartData as ChartData);
    const [cutData, setCutData] = React.useState(initChartData as ChartData);
    const [filteredData, setFilteredData] = React.useState(initChartData as ChartData);
    const [processData, setProcessData] = React.useState(initChartData as ChartData);

    const loadData = async () => {
        if (selectedBridge && selectedTime && selectedType) {
            await Promise.all([
                fetchData<RawDataResponse>('/metrics', {
                    bridge: selectedBridge,
                    time: selectedTime,
                    type: selectedType
                }).then(data => setRawData({title: data.Filename, content: data.FileContent})),
                fetchData<ProcessedDataResponse>('/cut', {
                    bridge: selectedBridge,
                    time: selectedTime,
                    type: selectedType,
                    Parameters: JSON.stringify({threshold: selectedThreshold})
                }).then(data => setCutData({title: data.max_abs, content: data.data})),
                fetchData<ProcessedDataResponse>('/filter', {
                    bridge: selectedBridge,
                    time: selectedTime,
                    type: selectedType,
                    Parameters: JSON.stringify({window_size: selectedWindowSize})
                }).then(data => setFilteredData({title: data.max_abs, content: data.data})),
                fetchData<ProcessedDataResponse>('/process', {
                    bridge: selectedBridge,
                    time: selectedTime,
                    type: selectedType
                }).then(data => setProcessData({title: data.max_abs, content: data.data})),
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
                if (bridges.length > 0) setSelectedBridge(bridges[0]);
                if (types.length > 0) setSelectedType(types[0]);
            } catch (error) {
            }
        };

        loadOptions();
    }, []);

    React.useEffect(() => {
        if (selectedBridge) {
            fetchData<TimeListResponse>('/bridges', {bridge: selectedBridge}).then(times => {
                setTimeOptions(times);
                if (times.length > 0) setSelectedTime(times[0]);
            });
        }
    }, [selectedBridge]);

    React.useEffect(() => {
        loadData();
    }, [selectedBridge, selectedTime, selectedType]);

    return (
        <div className="h-full bg-black">
            <ToastContainer/>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-2 pb-3 border-b-[1px] border-gray-600">
                {/* 选择器组件 */}
                {[
                    {label: "桥梁", options: bridgeOptions, value: selectedBridge, setter: setSelectedBridge},
                    {label: "时间", options: timeOptions, value: selectedTime, setter: setSelectedTime},
                    {label: "指标", options: typeOptions, value: selectedType, setter: setSelectedType},
                    {
                        label: "阈值",
                        options: ["0.1", "0.01", "0.001"],
                        value: selectedThreshold,
                        setter: setSelectedThreshold
                    },
                    {
                        label: "窗口大小",
                        options: ["0.05", "0.005"],
                        value: selectedWindowSize,
                        setter: setSelectedWindowSize
                    },
                    {
                        label: "扩展",
                        options: ["0.05", "0.005"],
                        value: selectedExtension,
                        setter: setSelectedExtension
                    }
                ].map(({label, options, setter}) => (
                    <div className="flex items-start flex-col" key={label}>
                        <label className="text-white font-bold px-2">{label}</label>
                        <Select onValueChange={setter}>
                            <SelectTrigger className="w-[180px] text-white">
                                <SelectValue placeholder={`选择${label}`}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{`${label}列表`}</SelectLabel>
                                    {options.map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6" style={wrapperStyle}>
                {[rawData, cutData, filteredData, processData].map((data, index) => (
                    <Card className="flex flex-col" key={index}>
                        <CardHeader>
                            <CardTitle
                                className="text-xl font-bold">{["原始数据", "切割后数据", "平滑后数据", "多模态数据"][index]}</CardTitle>
                            <CardDescription><span>{data.title}</span></CardDescription>
                        </CardHeader>
                        <CardContent style={containerStyle}>
                            <div className="h-full w-full flex justify-center items-center">
                                {data.content.length > 0 && <NoHeadLineChart data={data}/>}
                                {data.content.length === 0 && (
                                    <div className="text-red-800 text-2xl font-bold">
                                        暂无数据
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Page;
