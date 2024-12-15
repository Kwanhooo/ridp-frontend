"use client"
import * as React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
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
import {get} from "@/app/utils/HttpAxios"
import {showErrorToast} from "@/app/utils/toast";
import DemoLineChart from "@/components/DemoLineChart";
import {setSidebarState} from "@/store/modules/sidebarSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "lucide-react";

/**
 * 一些类型定义
 */
type DataColumn = {
    anays_data: any | null; // 可能为 null 或任意类型
    bridge_full_name: string | null; // 可能为 null 或字符串
    bridge_id: number; // 数字类型
    bridge_name: string; // 字符串类型
    created_at: string; // 字符串类型，存储日期时间
    created_by: string; // 字符串类型
    device_sn: string; // 字符串类型
    id: number; // 数字类型
    is_deleted: number; // 数字类型（0 或 1）
    pass_end_time: string; // 字符串类型，存储日期时间
    pass_time: string; // 字符串类型，存储日期时间
    post_pic_url: string; // 字符串类型，URL
    post_video_url: string; // 字符串类型，视频 URL
    proc_status: number; // 数字类型
    proc_sum: number; // 数字类型
    snap_pic_url: string; // 字符串类型，快照图片 URL
    speed: number; // 数字类型
    updated_at: string; // 字符串类型，存储日期时间
    updated_by: string; // 字符串类型
    video_url: string; // 字符串类型，视频 URL
    weight: number; // 数字类型
    zip_pic_url: string; // 字符串类型，zip 文件 URL
};
type TrainPassingResponse = {
    count: number;
    data: DataColumn[];
}
type TypeListResponse = string[];
type BridgeListResponse = string[];

// 通用请求方法
const fetchData = async <T, >(url: string, params?: object): Promise<T> => {
    try {
        return await get<T>(url, params);
    } catch (error) {
        showErrorToast(url + " 获取失败，请稍后再试", error);
        throw error;
    }
};

const DataMonitor = () => {
    // Redux
    const dispatch = useDispatch<AppDispatch>();
    dispatch(setSidebarState(false));

    // 表格
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [selectedDetailRow, setSelectedDetailRow] = React.useState<DataColumn | undefined>(undefined);
    const [rowSelection, setRowSelection] = React.useState({})

    // 可选项
    const [pointNameOptions, setPointNameOptions] = React.useState<string[]>([]);
    const [bridgeOptions, setBridgeOptions] = React.useState<string[]>([])

    // 选择器的选择值
    const [selectedBridge, setSelectedBridge] = React.useState<string>('');
    const [video, setVideo] = React.useState<string>('');
    const [selectedStartTime, setSelectedStartTime] = React.useState<string>('');
    const [selectedEndTime, setSelectedEndTime] = React.useState<string>('');

    // 表格分页
    const [data, setData] = React.useState<DataColumn[]>([]);
    const [page, setPage] = React.useState(1);
    const [pageSize] = React.useState(6);
    const [total, setTotal] = React.useState(0);
    const [refreshSignal, setRefreshSignal] = React.useState<boolean>(false); // 控制子组件刷新
    const [clearSignal, setClearhSignal] = React.useState<boolean>(false); // 控制子组件清空

    // 加载分页表格数据
    const fetchTableData = async () => {
        try {
            const tableData = await fetchData<TrainPassingResponse>('/train_passing', {
                bridge: selectedBridge,
                pass_time: selectedStartTime.replace('T', ' '),
                pass_end_time: selectedEndTime.replace('T', ' '),
                page,
                pageSize,
            });
            setTotal(tableData.count);
            setData(tableData.data);
        } catch (error) {
            console.error("加载表格数据失败", error);
        }
    };

    // 上一页
    const previousPage = () => {
        setPage(page - 1);
    };

    // 下一页
    const nextPage = () => {
        setPage(page + 1);
    };

    // 跳转到指定页
    const handlePageChange = (pageIndex: number) => {
        setPage(pageIndex);
    };

    // 格式化时间
    const formatTime = (time: string) => {
        // Fri, 01 Nov 2024 07:44:35 GMT to 2024-11-01 13:25:16
        const date = new Date(time);
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        const hour = (date.getUTCHours()).toString().padStart(2, '0');
        const minute = date.getUTCMinutes().toString().padStart(2, '0');
        const second = date.getUTCSeconds().toString().padStart(2, '0');

        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    }

    // 选择桥梁时更新数据
    const handleDetailClicked = async (row: Row<DataColumn>) => {
        setClearhSignal(!clearSignal);
        const rowData = row.original;
        setSelectedDetailRow(rowData);
        setSelectedBridge(rowData.bridge_name);

        fetchData<{ status: string, video_url: string }>('/video', {
            bridge: rowData.bridge_name,
            time: formatTime(rowData.pass_time)
        }).then(res => {
            setVideo(res.video_url)
        })

        // 请求 pointName 数据
        try {
            const pointName = await fetchData<TypeListResponse>('/pointName', {bridge: rowData.bridge_name});
            setPointNameOptions(pointName);

            // 请求成功后触发子组件刷新
            setRefreshSignal(prev => !prev);  // 切换 refreshSignal
        } catch (error) {
            console.error("加载类型失败", error);
        }
    };

    // 搜索按钮点击事件
    const handleSearchClicked = () => {
        setPage(1)
        fetchTableData()
    }

    // 清空搜索条件
    const clearSearch = () => {
        setSelectedBridge('')
        setSelectedStartTime('')
        setSelectedEndTime('')
    }

    // 表格列定义
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
            accessorKey: "bridge_name",
            header: "桥梁",
            cell: ({row}) => <div>{row.getValue("bridge_name")}</div>,
        },
        {
            accessorKey: "device_sn",
            header: "传感器SN",
            cell: ({row}) => <div>{row.getValue("device_sn")}</div>,
        },
        {
            accessorKey: "pass_time",
            header: "过车开始时刻",
            cell: ({row}) => <div>{formatTime(row.getValue("pass_time"))}</div>,
        },
        {
            accessorKey: "pass_end_time",
            header: "过车结束时刻",
            cell: ({row}) => <div>{formatTime(row.getValue("pass_end_time"))}</div>,
        },
        {
            accessorKey: "speed",
            header: "车速",
            cell: ({row}) => <div>{row.getValue("speed") + ' km/h'}</div>,
        },
        {
            accessorKey: "operation",
            header: "操作",
            cell: ({row}) => {
                return (
                    <div className="cursor-pointer text-blue-500">
                        <a onClick={() => handleDetailClicked(row)}>查看详情</a>
                    </div>
                );
            }
        },
        {
            accessorKey: "post_pic_url",
            header: "过车图片",
            cell: ({row}) => {
                const imageUrl = row.getValue("post_pic_url");
                return imageUrl && typeof imageUrl === 'string' ? (
                    <img src={imageUrl} alt="过车图片" style={{width: '75px', height: 'auto'}}/>
                ) : (
                    <div>暂无可用图像</div>
                )
            },
        },
    ];

    // 立即加载桥梁数据
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

    // 立即加载类型数据
    React.useEffect(() => {
        const fetchPointName = async () => {
            try {
                const pointName = await fetchData<TypeListResponse>('/pointName', {bridge: selectedDetailRow ? selectedDetailRow.bridge_name : ''});
                setPointNameOptions(pointName);
            } catch (error) {
                console.error("加载类型失败", error);
            }
        };
        fetchPointName();

    }, [selectedDetailRow]);

    // 立即加载表格分页数据
    React.useEffect(() => {
        fetchTableData();
    }, [page, pageSize]);

    // 表格实例
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

    return (
        <div className="h-full w-full flex flex-row transition-all">
            {/* 左侧部分 */}
            <div className="h-full grow flex flex-col p-4 overflow-auto">
                {/* 条件查询选择器部分 */}
                <div className="flex flex-row items-center space-x-4 mb-4">
                    {/* 桥梁选择器 */}
                    <Select onValueChange={setSelectedBridge} value={selectedBridge}>
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
                    <input type="datetime-local"
                           className="border border-gray-300 rounded px-2 py-1 w-[180px] bg-opacity-0"
                           placeholder="开始时间" value={selectedStartTime}
                           onChange={(e) => setSelectedStartTime(e.target.value)}/>

                    {/* 结束时间选择器 */}
                    <input type="datetime-local" className="border border-gray-300 rounded px-2 py-1 w-[180px]"
                           placeholder="结束时间" value={selectedEndTime}
                           onChange={(e) => setSelectedEndTime(e.target.value)}/>

                    {/* 搜索按钮 */}
                    <Button onClick={handleSearchClicked}>搜索</Button>

                    {/* 清空筛选条件按钮 */}
                    <Button onClick={clearSearch}>清空筛选条件</Button>
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
                            {/* 已选择和总行数显示 */}
                            <div className="flex-1 text-sm text-muted-foreground">
                                已选择 {table.getFilteredSelectedRowModel().rows.length} 行
                                共 {table.getFilteredRowModel().rows.length} 行
                            </div>

                            {/* 页码选择器和翻页按钮 */}
                            <div className="flex flex-row space-x-6">
                                {/* 页码显示 */}
                                <div className="flex items-center text-sm font-medium">
                                    第 {table.getState().pagination.pageIndex + 1} 页&nbsp;&nbsp;&nbsp;&nbsp;共{" "}
                                    {Math.ceil(total / pageSize)} 页
                                </div>

                                {/* 页码选择器 */}
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(0)}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <ChevronsLeft/>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <ChevronLeft/>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <ChevronRight/>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(table.getPageCount() - 1)}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <ChevronsRight/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 视频播放 */}
                <div className="w-full h-fit flex justify-center mt-4">
                    {video && (
                        <video className="w-auto h-[300px]" src={video} autoPlay controls/>
                    )}
                </div>
            </div>

            {/* 右侧部分 */}
            {selectedDetailRow && (
                <div className="dm-panel h-full w-1/2 p-4 flex flex-col space-y-4 overflow-auto">
                    {/* 一行两个 */}
                    <div className="grid grid-cols-2 gap-6">
                        {pointNameOptions.map((type, index) => (
                            <div key={index} className="w-full mb-3">
                                <div className="text-base font-semibold mb-1">{type}</div>
                                <div className="w-full h-[200px]">
                                    <DemoLineChart
                                        bridge={selectedBridge}
                                        time={selectedDetailRow ? formatTime(selectedDetailRow.pass_time) : ''}
                                        type={type}
                                        clear={clearSignal}
                                        refreshSignal={refreshSignal}  // 将信号传递给子组件
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataMonitor;
