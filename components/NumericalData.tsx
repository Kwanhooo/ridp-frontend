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
import { get } from "@/app/uitils/HttpAxios";

type NumericalDataType = {
  Bridge: string;
  Content: {
    time: string;
    value: number;
  }[];
  FileName: string;
  ID: string;
  Time: string;
  Type: string;
}[];

export function NumericalData() {
  const [numericalData, setNumericalData] = useState<NumericalDataType>();

  useEffect(() => {
    // Fetch data from API and update state
    const fetchData = async () => {
      const response = await get<NumericalDataType>("/data");
      console.log(response);

      setNumericalData(
        typeof response === "string" ? JSON.parse(response) : response
      );
    };

    fetchData();
  }, []);

  return (
    <Table>
      <TableCaption>数值数据表</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">ID</TableHead>
          <TableHead >桥梁名称</TableHead>
          <TableHead>时间</TableHead>
          <TableHead>数值</TableHead>
          <TableHead>类型</TableHead>
          <TableHead>文件名</TableHead>
          <TableHead>总时间</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {numericalData?.map((invoice) => (
          <TableRow key={invoice.ID}>
            <TableCell className="font-medium">{invoice.ID}</TableCell>
            <TableCell>{invoice.ID}</TableCell>
            <TableCell>{invoice.Bridge}</TableCell>
            <TableCell>
              {invoice.Content.map((item) => item.time).join(", ")}
            </TableCell>
            <TableCell>
              {invoice.Content.map((item) => item.value).join(", ")}
            </TableCell>
            <TableCell>{invoice.Type}</TableCell>
            <TableCell>{invoice.FileName}</TableCell>
            <TableCell>{invoice.Time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
