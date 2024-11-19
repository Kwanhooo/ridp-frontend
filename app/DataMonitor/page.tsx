"use client"
import * as React from "react";
import 'react-toastify/dist/ReactToastify.css'; // 引入样式
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"; // 选择器组件库
import {Button} from "@/components/ui/button"; // 按钮组件
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {Checkbox} from "@/components/ui/checkbox"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {get} from "@/app/uitils/HttpAxios";
import {showErrorToast} from "@/app/uitils/toast";
import DemoLineChart from "@/components/DemoLineChart";

type DataColumn = {
    id: string
    bridge: string
    section: string
    startTime: string
    endTime: string
    speed: string
    image: string | null
}
type TypeListResponse = string[];
type BridgeListResponse = string[];

const fetchData = async <T, >(url: string, params?: object): Promise<T> => {
    try {
        return await get<T>(url, params);
    } catch (error) {
        showErrorToast(url + " 获取失败，请稍后再试", error);
        throw error;
    }
};

const data: DataColumn[] = [
    {
        id: "1",
        bridge: "某城际铁路高架桥与路桥过渡段",
        section: "过渡段",
        startTime: "2024-11-08 15:22:49",
        endTime: "2024-11-08 15:23:04",
        speed: "82 km/h",
        image: "http://119.36.93.106:30900/monitorapi/TrainPassingService/getTrainPassingFile?path=/Img/20241108/AK0868423/1/181691_AK0868423_1_20241108151151.jpg",
    },
    {
        id: "2",
        bridge: "某城际铁路高架桥与路桥过渡段",
        section: "简支梁段",
        startTime: "2024-11-08 15:22:43",
        endTime: "2024-11-08 15:22:58",
        speed: "82 km/h",
        image: "http://119.36.93.106:30900/monitorapi/TrainPassingService/getTrainPassingFile?path=/Img/20241108/AK0868423/1/181691_AK0868423_1_20241108151151.jpg",
    },
    {
        id: "3",
        bridge: "某高铁简支梁桥",
        section: "简支梁段",
        startTime: "2024-11-08 15:19:53",
        endTime: "2024-11-08 15:20:23",
        speed: "308 km/h",
        image: "http://119.36.93.106:30900/monitorapi/TrainPassingService/getTrainPassingFile?path=/Img/20241108/AK0868423/1/181691_AK0868423_1_20241108151151.jpg",
    },
    {
        id: "4",
        bridge: "某高铁桥工点",
        section: "路基段",
        startTime: "2024-11-08 15:19:15",
        endTime: "2024-11-08 15:19:45",
        speed: "308 km/h",
        image: "http://119.36.93.106:30900/monitorapi/TrainPassingService/getTrainPassingFile?path=/Img/20241108/AK0868423/1/181691_AK0868423_1_20241108151151.jpg",
    },
    {
        id: "5",
        bridge: "某高铁简支梁桥",
        section: "简支梁段",
        startTime: "2024-11-08 15:15:31",
        endTime: "2024-11-08 15:16:01",
        speed: "308 km/h",
        image: "http://119.36.93.106:30900/monitorapi/TrainPassingService/getTrainPassingFile?path=/Img/20241108/AK0868423/1/181691_AK0868423_1_20241108151151.jpg",
    },
    {
        id: "6",
        bridge: "某高铁桥工点",
        section: "路基段",
        startTime: "2024-11-08 15:14:53",
        endTime: "2024-11-08 15:15:23",
        speed: "308 km/h",
        image: "http://119.36.93.106:30900/monitorapi/TrainPassingService/getTrainPassingFile?path=/Img/20241108/AK0868423/1/181691_AK0868423_1_20241108151151.jpg",
    },
    {
        id: "7",
        bridge: "某高铁简支梁桥",
        section: "简支梁段",
        startTime: "2024-11-08 15:11:51",
        endTime: "2024-11-08 15:12:21",
        speed: "308 km/h",
        image: "http://119.36.93.106:30900/monitorapi/TrainPassingService/getTrainPassingFile?path=/Img/20241108/AK0868423/1/181691_AK0868423_1_20241108151151.jpg",
    }
];

const DataMonitor = () => {
    // 表格
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [selectedDetailRow, setSelectedDetailRow] = React.useState<DataColumn | undefined>(undefined);
    const [rowSelection, setRowSelection] = React.useState({})

    // 选择器的可选项
    const [typeOptions, setTypeOptions] = React.useState<string[]>([]);
    const [bridgeOptions, setBridgeOptions] = React.useState<string[]>([])

    // 选择器的选择值
    const [selectedBridge, setSelectedBridge] = React.useState<string>('');
    const [selectedStartTime, setSelectedStartTime] = React.useState<string>('');
    const [selectedEndTime, setSelectedEndTime] = React.useState<string>('');

    function handleRowClicked(row: Row<DataColumn>) {
        const rowData = row.original
        setSelectedDetailRow(rowData)
        console.log(selectedDetailRow)
    }

    const columns: ColumnDef<DataColumn>[] = [
        {
            id: "select",
            header: ({table}) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({row}) => (
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
            accessorKey: "bridge",
            header: "桥梁",
            cell: ({row}) => <div>{row.getValue("bridge")}</div>,
        },
        {
            accessorKey: "section",
            header: "截面",
            cell: ({row}) => <div>{row.getValue("section")}</div>,
        },
        {
            accessorKey: "startTime",
            header: "开始时间",
            cell: ({row}) => <div>{row.getValue("startTime")}</div>,
        },
        {
            accessorKey: "endTime",
            header: "结束时间",
            cell: ({row}) => <div>{row.getValue("endTime")}</div>,
        },
        {
            accessorKey: "speed",
            header: "车速",
            cell: ({row}) => <div>{row.getValue("speed")}</div>,
        },
        {
            accessorKey: "operation",
            header: "操作",
            cell: ({row}) => {
                return (
                    <div className="cursor-pointer text-blue-500">
                        <a onClick={() => handleRowClicked(row)}>查看详情</a>
                    </div>
                );
            }
        },
        {
            accessorKey: "image",
            header: "过车图片",
            cell: ({row}) => {
                const imageUrl = row.getValue("image");
                return imageUrl && typeof imageUrl === 'string' ? (
                    <img src={imageUrl} alt="过车图片" style={{width: '75px', height: 'auto'}}/>
                ) : (
                    <div>暂无可用图像</div>
                )
            },
        },
    ];

    React.useEffect(() => {
        const fetchBridges = async () => {
            try {
                const bridges = await fetchData<BridgeListResponse>('/bridges', {});
                setBridgeOptions(bridges)  // 设置桥梁选项
            } catch (error) {
                console.error("加载桥梁数据失败", error)
            }
        }
        fetchBridges()
    }, [])

    React.useEffect(() => {
        const loadOptions = async () => {
            try {
                const types = await fetchData<TypeListResponse>('/pointName', {});
                setTypeOptions(types);
            } catch (error) {
                console.error("加载类型失败", error);
            }
        };
        loadOptions();

    }, []);

    const table = useReactTable({
        data,
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
    })

    const handleSearchClicked = () => {
        console.log(selectedBridge, selectedStartTime, selectedEndTime)
    }

    return (
        <div className="h-full w-full flex flex-row">
            {/* 左侧部分 */}
            <div className="h-full w-1/2 flex flex-col p-4 overflow-auto">
                {/* 条件查询选择器部分 */}
                <div className="flex flex-row items-center space-x-4 mb-4">
                    {/* 桥梁选择器 */}
                    <Select onValueChange={setSelectedBridge}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="请选择"/>
                        </SelectTrigger>
                        <SelectContent>
                            {bridgeOptions.map((bridge, index) => (
                                <SelectItem key={index} value={bridge}>
                                    {bridge}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* 开始时间选择器 */}
                    <input type="datetime-local" className="border border-gray-300 rounded px-2 py-1 w-[180px]"
                           placeholder="开始时间" onChange={(e) => setSelectedStartTime(e.target.value)}/>

                    {/* 结束时间选择器 */}
                    <input type="datetime-local" className="border border-gray-300 rounded px-2 py-1 w-[180px]"
                           placeholder="结束时间" onChange={(e) => setSelectedEndTime(e.target.value)}/>

                    {/* 搜索按钮 */}
                    <Button onClick={handleSearchClicked}>搜索</Button>

                    {/* 实时数据按钮 */}
                    <Button>实时数据</Button>
                </div>

                {/* 表格部分 */}
                <div className="grow">
                    <div className="w-full">
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
                                                )
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
                                                暂无数据
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                                已选择{table.getFilteredSelectedRowModel().rows.length}行
                                共{table.getFilteredRowModel().rows.length}行
                            </div>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    上一页
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    下一页
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 视频 */}
                <div className="w-full h-fit flex justify-center mt-4">
                    <video className="w-auto h-[400px]" src="/video.mp4" autoPlay={true} controls={true}/>
                </div>
            </div>

            {/* 右侧部分 */}
            <div className="dm-panel h-full w-1/2 p-4 flex flex-col space-y-4">
                {/* 一行两个 */}
                <div className="grid grid-cols-2 gap-4">
                    {typeOptions.map((type, index) => (
                        <div key={index} className="w-full">
                            <div className="text-base font-semibold">{type}</div>
                            <div className="w-full h-[150px]">
                                <DemoLineChart bridge="武广高铁淦河连续梁桥" time="2024-4-10 06:19:38:39884"
                                               type={type}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DataMonitor;
