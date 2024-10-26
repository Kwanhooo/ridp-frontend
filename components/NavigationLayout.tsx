"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState("");

  const pathname = usePathname();

  useEffect(() => {
    setSelectedPage(pathname);
  }, [pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDataManagement = () => {
    setIsDataManagementOpen(!isDataManagementOpen);
  };

  // 页面数组，包含页面名称和路径
  const pages = [
    { name: "数据大屏", path: "DataBigScreen" },
    { name: "数据查询", path: "/DataDashboard" },
    { name: "数据治理", path: "/DataGovernance" },
    { name: "模型管理", path: "/ModelManagement" },
    { name: "数据管理", path: "#" },
  ];

  // 数据管理下拉菜单选项
  const dataManagementOptions = [
    { name: "数值数据", path: "/DataManagement/Numerical" },
    { name: "模型数据", path: "/DataManagement/Model" },
    { name: "时序图数据", path: "#" },
    { name: "视频数据", path: "#" },
    { name: "音频数据", path: "#" },
    { name: "文本数据", path: "#" },
    { name: "向量数据", path: "#" },
    { name: "图片数据", path: "#" },
    { name: "图谱数据", path: "#" },
    { name: "表数据", path: "#" },
  ];

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-gray-800 text-white p-5 transition-all duration-300 ease-in-out border-r-[1px] border-gray-700`}
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

      {/* 内容区域 */}
      <main className="flex-1 transition-all duration-300">{children}</main>
    </div>
  );
};

export default NavigationLayout;
