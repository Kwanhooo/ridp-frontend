// pages/page3.tsx
"use client";

import { useState, useEffect, useRef } from "react";

import { BigLineChart, ChartWithTable } from "@/components/LineChart";
import { get } from "../utils/HttpAxios";
import { checkParameters } from "@/app/utils/util";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/DateTimePicker";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { formatTime } from "@/app/utils/util";

type ChartData = {
  time: string;
  value: number;
};

type ResponseData = {
  data: ChartData[];
  result?: ChartData[];
  status: string;
  max_abs?: number;
};

type CleanResponse = {
  y值偏移: string;
  偏移量: number;
  初始段: string;
  峰值抖动: string;
  峰值检测: string;
  最终段: string;
  检测结果: boolean;
};

type DetectionResponse = {
  anomaly_indices: number[];
  anomaly_values: number[];
};

const Page = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const [cleanModelType, setCleanModelType] = useState<string>("模型1");
  const [cutModelType, setCutModelType] = useState<string>("模型1");
  const [filterModelType, setFilterModelType] = useState<string>("模型1");

  const [anomalyDetectionModelName, setAnomalyDetectionModelName] =
    useState<string>("模型1");
  const [anomalyFillingModelName, setAnomalyFillingModelName] =
    useState<string>("模型1");
  const [missingFillingModelName, setMissingFillingModelName] =
    useState<string>("模型1");

  const [anomalyDetectionType, setAnomalyDetectionType] =
    useState<string>("四分位间距");
  const [anomalyFillingType, setAnomalyFillingType] =
    useState<string>("四分位间距");
  const [missingFillingType, setMissingFillingType] =
    useState<string>("均值填充");

  const [selectedBridge, setSelectedBridge] = useState<string>("");
  const [bridgeOptions, setBridgeOptions] = useState<string[]>([]);

  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeOptions, setTimeOptions] = useState<string[]>([]);

  const [selectedMetric, setSelectedMetric] = useState<string>("");
  const [metricOptions, setMetricOptions] = useState<string[]>([]);

  const [originChartData, setOriginChartData] = useState<ChartData[]>([]);
  const [cleanResult, setCleanResult] = useState<CleanResponse>();
  const [cutChartData, setCutChartData] = useState<ChartData[]>([]);
  const [filterChartData, setFilterChartData] = useState<ChartData[]>([]);

  const [anomalyDetection, setAnomalyDetection] = useState<DetectionResponse>();
  const [anomalyFilling, setAnomalyFilling] = useState<ChartData[]>([]);
  const [missingFilling, setMissingFilling] = useState<ChartData[]>([]);

  const cache = useRef(false);
  // Fetch data from the API
  useEffect(() => {
    const fetch_data = async () => {
      try {
        setLoading(true);
        const bridge_options = await get<string[]>("bridges");

        const [time_options, metric_options] = await Promise.all([
          get<string[]>("times", {
            bridge: bridge_options[0],
          }),
          get<string[]>("pointName", {
            bridge: bridge_options[0],
          }),
        ]);

        // 确保只调用一次 handleQuery
        if (!cache.current) {
          cache.current = true; // 标记已经调用过 handleQuery
          await handleQuery(
            bridge_options[0],
            formatTime(time_options[0]),
            metric_options[0]
          );
          setLoading(false);
        }
        setBridgeOptions(bridge_options);
        

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetch_data();
  }, []);

  // Fetch time options when selectedBridge changes
  useEffect(() => {
    const fetch_time_options = async () => {
      if (selectedBridge && selectedBridge !== "") {
        try {
          setLoading(true);
          const time_options = await get<string[]>("times", {
            bridge: selectedBridge,
          });
          // setSelectedTime(time_options[0]);
          setTimeOptions(time_options);

          const metric_options = await get<string[]>("pointName", {
            bridge: selectedBridge,
          });
          // setSelectedMetric(metric_options[0]);
          setMetricOptions(metric_options);
        } catch (error) {
          console.error("Error fetching time options:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetch_time_options();
  }, [selectedBridge]);

  const handleQuery = async (
    bridge?: string,
    time?: string,
    metric?: string
  ) => {
    bridge = bridge || selectedBridge;
    time = time || selectedTime;
    metric = metric || selectedMetric;
    if (checkParameters(bridge, time, metric)) {
      try {
        setLoading(true);
        const [
          originResponse,
          cleanResponse,
          cutResponse,
          filterResponse,
          anomalyDetectionResponse,
          anomalyFillingResponse,
          missingFillingResponse,
        ] = await Promise.all([
          get<ChartData[]>("metrics", {
            bridge,
            time,
            pointName: metric,
          }),
          get<{ result: CleanResponse; status: string }>("data_process/clean", {
            bridge,
            time,
            pointName: metric,
            modelName: cleanModelType,
          }),
          get<ResponseData>("data_process/cut", {
            bridge,
            time,
            pointName: metric,
            modelName: cutModelType,
          }),
          get<ResponseData>("data_process/filter", {
            bridge,
            time,
            pointName: metric,
            modelName: filterModelType,
          }),
          get<{
            result: DetectionResponse;
            status: string;
          }>("data_process/anomaly_detection", {
            bridge,
            time,
            pointName: metric,
            modelName: anomalyDetectionModelName,
            modelType: anomalyDetectionType,
          }),
          get<ResponseData>("data_process/anomaly_filling", {
            bridge,
            time,
            pointName: metric,
            modelName: anomalyFillingModelName,
            modelType: anomalyFillingType,
          }),
          get<ResponseData>("data_process/missing_filling", {
            bridge,
            time,
            pointName: metric,
            modelName: missingFillingModelName,
            modelType: missingFillingType,
          }),
        ]);

        setCleanResult(cleanResponse.result);
        setOriginChartData(originResponse);
        setCutChartData(cutResponse.data);
        setFilterChartData(filterResponse.data);

        setAnomalyDetection(anomalyDetectionResponse.result);
        setAnomalyFilling(anomalyFillingResponse.result!);
        setMissingFilling(missingFillingResponse.result!);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "条件不完整",
        description: "请选择桥梁、时间、指标",
      });
    }
  };

  const handleReset = () => {
    setSelectedBridge("");
    setSelectedTime("");
    setSelectedMetric("");
  };

  // clean
  useEffect(() => {
    const fetchData = async () => {
      if (checkParameters(selectedBridge, selectedTime, selectedMetric)) {
        try {
          setLoading(true);
          const cleanResult = await get<{
            result: CleanResponse;
            status: string;
          }>("data_process/clean", {
            bridge: selectedBridge,
            time: selectedTime,
            pointName: selectedMetric,
            modelName: cleanModelType,
          });

          setCleanResult(cleanResult.result);
        } catch {
          console.log("error");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [cleanModelType]);

  // cut
  useEffect(() => {
    const fetchData = async () => {
      if (checkParameters(selectedBridge, selectedTime, selectedMetric)) {
        try {
          setLoading(true);
          const cutResult = await get<ResponseData>("data_process/cut", {
            bridge: selectedBridge,
            time: selectedTime,
            pointName: selectedMetric,
            modelName: cutModelType,
          });

          setCutChartData(cutResult.data);
        } catch {
          console.log("error");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [cutModelType]);

  // filter
  useEffect(() => {
    const fetchData = async () => {
      if (checkParameters(selectedBridge, selectedTime, selectedMetric)) {
        try {
          setLoading(true);
          const filterResult = await get<ResponseData>("data_process/filter", {
            bridge: selectedBridge,
            time: selectedTime,
            pointName: selectedMetric,
            modelName: filterModelType,
          });

          setFilterChartData(filterResult.data);
        } catch {
          console.log("error");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [filterModelType]);

  // anomaly detection
  useEffect(() => {
    const fetchData = async () => {
      if (checkParameters(selectedBridge, selectedTime, selectedMetric)) {
        try {
          setLoading(true);
          const detectionResult = await get<{
            result: DetectionResponse;
            status: string;
          }>("data_process/anomaly_detection", {
            bridge: selectedBridge,
            time: selectedTime,
            pointName: selectedMetric,
            modelName: anomalyDetectionModelName,
            modelType: anomalyDetectionType,
          });
          setAnomalyDetection(detectionResult.result);
        } catch {
          console.log("error");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [anomalyDetectionModelName, anomalyDetectionType]);

  // anomaly filling
  useEffect(() => {
    const fetchData = async () => {
      if (checkParameters(selectedBridge, selectedTime, selectedMetric)) {
        try {
          setLoading(true);
          const fillingResult = await get<ResponseData>(
            "data_process/anomaly_filling",
            {
              bridge: selectedBridge,
              time: selectedTime,
              pointName: selectedMetric,
              modelName: anomalyFillingModelName,
              modelType: anomalyFillingType,
            }
          );
          setAnomalyFilling(fillingResult.data);
        } catch {
          console.log("error");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [anomalyFillingModelName, anomalyFillingType]);

  // missing value filling
  useEffect(() => {
    const fetchData = async () => {
      if (checkParameters(selectedBridge, selectedTime, selectedMetric)) {
        try {
          setLoading(true);
          const fillingResult = await get<ResponseData>(
            "data_process/missing_filling",
            {
              bridge: selectedBridge,
              time: selectedTime,
              pointName: selectedMetric,
              modelName: missingFillingModelName,
              modelType: missingFillingType,
            }
          );

          setMissingFilling(fillingResult.data);
        } catch {
          console.log("error");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [missingFillingModelName, missingFillingType]);

  const modelNameOptions = ["模型1", "模型2", "模型3"];

  return (
    <div className="flex flex-col h-screen ">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white">Loading...</div>
        </div>
      )}
      <div className="p-2 border-b">
        <div className="flex items-center space-x-4">
          <Select
            value={selectedBridge}
            onValueChange={(value) => setSelectedBridge(value)}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择桥梁" />
            </SelectTrigger>
            <SelectContent>
              {bridgeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DateTimePicker
            time_list={timeOptions}
            timeChange={setSelectedTime}
          />

          <Select
            value={selectedMetric}
            onValueChange={(value) => setSelectedMetric(value)}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择指标" />
            </SelectTrigger>
            <SelectContent>
              {metricOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              handleQuery();
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "查询"}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            重置选择
          </Button>
        </div>
      </div>
      <div className="h-full grid grid-cols-2">
        <div className="grid grid-rows-3 gap-4 p-2 w-full">
          <ChartWithTable
            original_data={originChartData}
            table_data={cleanResult}
            title="数据清洗"
            onModelNameChange={setCleanModelType}
            selectOptions={modelNameOptions}
          ></ChartWithTable>
          <BigLineChart
            original_data={originChartData}
            handled_data={cutChartData}
            title="数据窗口"
            onModelNameChange={setCutModelType}
            selectOptions={modelNameOptions}
          ></BigLineChart>
          <BigLineChart
            original_data={originChartData}
            handled_data={filterChartData}
            title="数据平滑"
            onModelNameChange={setFilterModelType}
            selectOptions={modelNameOptions}
          ></BigLineChart>
        </div>
        <div className="grid grid-rows-3 gap-4 p-2 w-full">
          <BigLineChart
            original_data={originChartData}
            handled_data={originChartData}
            title="异常值检测"
            onModelNameChange={setAnomalyDetectionModelName}
            onModelTypeChange={setAnomalyDetectionType}
            selectOptions={modelNameOptions}
            anomalyOptions={["四分位间距", "均值和标准差", "Z分数"]}
            detection_index={anomalyDetection?.anomaly_indices}
          ></BigLineChart>
          <BigLineChart
            original_data={originChartData}
            handled_data={anomalyFilling}
            title="异常值填充"
            onModelNameChange={setAnomalyFillingModelName}
            onModelTypeChange={setAnomalyFillingType}
            selectOptions={modelNameOptions}
            anomalyOptions={["四分位间距", "均值和标准差", "Z分数"]}
          ></BigLineChart>
          <BigLineChart
            original_data={originChartData}
            handled_data={missingFilling}
            title="缺失值填充"
            onModelNameChange={setMissingFillingModelName}
            onModelTypeChange={setMissingFillingType}
            selectOptions={modelNameOptions}
            anomalyOptions={["均值填充", "中位数填充", "众数填充"]}
          ></BigLineChart>
        </div>
      </div>
    </div>
  );
};

export default Page;
