"use client";

import { get } from "@/app/utils/HttpAxios";
import ChartSetting from "@/components/ChartSetting";
import { useEffect, useState } from "react";
import { MyTable } from "@/components/MyTable";
import { Model, columns, ModelSchema } from "@/components/columns/ModelColumn";
import { z } from "zod";

const Page = () => {
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

  // Fetch bridge name first
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

  // Fetch point name options when selectedBridge changes
  useEffect(() => {
    const fetch_point_name_options = async () => {
      try {
        const point_name_options = await get<string[]>("pointName", {
          bridge: selectedBridge,
        });
        setSelectedPointName(point_name_options[0]);
        setPointNameOptions(point_name_options);
      } catch (error) {
        console.error("Error fetching time options:", error);
      }
    };
    fetch_point_name_options();
  }, [selectedBridge]);

  // get model data
  useEffect(() => {
    const fetchData = async () => {
      if (selectedPointName && selectedPointName !== "") {
        try {
          const model_data = await get<Model[]>("model_manage", {
            page: page,
            pageSize: pageSize,
            modelType: selectedModelType,
            modelName: selectedModelName,
            pointName: selectedPointName,
          });

          setData(z.array(ModelSchema).parse(model_data));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [page, pageSize, selectedModelType, selectedModelName, selectedPointName]);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
    console.log(`Page: ${newPage}, PageSize: ${newPageSize}`);
    
  };

  const selects = [
    {
      label: "桥梁",
      options: bridgeOptions,
      defaultValue: selectedBridge,
      onChange: setSelectedBridge,
    },
    {
      label: "模型类型",
      options: modelTypeOptions,
      defaultValue: selectedModelType,
      onChange: setSelectedModelType,
    },
    {
      label: "模型名称",
      options: modelNameOptions,
      defaultValue: selectedModelName,
      onChange: setSelectedModelName,
    },
    {
      label: "Point Name",
      options: PointNameOptions,
      defaultValue: selectedPointName,
      onChange: setSelectedPointName,
    },
  ];
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="h-1/8 p-2 border-b border-gray-700">
        <ChartSetting selects={selects} />
      </div>
      <div className="h-7/8 p-2">
        <MyTable
          data={data}
          columns={columns}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Page;
