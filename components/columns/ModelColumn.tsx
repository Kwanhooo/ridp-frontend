import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../TableHeader";

import { z } from "zod";

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

export const ModelSchema = z.object({
  extension: z.number(),
  modelId: z.number(),
  modelName: z.string(),
  modelType: z.string(),
  pointId: z.string(),
  pointName: z.string(),
  threshold1: z.number(),
  threshold2: z.number(),
  threshold3: z.number(),
  threshold4: z.number(),
  window_size: z.number(),
});

export type Model = z.infer<typeof ModelSchema>;

export const columns: ColumnDef<Model>[] = [
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
    accessorKey: "extension",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Extension" />
    ),
    cell: ({ row }) => (
      <div className="w-[50px]">{row.getValue("extension")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "modelId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model ID" />
    ),
    cell: ({ row }) => {
      return <div className="w-[50px]">{row.getValue("extension")}</div>;
    },
  },
  {
    accessorKey: "modelName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("modelName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "modelType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model Type" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("modelType")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "pointId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Point ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("pointId")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
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
    accessorKey: "threshold1",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Threshold 1" />
    ),
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.getValue("threshold1")}</div>;
    },
  },
  {
    accessorKey: "threshold2",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Threshold 2" />
    ),
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.getValue("threshold2")}</div>;
    },
  },
  {
    accessorKey: "threshold3",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Threshold 3" />
    ),
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.getValue("threshold3")}</div>;
    },
  },
  {
    accessorKey: "threshold4",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Threshold 4" />
    ),
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.getValue("threshold4")}</div>;
    },
  },
  {
    accessorKey: "window_size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Window Size" />
    ),
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.getValue("window_size")}</div>;
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
