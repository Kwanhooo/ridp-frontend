// pages/page3.tsx
"use client";

import { useState, useEffect } from "react";

import {
  // OriginalLineChart,
  // HandledLineChart,
  BigLineChart,
} from "@/components/LineChart";
import ChartSetting from "@/components/ChartSetting";
import { get } from "../utils/HttpAxios";
import { formatTime } from "@/app/utils/util";

type ChartData = {
  time: string;
  value: number;
};

type ResponseData = {
  data: ChartData[];
  status: string;
  max_abs?: number;
};

const Page = () => {
  const [selectedBridge, setSelectedBridge] = useState<string>("");
  const [bridgeOptions, setBridgeOptions] = useState<string[]>([]);

  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeOptions, setTimeOptions] = useState<string[]>([]);

  const [selectedMetric, setSelectedMetric] = useState<string>("");
  const [metricOptions, setMetricOptions] = useState<string[]>([]);

  // const [selectedType, setSelectedType] = useState<string>("");

  // const [selectedLimitation, setSelectedLimitation] = useState<string>("");
  // const [selectedExtension, setSelectedExtension] = useState<string>("");

  const [originChartData, setOriginChartData] = useState<ChartData[]>([]);
  const [cutChartData, setCutChartData] = useState<ChartData[]>([]);
  const [filterChartData, setFilterChartData] = useState<ChartData[]>([]);

  // Fetch data from the API
  useEffect(() => {
    const fetch_data = async () => {
      try {
        const bridge_options = await get<string[]>("bridges");
        setSelectedBridge(bridge_options[0]);
        setBridgeOptions(bridge_options);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetch_data();
  }, []);
  // Fetch time options when selectedBridge changes
  useEffect(() => {
    const fetch_time_options = async () => {
      if (selectedBridge && selectedBridge !== "") {
        try {
          const time_options = await get<string[]>("times", {
            bridge: selectedBridge,
          });
          setSelectedTime(time_options[0]);
          setTimeOptions(time_options);

          const metric_options = await get<string[]>("pointName", {
            bridge: selectedBridge,
          });
          setSelectedMetric(metric_options[0]);
          setMetricOptions(metric_options);
        } catch (error) {
          console.error("Error fetching time options:", error);
        }
      }
    };
    fetch_time_options();
  }, [selectedBridge]);


  useEffect(() => {
    const fetchData = async () => {
      if (selectedBridge && selectedTime && selectedMetric) {
        try {
          const [originResponse, cutResponse, filterResponse] =
            await Promise.all([
              get<ChartData[]>("metrics", {
                bridge: selectedBridge,
                time: formatTime(selectedTime),
                pointName: selectedMetric,
              }),
              // get<{ FileContent: string; FileName: string }>(
              //   "data_process/clean",
              //   {
              //     bridge: selectedBridge,
              //     time: formatTime(selectedTime),
              //     pointName: selectedMetric,
              //     modelName: "模型1",
              //   }
              // ),
              get<ResponseData>("data_process/cut", {
                bridge: selectedBridge,
                time: formatTime(selectedTime),
                pointName: selectedMetric,
                modelName: "模型1",
              }),
              get<ResponseData>("data_process/filter", {
                bridge: selectedBridge,
                time: formatTime(selectedTime),
                pointName: selectedMetric,
                modelName: "模型1",
              }),
            ]);

          console.log("originResponse:", originResponse);
          // console.log("cleanResponse:", cleanResponse);
          console.log("cutResponse:", cutResponse);
          console.log("filterResponse:", filterResponse);

          setOriginChartData(originResponse);
          setCutChartData(cutResponse.data);
          setFilterChartData(filterResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [selectedBridge, selectedTime, selectedMetric]);


  const selects = [
    {
      label: "桥梁",
      options: bridgeOptions,
      defaultValue: selectedBridge,
      onChange: setSelectedBridge,
    },
    {
      label: "时间",
      options: timeOptions,
      defaultValue: selectedTime,
      onChange: setSelectedTime,
    },
    {
      label: "指标",
      options: metricOptions,
      defaultValue: selectedMetric,
      onChange: setSelectedMetric,
    },
    // {
    //   label: "模型类型",
    //   options: ["CleanModel", "CutModel", "FilterModel"],
    //   defaultValue: selectedType,
    //   onChange: setSelectedType,
    // },
    // {
    //   label: "阈值",
    //   options: ["0.01"],
    //   defaultValue: selectedLimitation,
    //   onChange: setSelectedLimitation,
    // },
    // {
    //   label: "拓展",
    //   options: ["0.05"],
    //   defaultValue: selectedExtension,
    //   onChange: setSelectedExtension,
    // },
  ];

  return (
    <div className="flex flex-col h-screen ">
      <div className="h-1/8 p-2 border-b border-gray-700">
        <ChartSetting selects={selects} />
      </div>
      <div className="grid grid-cols-2 h-7/8">
        <div className="grid grid-rows-3 gap-4 h-7/8 p-2 w-full">
          <BigLineChart
            original_data={originChartData}
            handled_data={cutChartData}
            title="异常值检测"
          ></BigLineChart>
          <BigLineChart
            original_data={originChartData}
            handled_data={cutChartData}
            title="异常值处理"
          ></BigLineChart>
          <BigLineChart
            original_data={originChartData}
            handled_data={filterChartData}
            title="缺失值填充"
          ></BigLineChart>
        </div>
        <div className="grid grid-rows-3 gap-4 h-7/8 p-2 w-full">
          <BigLineChart
            original_data={originChartData}
            handled_data={cutChartData}
            title="数据清洗"
          ></BigLineChart>
          <BigLineChart
            original_data={originChartData}
            handled_data={cutChartData}
            title="数据窗口"
          ></BigLineChart>
          <BigLineChart
            original_data={originChartData}
            handled_data={filterChartData}
            title="数据平滑"
          ></BigLineChart>
        </div>
      </div>
    </div>
  );
};

export default Page;
