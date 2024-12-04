import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "../TableHeader";

import { z } from "zod";
import Image from "next/image";

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
import { Badge } from "../ui/badge";
import { AspectRatio } from "../ui/aspect-ratio";

export const MultiMediaSchema = z.object({
  bridge_name: z.string(),
  pass_end_time: z.string(),
  pass_time: z.string(),
  post_pic_url: z.string().nullish(),
});

export type MultiMedia = z.infer<typeof MultiMediaSchema>;

export const columns: ColumnDef<MultiMedia>[] = [
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
    accessorKey: "post_pic_url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => {
      const url = row.getValue("post_pic_url") as string | null | undefined;

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
