"use client";

import { get } from "@/app/utils/HttpAxios";
import ChartSetting from "@/components/ChartSetting";
import { useEffect, useState } from "react";
import { MyTable } from "@/components/MyTable";
import {
  TextSchema,
  columns,
  Text,
} from "@/components/columns/TextColumn";
import { z } from "zod";
import { formatTime } from "@/app/utils/util";

const Page = () => {
  const [selectedBridge, setSelectedBridge] = useState<string>("");
  const [bridgeOptions, setBridgeOptions] = useState<string[]>([]);

  const [selectedPassTime, setSelectedPassTime] = useState<string>("");
  const [passTimeOptions, setPassTimeOptions] = useState<string[]>([]);

  const [selectedPassEndTime, setSelectedPassEndTime] = useState<string>("");
  const [passEndTimeOptions, setPassEndTimeOptions] = useState<string[]>([]);

  const [selectedPointName, setSelectedPointName] = useState<string>("");
  const [pointNameOptions, setPointNameOptions] = useState<string[]>([]);

  const [data, setData] = useState<Text[]>([]);

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

  // Fetch point name and pass [end] time options when selectedBridge changes
  useEffect(() => {
    const fetch_point_name_options = async () => {
      try {
        const point_name_options = await get<string[]>("pointName", {
          bridge: selectedBridge,
        });
        setSelectedPointName(point_name_options[0]);
        setPointNameOptions(point_name_options);

        const pass_time_option = await get<string[]>("times", {
          bridge: selectedBridge,
        });
        setSelectedPassTime(pass_time_option[0]);
        setPassTimeOptions(pass_time_option);

        setSelectedPassEndTime(
          pass_time_option.length > 1
            ? pass_time_option[1]
            : pass_time_option[0]
        );
        setPassEndTimeOptions(pass_time_option);
      } catch (error) {
        console.error("Error fetching time options:", error);
      }
    };
    fetch_point_name_options();
  }, [selectedBridge]);

  // get ts data
  useEffect(() => {
    const fetchData = async () => {
      if (selectedBridge && selectedPointName && selectedPassTime) {
        try {
          const text = await get<Text[]>("text_manage", {
            page: page,
            pageSize: pageSize,
            bridgeName: selectedBridge,
            passTime: formatTime(selectedPassTime),
            passEndTime: formatTime(selectedPassEndTime),
            pointName: selectedPointName,
          });

          setData(z.array(TextSchema).parse(text));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [
    selectedBridge,
    selectedPassTime,
    selectedPointName,
    page,
    pageSize,
    selectedPassEndTime,
  ]);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const selects = [
    {
      label: "桥梁",
      options: bridgeOptions,
      defaultValue: selectedBridge,
      onChange: setSelectedBridge,
    },
    {
      label: "Pass Time",
      options: passTimeOptions,
      defaultValue: selectedPassTime,
      onChange: setSelectedPassTime,
    },
    {
      label: "Pass End Time",
      options: passEndTimeOptions,
      defaultValue: selectedPassEndTime,
      onChange: setSelectedPassEndTime,
    },
    {
      label: "Point Name",
      options: pointNameOptions,
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
