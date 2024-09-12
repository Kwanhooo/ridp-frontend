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

const DataDashboard = () => {
    return (
        <div className="h-full flex flex-col bg-black">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {/* 桥梁选择 */}
                <div className="flex items-start space-x-2 flex-col">
                    <label htmlFor="bridge" className="text-white font-bold px-2">
                        桥梁
                    </label>
                    <Select>
                        <SelectTrigger className="w-[250px] text-white">
                            <SelectValue placeholder="选择桥梁"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>桥梁列表</SelectLabel>
                                <SelectItem value="桥梁1">桥梁1</SelectItem>
                                <SelectItem value="桥梁2">桥梁2</SelectItem>
                                <SelectItem value="桥梁3">桥梁3</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* 时间选择 */}
                <div className="flex items-start flex-col space-x-2">
                    <label htmlFor="time" className="text-white font-bold px-2">
                        时间
                    </label>
                    <Select>
                        <SelectTrigger className="w-[250px] text-white">
                            <SelectValue placeholder="选择时间"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>时间列表</SelectLabel>
                                <SelectItem value="时间1">时间1</SelectItem>
                                <SelectItem value="时间2">时间2</SelectItem>
                                <SelectItem value="时间3">时间3</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* 指标选择 */}
                <div className="flex items-start flex-col space-x-2">
                    <label htmlFor="indicator" className="text-white font-bold px-2 text-bold">
                        指标
                    </label>
                    <Select>
                        <SelectTrigger className="w-[250px] text-white">
                            <SelectValue placeholder="选择指标"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>指标列表</SelectLabel>
                                <SelectItem value="指标1">指标1</SelectItem>
                                <SelectItem value="指标2">指标2</SelectItem>
                                <SelectItem value="指标3">指标3</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md flex flex-col flex-grow">
                <div className="text-center text-xl font-bold py-2">1号墩支座竖向位移</div>
                <div className="flex-grow bg-gray-200 rounded-b-2xl"></div>
            </div>
        </div>
    );
};

export default DataDashboard;
