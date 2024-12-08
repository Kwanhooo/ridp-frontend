import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";

const timestampdemo = {
  bridgeId: "6684",
  bridgeName: "某城际铁路简支梁桥与路桥过渡段",
  clean_result: null,
  dataProcessedURL: null,
  id: "10008",
  log: null,
  pass_end_time: "Wed, 06 Nov 2024 19:07:57 GMT",
  pass_time: "Wed, 06 Nov 2024 19:07:42 GMT",
  pointCode: "GDBLDWY02",
  pointId: "27068",
  pointName: "过渡段轨道板两端垂向位移2",
  tsPicURL: null,
};

export const TimeStampSchema = z.object({
  bridgeId: z.string(),
  bridgeName: z.string(),
  clean_result: z.string().nullish(),
  dataProcessedURL: z.string().nullish(),
  id: z.string(),
  log: z.string().nullish(),
  pass_end_time: z.string(),
  pass_time: z.string(),
  pointCode: z.string(),
  pointId: z.string(),
  pointName: z.string(),
  tsPicURL: z.string().nullish(),
});

export type TimeStamp = z.infer<typeof TimeStampSchema>;

export const columns: ColumnDef<TimeStamp>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "bridgeId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bridge ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("bridgeId")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "BridgeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("BridgeName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "clean_result",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Clean Result" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {row.getValue("clean_result") ? (
            <Badge variant="outline">NULL</Badge>
          ) : (
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("clean_result")}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dataProcessedURL",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Processed URL" />
    ),
    cell: ({ row }) => {
      // const value = row.getValue("dataProcessedURL")
      return (
        <div className="flex space-x-2">
          {row.getValue("dataProcessedURL") ? (
            <Badge variant="outline">NULL</Badge>
          ) : (
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("dataProcessedURL")}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "log",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Log" />
    ),
    cell: ({ row }) => {
      // const value = row.getValue("dataProcessedURL")
      return (
        <div className="flex space-x-2">
          {row.getValue("log") ? (
            <Badge variant="outline">NULL</Badge>
          ) : (
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("log")}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "pass_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pass Time" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("pass_time")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "pass_end_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pass End Time" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("pass_end_time")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "pointCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Point Code" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="w-[100px]">{row.getValue("pointCode")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "pointId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Point ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="w-[80px]">{row.getValue("pointId")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "pointName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Point Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("pointName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "tsPicURL",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Log" />
    ),
    cell: ({ row }) => {
      const url = row.getValue("tsPicURL");
      // todo 可能需要判断url
      return url ? (
        <Badge variant="outline">NULL</Badge>
      ) : (
        <div className="w-[100px]">
          <AspectRatio ratio={16 / 9}>
            <Image src="..." alt="Image" className="rounded-md object-cover" />
          </AspectRatio>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
