"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    YAxis,
} from "recharts";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface Data {
    data: {
        filename: string;
        file_content: {
            time: string | Date;
            value: number;
        }[];
    };
}

const chartConfig = {
    views: {
        label: "数值",
    },
    value: {
        label: "Value",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export default function MyLineChart({ data }: Data) {
    return (
       <div className="h-full w-full">
           <ChartContainer
               config={chartConfig}
               className="w-full aspect-auto h-full"
           >
               <LineChart
                   accessibilityLayer
                   data={data.file_content}
                   margin={{
                       left: 12,
                       right: 12,
                   }}
               >
                   <CartesianGrid vertical={false} />
                   <XAxis
                       dataKey="time"
                       tickLine={false}
                       axisLine={false}
                       tickMargin={8}
                       minTickGap={32}
                       tickFormatter={(value) => value.slice(11, 23)}
                   />
                   <YAxis />
                   <ChartTooltip
                       content={
                           <ChartTooltipContent
                               className="w-[150px] bg-white"
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
       </div>
    );
}
