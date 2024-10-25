import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
  } from "@tanstack/react-table";
  import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
  
  import { Button } from "@/components/ui/button";
  import { Checkbox } from "@/components/ui/checkbox";
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Input } from "@/components/ui/input";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { useEffect, useState } from "react";
  import { get } from "@/app/uitils/HttpAxios";
  
  export type ModelDataType = {
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
  };
  
  export const columns: ColumnDef<ModelDataType>[] = [
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
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "ModelID",
      header: "ModelID",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("ModelID")}</div>
      ),
    },
    {
      accessorKey: "ModelName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ModelName
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("ModelName")}</div>,
    },
    {
      accessorKey: "ModelType",
      header: () => <div className="text-right">ModelType</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue("ModelType")}
          </div>
        );
      },
    },
    {
      accessorKey: "Type",
      header: () => <div className="text-right">Type</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">{row.getValue("Type")}</div>
        );
      },
    },
    {
      accessorKey: "extension",
      header: () => <div className="text-right">extension</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue("extension")}
          </div>
        );
      },
    },
    {
      accessorKey: "threshold1",
      header: () => <div className="text-right">threshold1</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue("threshold1")}
          </div>
        );
      },
    },
    {
      accessorKey: "threshold2",
      header: () => <div className="text-right">threshold2</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue("threshold2")}
          </div>
        );
      },
    },
    {
      accessorKey: "threshold3",
      header: () => <div className="text-right">threshold3</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue("threshold3")}
          </div>
        );
      },
    },
    {
      accessorKey: "threshold4",
      header: () => <div className="text-right">threshold4</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue("threshold4")}
          </div>
        );
      },
    },
    {
      accessorKey: "window_size",
      header: () => <div className="text-right">window_size</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue("window_size")}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
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
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(model.ModelID)}
              >
                Copy Model ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  
  export function ModelData() {
    const [modelData, setModelData] = useState<ModelDataType[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
  
    useEffect(() => {
      // Fetch data from API and update state
      const fetchData = async () => {
        const response = await get<ModelDataType[]>("/model_manage");
        console.log(response);
  
        setModelData(
          typeof response === "string" ? JSON.parse(response) : response
        );
      };
  
      fetchData();
    }, []);
  
    const table = useReactTable({
      data: modelData,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
    });
  
    return (
      <div className="w-full h-screen">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter model type..."
            value={
              (table.getColumn("ModelType")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("ModelType")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }
  