"use client";

import { get } from "@/app/utils/HttpAxios";
import { useEffect, useState } from "react";
import { MyTable } from "@/components/MyTable";
import {
  Feature,
  columns,
  FeatureSchema,
} from "@/components/columns/FeatureColumn";
import { z } from "zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { checkParameters } from "@/app/utils/util";
import { toast } from "@/hooks/use-toast";
import { DateTimePicker } from "@/components/DateTimePicker";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBridge, setSelectedBridge] = useState<string>("");
  const [bridgeOptions, setBridgeOptions] = useState<string[]>([]);

  const [selectedFeatureModeType, setSelectedFeatureModeType] =
    useState<string>("矩阵数据");
  const [featureModeTypeOptions] = useState<string[]>([
    "矩阵数据",
    "时序图数据",
    "向量数据",
  ]);

  const [selectedPassTime, setSelectedPassTime] = useState<string>("");
  const [passTimeOptions, setPassTimeOptions] = useState<string[]>([]);

  const [selectedPassEndTime, setSelectedPassEndTime] = useState<string>("");
  const [passEndTimeOptions, setPassEndTimeOptions] = useState<string[]>([]);

  const [selectedPointName, setSelectedPointName] = useState<string>("");
  const [pointNameOptions, setPointNameOptions] = useState<string[]>([]);

  const [data, setData] = useState<Feature[]>([]);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [trigger, setTrigger] = useState(false);

  // Fetch bridge name first
  useEffect(() => {
    const fetch_data = async () => {
      try {
        setLoading(true);
        const [bridge_options] = await Promise.all([
          get<string[]>("bridges"),
          getAllData(),
        ]);
        setBridgeOptions(bridge_options);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch_data();
  }, []);

  // Fetch point name and pass time options when selectedBridge changes
  useEffect(() => {
    const fetch_point_name_options = async () => {
      if (selectedBridge) {
        try {
          setLoading(true);
          const point_name_options = await get<string[]>("pointName", {
            bridge: selectedBridge,
          });
          // setSelectedPointName(point_name_options[0]);
          setPointNameOptions(point_name_options);

          const pass_time_option = await get<string[]>("times", {
            bridge: selectedBridge,
          });
          // setSelectedPassTime(pass_time_option[0]);
          setPassTimeOptions(pass_time_option);

          // setSelectedPassEndTime(
          //   pass_time_option.length > 1
          //     ? pass_time_option[1]
          //     : pass_time_option[0]
          // );
          setPassEndTimeOptions(pass_time_option);
        } catch (error) {
          console.error("Error fetching time options:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetch_point_name_options();
  }, [selectedBridge]);

  const handleQuery = async () => {
    try {
      setLoading(true);
      const feature_data = await get<{ count: number; data: Feature[] }>(
        "feature_manage",
        {
          page: 1,
          pageSize: pageSize,
          bridge_name: selectedBridge,
          featureModeType: selectedFeatureModeType,
          pointName: selectedPointName,
          passTime: selectedPassTime,
          passEndTime: selectedPassEndTime,
        }
      );
      setPage(1);
      setTrigger(!trigger);
      setData(z.array(FeatureSchema).parse(feature_data.data));
      setTotalPages(Math.ceil(feature_data.count / pageSize));
    } catch (error) {
      console.log("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "网络错误",
        description: "请重置参数后重新请求",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setSelectedBridge("");
    setSelectedFeatureModeType("");
    setSelectedPassTime("");
    setSelectedPassEndTime("");
    setSelectedPointName("");
    // setData([]);
  };

  const getAllData = async () => {
    if (checkParameters(selectedFeatureModeType)) {
      try {
        setLoading(true);
        const feature_data = await get<{ count: number; data: Feature[] }>(
          "feature_manage",
          {
            page: page,
            pageSize: pageSize,
            bridge_name: "",
            featureModeType: selectedFeatureModeType,
            pointName: "",
            passTime: "",
            passEndTime: "",
          }
        );

        setData(z.array(FeatureSchema).parse(feature_data.data));
        setTotalPages(Math.ceil(feature_data.count / pageSize));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "条件不完整",
        description: "请选择特征类型",
      });
    }
  };

  const handlePageChange = async (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
    if (checkParameters(selectedFeatureModeType)) {
      try {
        setLoading(true);
        const feature_data = await get<{ count: number; data: Feature[] }>(
          "feature_manage",
          {
            page: newPage,
            pageSize: newPageSize,
            bridge_name: selectedBridge,
            featureModeType: selectedFeatureModeType,
            pointName: selectedPointName,
            passTime: selectedPassTime,
            passEndTime: selectedPassEndTime,
          }
        );

        setData(z.array(FeatureSchema).parse(feature_data.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "条件不完整",
        description: "请选择特征类型",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full">
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

          <Select
            value={selectedFeatureModeType}
            onValueChange={(value) => setSelectedFeatureModeType(value)}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择指标" />
            </SelectTrigger>
            <SelectContent>
              {featureModeTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedPointName}
            onValueChange={(value) => setSelectedPointName(value)}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择指标" />
            </SelectTrigger>
            <SelectContent>
              {pointNameOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DateTimePicker
            time_list={passTimeOptions}
            timeChange={setSelectedPassTime}
          />

          <DateTimePicker
            time_list={passEndTimeOptions}
            timeChange={setSelectedPassEndTime}
          />

          <Button onClick={handleQuery} disabled={loading}>
            {loading ? "Loading..." : "查询"}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            重置选择
          </Button>
        </div>
      </div>
      <div className="h-7/8 p-2">
        <MyTable
          data={data}
          columns={columns}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          trigger={trigger}
        />
      </div>
    </div>
  );
};

export default Page;
