"use client";

import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";

import {useEffect, useState} from "react";

type OriginalChartData = {
    title: string;
    data: {
        FileContent: {
            time: string;
            value: number;
        }[];
        FileName: string;
    };
};

type HandledChartData = {
    title: string;
    cutData: {
        data: { time: string; value: number }[];
        status: string;
    };
    filterData: {
        data: { time: string; value: number }[];
        status: string;
        max_value?: number;
    };
};

const chartConfig = {
    views: {
        label: "Page Views",
        color: "hsl(var(--chart-0))",
    },
    value: {
        label: "Value",
        color: "hsl(var(--chart-1))",
    },
    cut: {
        label: "Cut",
        color: "hsl(var(--chart-2))",
    },
    filter: {
        label: "Filter",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig;

export function OriginalLineChart({
                                      title = "原始数据",
                                      data = {
                                          FileContent: [],
                                          FileName: "",
                                      },
                                  }: OriginalChartData) {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row h-1/4">
                <div className="flex flex-1 flex-col justify-center gap-1 px-12">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{data.FileName}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-1 sm:p-2 h-3/4">
                <ChartContainer
                    config={chartConfig}
                    className="w-full aspect-auto h-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={data.FileContent}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => value.slice(11, 23)}
                        />
                        <YAxis/>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("zh-CN", {
                                            second: "numeric",
                                            minute: "numeric",
                                            hour: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        });
                                    }}
                                />
                            }
                        />
                        <Line
                            dataKey="value"
                            type="monotone"
                            stroke={chartConfig.value.color}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export function HandledLineChart({
                                     title = "模型数据",
                                     cutData = {data: [], status: ""},
                                     filterData = {data: [], status: ""},
                                 }: HandledChartData) {
    const [activeChart, setActiveChart] =
        useState<keyof typeof chartConfig>("cut");

    const [selectedData, setSelectedData] = useState<
        {
            time: string;
            value: number;
        }[]
    >([]);

    useEffect(() => {
        setSelectedData(cutData.data);
    }, [cutData.data]);
    console.log(cutData.data);
    console.log(selectedData);

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row h-1/4">
                <div className="flex flex-1 flex-col justify-center gap-1 px-12">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>xxx.test</CardDescription>
                </div>
                <div className="flex">
                    {["cut", "filter"].map((key) => {
                        const chart = key as keyof typeof chartConfig;
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => {
                                    setActiveChart(chart);

                                    if (chart === "cut") {
                                        setSelectedData(cutData.data);
                                    } else {
                                        setSelectedData(filterData.data);
                                    }
                                }}
                            >
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {chartConfig[chart].label}
                </span>
                            </button>
                        );
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-1 sm:p-2 h-3/4">
                <ChartContainer
                    config={chartConfig}
                    className="w-full aspect-auto h-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={selectedData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => value.slice(11, 23)}
                        />
                        <YAxis/>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("zh-CN", {
                                            second: "numeric",
                                            minute: "numeric",
                                            hour: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        });
                                    }}
                                />
                            }
                        />
                        <Line
                            dataKey="value"
                            type="monotone"
                            stroke={chartConfig[activeChart].color}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
