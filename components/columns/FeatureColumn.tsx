import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

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
import { formatTime } from "@/app/utils/util";

export const FeatureSchema = z.object({
  bridge_name: z.string(),
  metrics: z.string().optional(),
  pass_end_time: z.string(),
  pass_time: z.string(),
  tsPicURL: z.string().optional().nullable(),
});

export type Feature = z.infer<typeof FeatureSchema>;

export const columns: ColumnDef<Feature>[] = [
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
    accessorKey: "bridge_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bridge Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">{row.getValue("bridge_name")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "metrics",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Metrics" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const metricsVal = row.getValue("metrics");
      return (
        <div className="max-w-[1000px] truncate font-medium">
          {metricsVal ? (
            <div>{String(metricsVal)}</div>
          ) : (
            typeof model.tsPicURL !== "undefined" &&
            model.tsPicURL !== null &&
            (model.tsPicURL.trim() === "" ? (
              <div>无图片数据</div>
            ) : (
              <Image
                src={model.tsPicURL}
                alt="外部图片"
                width={100}
                height={56}
                className="object-contain"
              />
            ))
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
