"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname, useSearchParams} from "next/navigation";
import {AppDispatch} from "@/store";
import {selectSidebar, toggleSidebar} from "@/store/modules/sidebarSlice";
import {useDispatch, useSelector} from "react-redux";

const NavigationLayout = ({children}: { children: React.ReactNode }) => {
    const isSidebarOpen = useSelector(selectSidebar);
    const dispatch = useDispatch<AppDispatch>();

    // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
    const [isMonitoringOpen, setIsMonitoringOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState("");

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const hideSidebar = searchParams.get("hide") === "true";

    useEffect(() => {
        setSelectedPage(pathname);
    }, [pathname]);

    const toggle = () => {
        dispatch(toggleSidebar());
    };

    const toggleDataManagement = () => {
        setIsDataManagementOpen(!isDataManagementOpen);
    };

    const toggleMonitoring = () => {  // 切换监控子菜单状态
        setIsMonitoringOpen(!isMonitoringOpen);
    };

    // 页面数组，包含页面名称和路径
    const pages = [
        {name: "数据大屏", path: "/DataBigScreen"},
        {name: "实时监控", path: "#"},
        {name: "数据治理", path: "/DataGovernance"},
        {name: "数据管理", path: "#"},
    ];

    // 数据管理下拉菜单选项
    const dataManagementOptions = [
        {name: "时序数据", path: "/DataManagement/TimeStamp"},
        {name: "模型数据", path: "/DataManagement/Model"},
        {name: "特征数据", path: "/DataManagement/Feature"},
        {name: "多媒体数据", path: "/DataManagement/MultiMedia"},
        {name: "文本数据", path: "/DataManagement/Text"},
    ];

    // 监控下拉菜单选项
    const monitoringOptions = [
        {name: "视频监控", path: "/VideoMonitor"},
        {name: "过车监控", path: "/DataMonitor"},
    ];

    return (
        <div className="flex h-screen">
            {/* 侧边栏 */}
            {!hideSidebar && (
                <aside
                    className={`${isSidebarOpen ? "w-64" : "w-16"} bg-gray-800 text-white p-5 transition-all duration-300 ease-in-out border-r-[1px] border-gray-700`}
                >
                    {/* 顶部按钮 */}
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={toggle} className="text-white focus:outline-none">
                            {!isSidebarOpen ? (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    ></path>
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* 侧边栏导航，使用 map 动态生成页面链接 */}
                    <nav>
                        <ul>
                            {pages.map((page, index) => (
                                <li key={index} className="mb-4">
                                    {page.name === "数据管理" ? (
                                        <>
                                            <button
                                                onClick={toggleDataManagement}
                                                className={`text-lg font-semibold text-white w-full text-left ${
                                                    !isSidebarOpen && "hidden"
                                                }`}
                                            >
                                                <div
                                                    className={`hover:bg-blue-500 transition-all px-4 py-1 rounded-lg flex justify-between items-center ${
                                                        selectedPage === page.path && "bg-blue-500"
                                                    }`}
                                                >
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                            {page.name}
                          </span>
                                                    <svg
                                                        className={`w-4 h-4 transition-transform duration-300 ${
                                                            isDataManagementOpen ? "transform rotate-180" : ""
                                                        }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </button>
                                            {isDataManagementOpen && (
                                                <ul className="pl-4 mt-2">
                                                    {dataManagementOptions.map((option, optionIndex) => (
                                                        <li key={optionIndex} className="mb-2">
                                                            <Link
                                                                href={option.path}
                                                                className={`text-base font-semibold text-white ${
                                                                    !isSidebarOpen && "hidden"
                                                                }`}
                                                            >
                                                                <div
                                                                    className={`hover:bg-blue-500 transition-all px-4 py-1 rounded-lg ${
                                                                        selectedPage === option.path && "bg-blue-500"
                                                                    }`}
                                                                >
                                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                    {option.name}
                                  </span>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    ) : page.name === "实时监控" ? (
                                        <>
                                            <button
                                                onClick={toggleMonitoring}
                                                className={`text-lg font-semibold text-white w-full text-left ${
                                                    !isSidebarOpen && "hidden"
                                                }`}
                                            >
                                                <div
                                                    className={`hover:bg-blue-500 transition-all px-4 py-1 rounded-lg flex justify-between items-center ${
                                                        selectedPage === page.path && "bg-blue-500"
                                                    }`}
                                                >
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                            {page.name}
                          </span>
                                                    <svg
                                                        className={`w-4 h-4 transition-transform duration-300 ${
                                                            isMonitoringOpen ? "transform rotate-180" : ""
                                                        }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            </button>
                                            {isMonitoringOpen && (
                                                <ul className="pl-4 mt-2">
                                                    {monitoringOptions.map((option, optionIndex) => (
                                                        <li key={optionIndex} className="mb-2">
                                                            <Link
                                                                href={option.path}
                                                                className={`text-base font-semibold text-white ${
                                                                    !isSidebarOpen && "hidden"
                                                                }`}
                                                            >
                                                                <div
                                                                    className={`hover:bg-blue-500 transition-all px-4 py-1 rounded-lg ${
                                                                        selectedPage === option.path && "bg-blue-500"
                                                                    }`}
                                                                >
                                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                    {option.name}
                                  </span>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href={page.path}
                                            className={`text-lg font-semibold text-white ${
                                                !isSidebarOpen && "hidden"
                                            }`}
                                        >
                                            <div
                                                className={`hover:bg-blue-500 transition-all px-4 py-1 rounded-lg ${
                                                    selectedPage === page.path && "bg-blue-500"
                                                }`}
                                            >
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                          {page.name}
                        </span>
                                            </div>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
            )}

            {/* 内容区域 */}
            <main className="flex-1 transition-all duration-300">{children}</main>
        </div>
    );
};

export default NavigationLayout;
