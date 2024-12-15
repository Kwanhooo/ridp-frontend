"use client";

import { get } from "@/app/utils/HttpAxios";
// import ChartSetting from "@/components/ChartSetting";
import { useEffect, useState } from "react";
import { MyTable } from "@/components/MyTable";
import { Model, columns, ModelSchema } from "@/components/columns/ModelColumn";
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

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBridge, setSelectedBridge] = useState<string>("");
  const [bridgeOptions, setBridgeOptions] = useState<string[]>([]);

  const [selectedModelType, setSelectedModelType] =
    useState<string>("清洗模型");
  const [modelTypeOptions] = useState<string[]>([
    "清洗模型",
    "切割模型",
    "平滑模型",
  ]);

  const [selectedModelName, setSelectedModelName] = useState<string>("模型1");
  const [modelNameOptions] = useState<string[]>(["模型1", "模型2", "模型3"]);

  const [selectedPointName, setSelectedPointName] = useState<string>("");
  const [PointNameOptions, setPointNameOptions] = useState<string[]>([]);

  const [data, setData] = useState<Model[]>([]);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch bridge name first
  useEffect(() => {
    const fetch_data = async () => {
      try {
        setLoading(true);
        const bridge_options = await get<string[]>("bridges");
        // setSelectedBridge(bridge_options[0]);
        setBridgeOptions(bridge_options);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch_data();
  }, []);

  // Fetch point name options when selectedBridge changes
  useEffect(() => {
    const fetch_point_name_options = async () => {
      if (checkParameters(selectedBridge)) {
        try {
          setLoading(true);
          const point_name_options = await get<string[]>("pointName", {
            bridge: selectedBridge,
          });
          // setSelectedPointName(point_name_options[0]);
          setPointNameOptions(point_name_options);
        } catch (error) {
          console.error("Error fetching time options:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetch_point_name_options();
  }, [selectedBridge]);

  const handlePageChange = async (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
    try {
      setLoading(true);
      const model_data = await get<{ count: number; data: Model[] }>(
        "model_manage",
        {
          page: newPage,
          pageSize: newPageSize,
          modelType: selectedModelType,
          modelName: selectedModelName,
          pointName: selectedPointName,
        }
      );

      setData(z.array(ModelSchema).parse(model_data.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    if (
      checkParameters(
        selectedBridge,
        selectedModelType,
        selectedModelName,
        selectedPointName
      )
    ) {
      try {
        setLoading(true);
        const model_data = await get<{ count: number; data: Model[] }>(
          "model_manage",
          {
            page: page,
            pageSize: pageSize,
            modelType: selectedModelType,
            modelName: selectedModelName,
            pointName: selectedPointName,
          }
        );

        setData(z.array(ModelSchema).parse(model_data.data));
        setTotalPages(Math.ceil(model_data.count / pageSize));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "条件不完整",
        description: "请选择桥梁、模型、指标",
      });
    }
  };

  const handleReset = async () => {
    setSelectedBridge("");
    setSelectedModelType("");
    setSelectedModelName("");
    setSelectedPointName("");
    // setData([]);
  };

  const getAllData = async () => {
    try {
      setLoading(true);
      const model_data = await get<{ count: number; data: Model[] }>(
        "model_manage",
        {
          page: page,
          pageSize: pageSize,
          modelType: "",
          modelName: "",
          pointName: "",
        }
      );

      setData(z.array(ModelSchema).parse(model_data.data));
      setTotalPages(Math.ceil(model_data.count / pageSize));
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
            value={selectedModelType}
            onValueChange={(value) => setSelectedModelType(value)}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择指标" />
            </SelectTrigger>
            <SelectContent>
              {modelTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedModelName}
            onValueChange={(value) => setSelectedModelName(value)}
            disabled={loading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择指标" />
            </SelectTrigger>
            <SelectContent>
              {modelNameOptions.map((option) => (
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
              {PointNameOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleQuery} disabled={loading}>
            {loading ? "Loading..." : "查询"}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            重置选择
          </Button>
          <Button variant="outline" onClick={getAllData} disabled={loading}>
            全部数据
          </Button>
        </div>
      </div>
      <div className="h-7/8 p-2">
        <MyTable
          data={data}
          columns={columns}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default Page;
