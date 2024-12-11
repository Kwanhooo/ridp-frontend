import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../TableHeader";

import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { formatTime } from "@/app/utils/util";

export const TextSchema = z.object({
  bridgeName: z.string(),
  clean_result: z
    .object({
      y值偏移: z.string(),
      偏移量: z.number(),
      初始段: z.string(),
      峰值抖动: z.string(),
      峰值检测: z.string(),
      最终段: z.string(),
      检测结果: z.boolean(),
    })
    .nullable(),
  pass_time: z.string(),
  pass_end_time: z.string(),
  pointName: z.string(),
});

export type Text = z.infer<typeof TextSchema>;

export const columns: ColumnDef<Text>[] = [
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
    accessorKey: "bridgeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bridge Name" />
    ),
    cell: ({ row }) => {
      console.log(row.getValue("bridgeName"));
      return (
        <div className="max-w-[500px] truncate font-medium">
          {row.getValue("bridgeName")}
        </div>
      );
    },
  },
  {
    accessorKey: "clean_result",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="y值偏移" />
    ),
    cell: ({ row }) => {
      // 获取 clean_result 对象
      const cleanResult = row.getValue("clean_result") as Text["clean_result"];

      return (
        <div className="max-w-[500px] truncate font-medium">
          {cleanResult ? (
            cleanResult.y值偏移
          ) : (
            <Badge variant="outline">NULL</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "clean_result",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="偏移量" />
    ),
    cell: ({ row }) => {
      const cleanResult = row.getValue("clean_result") as Text["clean_result"];

      return (
        <div className="max-w-[500px] truncate font-medium">
          {cleanResult ? (
            cleanResult.偏移量
          ) : (
            <Badge variant="outline">NULL</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "clean_result",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="初始段" />
    ),
    cell: ({ row }) => {
      const cleanResult = row.getValue("clean_result") as Text["clean_result"];

      return (
        <div className="max-w-[500px] truncate font-medium">
          {cleanResult ? (
            cleanResult.初始段
          ) : (
            <Badge variant="outline">NULL</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "clean_result",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="峰值抖动" />
    ),
    cell: ({ row }) => {
      const cleanResult = row.getValue("clean_result") as Text["clean_result"];

      return (
        <div className="max-w-[500px] truncate font-medium">
          {cleanResult ? (
            cleanResult.峰值抖动
          ) : (
            <Badge variant="outline">NULL</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "clean_result",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="峰值检测" />
    ),
    cell: ({ row }) => {
      const cleanResult = row.getValue("clean_result") as Text["clean_result"];

      return (
        <div className="max-w-[500px] truncate font-medium">
          {cleanResult ? (
            cleanResult.峰值检测
          ) : (
            <Badge variant="outline">NULL</Badge>
          )}
        </div>
      );
    },
  },
  // 最终段
  {
    accessorKey: "clean_result",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="最终段" />
    ),
    cell: ({ row }) => {
      const cleanResult = row.getValue("clean_result") as Text["clean_result"];

      return (
        <div className="max-w-[500px] truncate font-medium">
          {cleanResult ? (
            cleanResult.最终段
          ) : (
            <Badge variant="outline">NULL</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "clean_result",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="检测结果" />
    ),
    cell: ({ row }) => {
      const cleanResult = row.getValue("clean_result") as Text["clean_result"];
      return (
        <div className="w-[80px]">
          {cleanResult ? (
            <Badge variant="outline">
              {cleanResult.检测结果 ? "正常" : "异常"}
            </Badge>
          ) : (
            <Badge variant="outline">NULL</Badge>
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
            {formatTime(row.getValue("pass_time"))}
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
            {formatTime(row.getValue("pass_end_time"))}
          </span>
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
    id: "actions",
    cell: ({ row }) => {
      const model = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(model))
              }
            >
              Copy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
