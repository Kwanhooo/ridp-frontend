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
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";

export const TextSchema = z.object({
  bridgeId: z.string(),
  bridgeName: z.string(),
  clean_result: z.object({
    y值偏移: z.string(),
    偏移量: z.number(),
    初始段: z.string(),
    峰值抖动: z.string(),
    峰值检测: z.string(),
    最终段: z.string(),
    检测结果: z.boolean(),
  }),
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
    accessorKey: "y_value_shift",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="y值偏移" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[80px]">{row.getValue("clean_result.y值偏移")}</div>
      );
    },
  },
  {
    accessorKey: "shift",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="偏移量" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[120px]">{row.getValue("clean_result.偏移量")}</div>
      );
    },
  },
  {
    accessorKey: "init",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="初始段" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[80px]">{row.getValue("clean_result.初始段")}</div>
      );
    },
  },
  {
    accessorKey: "peak_shake",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="峰值抖动" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[80px]">{row.getValue("clean_result.峰值抖动")}</div>
      );
    },
  },
  {
    accessorKey: "peak_detection",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="峰值检测" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[80px]">{row.getValue("clean_result.峰值检测")}</div>
      );
    },
  },
  // 最终段
  {
    accessorKey: "final",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="最终段" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[80px]">{row.getValue("clean_result.最终段")}</div>
      );
    },
  },
  {
    accessorKey: "result",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="检测结果" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-[80px]">
          <Badge variant="outline">
            {row.getValue("clean_result.检测结果")}
          </Badge>
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
