import { get } from "@/app/uitils/HttpAxios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

type ModelDataType = {
  ModelID: string;
  ModelName: string;
  ModelType: string;
  Type: string;
  extension: string;
  threshold1: number;
  threshold2: number;
  threshold3: number;
  threshold4: number;
  window_size: string;
}[];

export function ModelData() {
  const [modelData, setModelData] = useState<ModelDataType>();

  useEffect(() => {
    // Fetch data from API and update state
    const fetchData = async () => {
      const response = await get<ModelDataType>("/data");
      console.log(response);

      setModelData(
        typeof response === "string" ? JSON.parse(response) : response
      );
    };

    fetchData();
  }, []);
  return (
    <Table>
      <TableCaption>模型数据表</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">ModelID</TableHead>
          <TableHead>模型名称</TableHead>
          <TableHead>模型类型</TableHead>
          <TableHead>指标类型</TableHead>
          <TableHead>拓展</TableHead>
          <TableHead>阈值1</TableHead>
          <TableHead>阈值2</TableHead>
          <TableHead>阈值3</TableHead>
          <TableHead>阈值4</TableHead>
          <TableHead>窗口大小</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {modelData?.map((invoice) => (
          <TableRow key={invoice.ModelID}>
            <TableCell className="font-medium">{invoice.ModelID}</TableCell>
            <TableCell>{invoice.ModelName}</TableCell>
            <TableCell>{invoice.ModelType}</TableCell>
            <TableCell>{invoice.Type}</TableCell>
            <TableCell>{invoice.extension}</TableCell>
            <TableCell>{invoice.threshold1}</TableCell>
            <TableCell>{invoice.threshold2}</TableCell>
            <TableCell>{invoice.threshold3}</TableCell>
            <TableCell>{invoice.threshold4}</TableCell>
            <TableCell>{invoice.window_size}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
