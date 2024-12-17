"use client";

import { get } from "@/app/utils/HttpAxios";
// import ChartSetting from "@/components/ChartSetting";
import { useEffect, useState } from "react";
import { MyTable } from "@/components/MyTable";
import {
  TimeStamp,
  columns,
  TimeStampSchema,
} from "@/components/columns/TimeStampColumn";
import { z } from "zod";
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
import { toast } from "@/hooks/use-toast";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBridge, setSelectedBridge] = useState<string>("");
  const [bridgeOptions, setBridgeOptions] = useState<string[]>([]);

  const [selectedPassTime, setSelectedPassTime] = useState<string>("");
  const [passTimeOptions, setPassTimeOptions] = useState<string[]>([]);

  const [selectedPassEndTime, setSelectedPassEndTime] = useState<string>("");
  const [passEndTimeOptions, setPassEndTimeOptions] = useState<string[]>([]);

  const [selectedPointName, setSelectedPointName] = useState<string>("");
  const [pointNameOptions, setPointNameOptions] = useState<string[]>([]);

  const [data, setData] = useState<TimeStamp[]>([]);

  const [, setPage] = useState<number>(1);
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
      if (checkParameters(selectedBridge)) {
        try {
          setLoading(true);
          const point_name_options = await get<string[]>("pointName", {
            bridge: selectedBridge,
          });

          setPointNameOptions(point_name_options);
          const pass_time_option = await get<string[]>("times", {
            bridge: selectedBridge,
          });
          setPassTimeOptions(pass_time_option);
          setPassEndTimeOptions(pass_time_option);
        } catch (error) {
          console.error("Error fetching time options:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetch_point_name_options();
    setSelectedPassTime("");
    setSelectedPassEndTime("");
    setSelectedPointName("");
  }, [selectedBridge]);

  const handleQuery = async () => {
    try {
      setLoading(true);
      const time_stamp = await get<{ count: number; data: TimeStamp[] }>(
        "tsData_manage",
        {
          page: 1,
          pageSize: pageSize,
          bridgeName: selectedBridge,
          passTime: selectedPassTime,
          passEndTime: selectedPassEndTime,
          pointName: selectedPointName,
        }
      );
      setPage(1);
      setTrigger(!trigger);
      setData(z.array(TimeStampSchema).parse(time_stamp.data));
      setTotalPages(Math.ceil(time_stamp.count / pageSize));
    } catch (error) {
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
    setSelectedPassTime("");
    setSelectedPassEndTime("");
    setSelectedPointName("");
  };

  const getAllData = async () => {
    try {
      setLoading(true);
      const time_stamp = await get<{ count: number; data: TimeStamp[] }>(
        "tsData_manage",
        {
          page: 1,
          pageSize: pageSize,
          bridgeName: "",
          passTime: "",
          passEndTime: "",
          pointName: "",
        }
      );
      setData(z.array(TimeStampSchema).parse(time_stamp.data));
      setTotalPages(Math.ceil(time_stamp.count / pageSize));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
    console.log(newPage, newPageSize, selectedBridge);
    try {
      setLoading(true);
      const time_stamp = await get<{ count: number; data: TimeStamp[] }>(
        "tsData_manage",
        {
          page: newPage,
          pageSize: newPageSize,
          bridgeName: selectedBridge,
          passTime: selectedPassTime,
          passEndTime: selectedPassEndTime,
          pointName: selectedPointName,
        }
      );

      setData(z.array(TimeStampSchema).parse(time_stamp.data));
      setTotalPages(Math.ceil(time_stamp.count / pageSize));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
          <Button onClick={handleReset} disabled={loading}>
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
