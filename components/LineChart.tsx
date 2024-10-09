"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

interface Data {
  title: string;
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
    label: "Page Views",
  },
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function MyLineChart({ title, data }: Data) {
  const total = useMemo(
    () => ({
      value: data.file_content.reduce((acc, curr) => acc + curr.value, 0),
    }),
    [data.file_content]
  );

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row h-1/4">
        <div className="flex flex-1 flex-col justify-center gap-1 px-12">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{data.filename}</CardDescription>
        </div>
        <div className="flex">
          <button
            key="value"
            className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-4"
            disabled
          >
            <span className="text-s text-muted-foreground">Value</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total["value"].toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-1 sm:p-2 h-3/4">
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
