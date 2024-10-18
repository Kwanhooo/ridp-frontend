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

// 数据类型声明
type BridgeListResponse = string[];
type TimeListResponse = string[];
type TypeListResponse = string[];
type RawDataResponse = { FileName: string; FileContent: string; };
type ProcessedDataResponse = { data: { time: string, value: number }[]; max_abs: number; status: string; };
type CleanDataResponse = { result: { [key: string]: string | boolean }; status: string };

const initChartData = {title: "", content: []} as ChartData;
const containerStyle = {height: 'calc(100% - 102px)', maxHeight: '300px'};
const wrapperStyle = {height: 'calc(100% - 85px)', minHeight: '300px'};

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
    const [selectedBridge, setSelectedBridge] = React.useState('');
    const [bridgeOptions, setBridgeOptions] = React.useState<string[]>([]);
    const [selectedTime, setSelectedTime] = React.useState('');
    const [timeOptions, setTimeOptions] = React.useState<string[]>([]);
    const [selectedType, setSelectedType] = React.useState('');
    const [typeOptions, setTypeOptions] = React.useState<string[]>([]);
    const [, setSelectedThreshold] = React.useState<string>();
    const [, setSelectedWindowSize] = React.useState<string>();
    const [, setSelectedExtension] = React.useState<string>();
    const [rawData, setRawData] = React.useState(initChartData);
    const [cleanData, setCleanData] = React.useState<CleanDataResponse | null>(null);
    const [filteredData, setFilteredData] = React.useState(initChartData);
    const [processData, setProcessData] = React.useState(initChartData);
    const [loadingOptions, setLoadingOptions] = React.useState(true);

    const loadData = async () => {
        if (selectedBridge && selectedTime && selectedType) {
            try {
                // 清空旧数据
                setRawData(initChartData);
                setCleanData(null);
                setFilteredData(initChartData);
                setProcessData(initChartData);

                const rawDataResponse = await fetchData<RawDataResponse>('/metrics', {
                    bridge: selectedBridge,
                    time: selectedTime,
                    type: selectedType
                });
                setRawData({title: rawDataResponse.FileName, content: JSON.parse(rawDataResponse.FileContent)});

                const cleanDataResponse = await fetchData<CleanDataResponse>('/model-management/clean', {
                    bridge: selectedBridge,
                    time: selectedTime,
                    type: selectedType,
                    Parameters: JSON.stringify({threshold: [0.01, 0.01, 0.01, 0.01]})
                });
                console.log(cleanDataResponse);
                setCleanData(cleanDataResponse);

                // 检查清洗结果是否为 true，如果为 false，停止后续请求
                if (cleanDataResponse.result["\u68c0\u6d4b\u7ed3\u679c"] !== true) {
                    return;
                }

                const filteredDataResponse = await fetchData<ProcessedDataResponse>('/model-management/process', {
                    bridge: selectedBridge,
                    time: selectedTime,
                    type: selectedType,
                    Parameters: JSON.stringify({threshold: [0.01, 0.01, 0.01, 0.01], extension: 0.05})
                });
                setFilteredData({title: filteredDataResponse.max_abs, content: filteredDataResponse.data});

                const processDataResponse = await fetchData<ProcessedDataResponse>('/model-management/filter', {
                    bridge: selectedBridge,
                    time: selectedTime,
                    type: selectedType,
                    Parameters: JSON.stringify({window_size: 100})
                });
                setProcessData({title: processDataResponse.max_abs, content: processDataResponse.data});
            } catch (error) {
                console.error("数据加载出错", error);
            }
        }
    };

    React.useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoadingOptions(true);
                const bridges = await fetchData<BridgeListResponse>('/bridges', {});
                const types = await fetchData<TypeListResponse>('/types', {});
                setBridgeOptions(bridges);
                setTypeOptions(types);
            } catch (error) {
                console.error("加载桥梁和类型选项失败", error);
            } finally {
                setLoadingOptions(false);
            }
        };
        loadOptions();
    }, []);

    React.useEffect(() => {
        if (selectedBridge) {
            fetchData<TimeListResponse>('/times', {bridge: selectedBridge})
                .then(times => setTimeOptions(times))
                .catch(error => {
                    console.error("加载时间选项失败", error);
                    setTimeOptions([]); // 确保在请求失败时设置为空数组
                });
        }
    }, [selectedBridge]);

    React.useEffect(() => {
        loadData();
    }, [selectedBridge, selectedTime, selectedType]);

    return (
        <div className="h-full bg-black">
            <ToastContainer/>
            {loadingOptions ? (
                <div className="text-white text-center p-4">加载选项中...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-2 pb-3 border-b-[1px] border-gray-600">
                    {/* 桥梁选择器 */}
                    <div className="flex items-start flex-col">
                        <label className="text-white font-bold px-2">桥梁</label>
                        <Select onValueChange={setSelectedBridge}>
                            <SelectTrigger className="w-[180px] text-white">
                                <SelectValue placeholder="选择桥梁"/>
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
                                <SelectValue placeholder="选择时间"/>
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
                                <SelectValue placeholder="选择指标"/>
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
                        <Select onValueChange={setSelectedThreshold} defaultValue="0.01">
                            <SelectTrigger className="w-[180px] text-white">
                                <SelectValue placeholder="选择阈值"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>阈值列表</SelectLabel>
                                    {["0.01"].map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 窗口大小选择器 */}
                    <div className="flex items-start flex-col">
                        <label className="text-white font-bold px-2">窗口大小</label>
                        <Select onValueChange={setSelectedWindowSize} defaultValue="100">
                            <SelectTrigger className="w-[180px] text-white">
                                <SelectValue placeholder="选择窗口大小"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>窗口大小列表</SelectLabel>
                                    {["100"].map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 扩展选择器 */}
                    <div className="flex items-start flex-col">
                        <label className="text-white font-bold px-2">扩展</label>
                        <Select onValueChange={setSelectedExtension} defaultValue="0.05">
                            <SelectTrigger className="w-[180px] text-white">
                                <SelectValue placeholder="选择扩展"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>扩展列表</SelectLabel>
                                    {["0.05"].map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6" style={wrapperStyle}>
                {/* 渲染图表 */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">原始数据</CardTitle>
                        <CardDescription>{rawData.title ? ("数据源：" + rawData.title) : "暂无数据"}</CardDescription>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        <div className="h-full w-full flex justify-center items-center">
                            {rawData.content.length > 0 ? (
                                <NoHeadLineChart data={rawData}/>
                            ) : (
                                <div className="text-red-800 text-2xl font-bold">暂无数据</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 数据清洗反馈 - 使用粗体标题和正常文字显示 */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">数据清洗反馈</CardTitle>
                        <CardDescription>{filteredData.title ? ("最大绝对值：" + filteredData.title) : "暂无数据"}</CardDescription>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        <div className="h-full w-full flex justify-center items-center">
                            {cleanData ? (
                                <div className="text-black space-y-2 text-l">
                                    {Object.entries(cleanData.result).map(([key, value]) => (
                                        <div key={key}>
                                            <span className="font-bold mr-2">{key}:</span>
                                            {typeof value === "boolean" ? (value ? "true" : "false") : value}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-red-800 text-2xl font-bold">暂无数据</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">切割后数据</CardTitle>
                        <CardDescription>{filteredData.title ? ("最大绝对值：" + filteredData.title) : "暂无数据"}</CardDescription>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        <div className="h-full w-full flex justify-center items-center">
                            {filteredData.content.length > 0 ? (
                                <NoHeadLineChart data={filteredData}/>
                            ) : (
                                <div className="text-red-800 text-2xl font-bold">暂无数据</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">平滑后数据</CardTitle>
                        <CardDescription>{processData.title ? ("最大绝对值：" + processData.title) : "暂无数据"}</CardDescription>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        <div className="h-full w-full flex justify-center items-center">
                            {processData.content.length > 0 ? (
                                <NoHeadLineChart data={processData}/>
                            ) : (
                                <div className="text-red-800 text-2xl font-bold">暂无数据</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Page;
