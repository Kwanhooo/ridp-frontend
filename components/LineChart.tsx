"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { GitCommitVertical } from "lucide-react";

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
        <div className="flex flex-1 flex-col justify-center">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="模型选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
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

export function HandledLineChart({
  title = "模型数据",
  cutData = { data: [], status: "" },
  filterData = { data: [], status: "" },
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

type ChartWithTableProps = {
  title: string;
  original_data: {
    time: string;
    value: number;
  }[];
  table_data:
    | {
        y值偏移: string;
        偏移量: number;
        初始段: string;
        峰值抖动: string;
        峰值检测: string;
        最终段: string;
        检测结果: boolean;
      }
    | undefined;
  onModelNameChange: (value: string) => void;
  selectOptions: string[];
};

export function ChartWithTable({
  title,
  original_data = [],
  table_data,
  onModelNameChange,
  selectOptions = [],
}: ChartWithTableProps) {
  return (
    <Card className="h-full w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row h-1/4">
        <div className="flex flex-1 flex-col justify-center gap-1 px-12">
          <CardTitle>{title}</CardTitle>
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <Select
            onValueChange={onModelNameChange}
            defaultValue={selectOptions[0]}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="模型选择" />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((value) => {
                return (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-1 sm:p-2 h-3/4 grid grid-cols-2 gap-2">
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-auto h-full"
        >
          <LineChart
            accessibilityLayer
            data={original_data}
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
        {table_data && (
          <div className="w-full overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <th className="border py-1 text-center font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    指标
                  </th>
                  <th className="border py-1 text-center font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    结果
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <td className="border text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                    y值偏移
                  </td>
                  <td className="border text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                    {table_data?.y值偏移}
                  </td>
                </tr>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <td className="border text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                    偏移量
                  </td>
                  <td className="border text-center sm:truncate sm:max-w-[150px] [&[align=center]]:text-center [&[align=right]]:text-right">
                    {table_data?.偏移量}
                  </td>
                </tr>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <td className="border  text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                    初始段
                  </td>
                  <td className="border text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                    {table_data?.初始段}
                  </td>
                </tr>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <td className="border  text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                    峰值抖动
                  </td>
                  <td className="border text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                    {table_data?.峰值抖动}
                  </td>
                </tr>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <td className="border text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                    峰值检测
                  </td>
                  <td className="border text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                    {table_data?.峰值检测}
                  </td>
                </tr>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <td className="border text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                    最终段
                  </td>
                  <td className="border text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                    {table_data?.最终段}
                  </td>
                </tr>
                {/* <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border  text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                  检测结果
                </td>
                <td className="border text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                  {table_data?.检测结果}
                </td>
              </tr> */}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type BigLineChartProps = {
  title: string;
  original_data: {
    time: string;
    value: number;
  }[];
  handled_data: {
    time: string;
    value: number;
  }[];
  onModelNameChange: (value: string) => void;
  onModelTypeChange?: (value: string) => void;
  selectOptions: string[];
  anomalyOptions?: string[];
  detection_index?: number[];
};

export function BigLineChart({
  title,
  original_data = [],
  handled_data = [],
  onModelNameChange,
  onModelTypeChange,
  selectOptions = [],
  anomalyOptions,
  detection_index,
}: BigLineChartProps) {
  
  return (
    <Card className="h-full w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row h-1/4">
        <div className="flex flex-1 flex-col justify-center gap-1 px-12">
          <CardTitle>{title}</CardTitle>
        </div>
        <div className="flex flex-1 flex-row justify-center gap-x-2">
          <div className="flex flex-1 flex-col justify-center">
            <Select
              onValueChange={onModelNameChange}
              defaultValue={selectOptions[0]}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="模型选择" />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((value) => {
                  return (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-1 flex-col justify-center">
            {anomalyOptions && (
              <Select
                onValueChange={onModelTypeChange}
                defaultValue={anomalyOptions[0]}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="指标选择" />
                </SelectTrigger>
                <SelectContent>
                  {anomalyOptions.map((value) => {
                    return (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-1 sm:p-2 h-3/4 grid grid-cols-2 gap-2">
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-auto h-full"
        >
          <LineChart
            accessibilityLayer
            data={original_data}
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
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-auto h-full"
        >
          <LineChart
            accessibilityLayer
            data={handled_data}
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
              stroke={chartConfig.cut.color}
              strokeWidth={2}
              dot={({ cx, cy, payload, index }) => {
                if (detection_index && index in detection_index) {
                  const r = 24;
                  return (
                    <GitCommitVertical
                      key={payload.month}
                      x={cx - r / 2}
                      y={cy - r / 2}
                      width={r}
                      height={r}
                      fill={chartConfig.value.color}
                      stroke={chartConfig.value.color}
                    />
                  );
                } else {
                  return <></>;
                }
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
