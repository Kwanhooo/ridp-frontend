// pages/page3.tsx
"use client";

import { useState, useEffect } from "react";

import { OriginalLineChart, HandledLineChart } from "@/components/LineChart";
import ChartSetting from "@/components/ChartSettting";
import { get } from "../uitils/HttpAxios";

type OriginalData = {
  FileContent: {
    time: string;
    value: number;
  }[];
  FileName: string;
};

type HandledData = {
  data: {
    time: string;
    value: number;
  }[];
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

  const [selectedType, setSelectedType] = useState<string>("");

  const [selectedLimitation, setSelectedLimitation] = useState<string>("");
  const [selectedExtension, setSelectedExtension] = useState<string>("");

  const [originChartData, setOriginChartData] = useState<OriginalData>({
    FileContent: [],
    FileName: "",
  } as OriginalData);
  const [cutChartData, setCutChartData] = useState<HandledData>(
    {} as HandledData
  );
  const [filterChartData, setFilterChartData] = useState<HandledData>(
    {} as HandledData
  );

  // Fetch data from the API
  useEffect(() => {
    const fetch_data = async () => {
      try {
        const bridge_options = await get<string[]>("bridges");
        setSelectedBridge(bridge_options[0]);
        setBridgeOptions(bridge_options);

        // const time_options = await get<string[]>("times", {
        //   bridge: bridge_options[0],
        // });
        // setSelectedTime(time_options[0]);
        // setTimeOptions(time_options);

        const metric_options = await get<string[]>("types");
        setSelectedMetric(metric_options[0]);
        setMetricOptions(metric_options);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetch_data();
  }, []);
  // Fetch time options when selectedBridge changes
  useEffect(() => {
    const fetch_time_options = async () => {
      try {
        const time_options = await get<string[]>("times", {
          bridge: selectedBridge,
        });
        setSelectedTime(time_options[0]);
        setTimeOptions(time_options);
      } catch (error) {
        console.error("Error fetching time options:", error);
      }
    };
    fetch_time_options();
  }, [selectedBridge]);

  // Fetch origin chart data when selectedMetric change
  // useEffect(() => {
  //   const fetch_origin_chart_data = async () => {
  //     try {
  //       const response = await get<{ FileContent: string; FileName: string }>(
  //         "metrics",
  //         {
  //           bridge: selectedBridge,
  //           time: selectedTime,
  //           type: selectedMetric,
  //         }
  //       );
  //       setOriginChartData({
  //         FileContent: JSON.parse(response.FileContent),
  //         FileName: response.FileName,
  //       });
  //     } catch (error) {
  //       console.error("Error fetching origin chart data:", error);
  //     }
  //   };

  //   const fetch_cut_chart_data = async () => {
  //     try {
  //       const response = await get<HandledData>("model-management/cut", {
  //         bridge: selectedBridge,
  //         time: selectedTime,
  //         type: selectedMetric,
  //         Parameter: JSON.stringify({
  //           threshold: [0.01, 0.01, 0.01, 0.01],
  //           extension: 0.05,
  //         }),
  //       });
  //       console.log("cut model", response);
  //       // todo
  //       // setCutChartData(response);
  //     } catch (error) {
  //       console.error("Error fetching cut chart data:", error);
  //     }
  //   };

  //   const fetch_filter_chart_data = async () => {
  //     try {
  //       const response = await get<HandledData>("model-management/filter", {
  //         bridge: selectedBridge,
  //         time: selectedTime,
  //         type: selectedMetric,
  //         Parameters: JSON.stringify({
  //           window_size: 100,
  //         }),
  //       });
  //       console.log("filter model", response);
  //       // todo
  //     } catch (error) {
  //       console.error("Error fetching cut chart data:", error);
  //     }
  //   };

  //   if (selectedBridge && selectedTime && selectedMetric) {
  //     fetch_origin_chart_data();
  //     fetch_cut_chart_data();
  //     fetch_filter_chart_data();
  //   }
  // }, [selectedBridge, selectedTime, selectedMetric]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedBridge && selectedTime && selectedMetric) {
        try {
          const [originResponse, cutResponse, filterResponse] =
            await Promise.all([
              get<{ FileContent: string; FileName: string }>("metrics", {
                bridge: selectedBridge,
                time: selectedTime,
                type: selectedMetric,
              }),
              get<HandledData>("model-management/cut", {
                bridge: selectedBridge,
                time: selectedTime,
                type: selectedMetric,
                Parameters: JSON.stringify({
                  threshold: [0.01, 0.01, 0.01, 0.01],
                  extension: 0.05,
                }),
              }),
              get<HandledData>("model-management/filter", {
                bridge: selectedBridge,
                time: selectedTime,
                type: selectedMetric,
                Parameters: JSON.stringify({
                  window_size: 100,
                }),
              }),
            ]);

          setOriginChartData({
            FileContent: JSON.parse(originResponse.FileContent),
            FileName: originResponse.FileName,
          });

          setCutChartData(cutResponse);

          setFilterChartData(filterResponse);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [selectedBridge, selectedTime, selectedMetric]);

  // useEffect(() => {
  //   // Fetch origin chart data when selectedMetric change
  //   const fetch_handle_chart_data = async () => {
  //     console.log("********************************");

  //     try {
  //       if (selectedType == "CleanModel") {
  //         const handle_chart_data = await get<ChartData>(
  //           "model-management/clean",
  //           {
  //             bridge: selectedBridge,
  //             time: selectedTime,
  //             type: selectedMetric,
  //             // Parameters: JSON.stringify({
  //             //   limitation: selectedLimitation,
  //             // }),
  //             Parameters: JSON.stringify({
  //               threshold: [0.01, 0.01, 0.01, 0.01],
  //             }),
  //           }
  //         );
  //         setHandleChartData(handle_chart_data);
  //         console.log(handle_chart_data);
  //       } else if (selectedType === "CutModel") {
  //         const handle_chart_data = await get<ChartData>(
  //           "model-management/cut",
  //           {
  //             bridge: selectedBridge,
  //             time: selectedTime,
  //             type: selectedMetric,
  //             // Parameters: JSON.stringify({
  //             //   limitation: selectedLimitation,
  //             //   extension: selectedExtension,
  //             // }),
  //             Parameters: JSON.stringify({
  //               threshold: [0.01, 0.01, 0.01, 0.01],
  //               extension: 0.05,
  //             }),
  //           }
  //         );
  //         setHandleChartData(handle_chart_data);
  //       } else if (selectedType === "FilterModel") {
  //         const handle_chart_data = await get<ChartData>(
  //           "model-management/filter",
  //           {
  //             bridge: selectedBridge,
  //             time: selectedTime,
  //             type: selectedMetric,
  //             Parameters: JSON.stringify({
  //               window_size: 100,
  //             }),
  //           }
  //         );
  //         setHandleChartData(handle_chart_data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching time options:", error);
  //     }
  //   };
  //   // render handleChartData only if originChartData is not empty
  //   // if (Object.keys(originChartData).length > 0) {
  //   //   fetch_handle_chart_data();
  //   // }
  //   fetch_handle_chart_data();
  // }, [selectedType]);

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
    {
      label: "模型类型",
      options: ["CleanModel", "CutModel", "FilterModel"],
      defaultValue: selectedType,
      onChange: setSelectedType,
    },
    {
      label: "阈值",
      options: ["0.01"],
      defaultValue: selectedLimitation,
      onChange: setSelectedLimitation,
    },
    {
      label: "拓展",
      options: ["0.05"],
      defaultValue: selectedExtension,
      onChange: setSelectedExtension,
    },
  ];

  const handleSubmit = async () => {
    // 获取图表数据
    // try {
    //   if (selectedTime !== undefined) {
    //     const response = await get<OriginalData>("metrics", {
    //       bridge: selectedBridge,
    //       time: selectedTime,
    //       type: selectedMetric,
    //     });
    //     console.log(response);
    //     setOriginChartData(response);
    //   }
    // } catch (error) {
    //   console.error("Error fetching chart data:", error);
    // }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="h-1/8 p-2 border-b border-gray-700">
        <ChartSetting selects={selects} submit={handleSubmit} />
      </div>

      <div className="flex flex-col h-7/8 p-2 w-full space-y-2">
        <div className="h-1/2">
          <OriginalLineChart
            data={originChartData}
            title="原始数据"
          ></OriginalLineChart>
        </div>
        <div className="h-1/2">
          <HandledLineChart
            cutData={cutChartData}
            filterData={filterChartData}
            title="模型数据"
          ></HandledLineChart>
        </div>
      </div>
    </div>
  );
};

export default Page;
