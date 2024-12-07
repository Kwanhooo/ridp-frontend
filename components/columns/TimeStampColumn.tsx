import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../TableHeader";

import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";
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
      <div className="w-[100px]">{row.getValue("bridgeId")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "bridgeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("bridgeName")}
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
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("clean_result")}
            </span>
          ) : (
            <Badge variant="outline">NULL</Badge>
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
      <DataTableColumnHeader column={column} title="Picture" />
    ),
    cell: ({ row }) => {
      const url = row.getValue("tsPicURL") as string | null | undefined;

      if (!url) {
        return <Badge variant="outline">NULL</Badge>;
      }

      return (
        <div className="w-[100px]">
          <AspectRatio ratio={16 / 9}>
            <Image src={url} alt="Image" width={100} height={56} />
          </AspectRatio>
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
