import * as React from "react";

const FourChartsPage = () => {
    return (

        <div className="h-full bg-black">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                <div className="bg-white rounded-2xl shadow-md flex flex-col">
                    <div className="text-center text-xl font-bold py-1">原始数据</div>
                    <div className="flex-grow bg-gray-200 rounded-b-2xl"></div>
                </div>
                <div className="bg-white rounded-2xl shadow-md flex flex-col">
                    <div className="text-center text-xl font-bold py-1">预处理后数据</div>
                    <div className="flex-grow bg-gray-200 rounded-b-2xl"></div>
                </div>
                <div className="bg-white rounded-2xl shadow-md flex flex-col">
                    <div className="text-center text-xl font-bold py-1">平滑后数据</div>
                    <div className="flex-grow bg-gray-200 rounded-b-2xl"></div>
                </div>
                <div className="bg-white rounded-2xl shadow-md flex flex-col">
                    <div className="text-center text-xl font-bold py-1">多模态数据</div>
                    <div className="flex-grow bg-gray-200 rounded-b-2xl"></div>
                </div>
            </div>
        </div>
    );
};

export default FourChartsPage;
