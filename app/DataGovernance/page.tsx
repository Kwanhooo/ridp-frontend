import * as React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const containerStyle = {
    height: `calc(100% - 76px)`
};

const FourChartsPage = () => {
    return (
        <div className="h-full bg-black p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            原始数据
                        </CardTitle>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        <div className="h-full w-full bg-gray-500"></div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            预处理后数据
                        </CardTitle>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        <div className="h-full w-full bg-gray-500"></div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            平滑后数据
                        </CardTitle>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        <div className="h-full w-full bg-gray-500"></div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            多模态数据
                        </CardTitle>
                    </CardHeader>
                    <CardContent style={containerStyle}>
                        <div className="h-full w-full bg-gray-500"></div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FourChartsPage;
