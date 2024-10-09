"use client";

import {useState} from "react";
import Link from "next/link";

const NavigationLayout = ({children}: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // 页面数组，包含页面名称和路径
    const pages = [
        {name: '数据总览', path: '/DataDashboard'},
        {name: '数据治理', path: '/DataGovernance'},
        {name: '模型管理', path: '/DataManagement'},
        {name: '预警监控', path: '/page4'},
    ];

    return (
        <div className="flex h-screen">
            {/* 侧边栏 */}
            <aside
                className={`${
                    isSidebarOpen ? "w-64" : "w-16"
                } bg-black text-white p-5 transition-all duration-300 ease-in-out border-r-[1px] border-gray-700`}
            >
                {/* 顶部按钮 */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={toggleSidebar}
                        className="text-white focus:outline-none"
                    >
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
                                <Link
                                    href={page.path}
                                    className={`text-lg font-semibold text-white ${
                                        !isSidebarOpen && "hidden"
                                    }`}
                                >
                                    <div className={`hover:bg-gray-800 transition-all px-4 py-1 rounded-lg`}>
                                        <span
                                            className="whitespace-nowrap overflow-hidden text-ellipsis">{page.name}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* 内容区域 */}
            <main className="flex-1 transition-all duration-300">
                {children}
            </main>
        </div>
    );
};

export default NavigationLayout;
