import React from 'react';

const MonitorPage = () => {
    // 视频源
    const liveStream = [
        {
            url: "http://119.36.93.103:30779/video?proName=guidao&chanName=B7DD532F-6151-459A-B53C-B849E9BE9B22",
            name: "滁宁城际西涧路特大桥1号摄像头"
        },
        {
            url: "http://119.36.93.103:30779/video?proName=guidao&chanName=AK0868434_1",
            name: "武广高铁淦河连续梁桥摄像头1"
        },
        {
            url: "http://119.36.93.103:30779/video?proName=guidao&chanName=AK0868423_1",
            name: "武广高铁枫树下大桥摄像头"
        },
        {
            url: "http://119.36.93.103:30779/video?proName=guidao&chanName=FB1667544_1",
            name: "武广高铁行将山1号隧道工点"
        }
    ];

    return (
        <div className="w-full h-full overflow-auto space-y-8 p-6 px-[10%]">
            <div className="flex justify-between gap-6">
                {liveStream.slice(0, 2).map((obj, index) => (
                    <div key={index} className="w-1/2 shadow-md rounded-lg overflow-hidden">
                        <div className="text-xl font-bold mb-1">{obj.name}</div>
                        <iframe
                            src={obj.url}
                            width="100%"
                            height="400"
                            allow="autoplay; fullscreen"
                            title={`Monitor Video ${index + 1}`}
                            className="rounded-lg"
                        ></iframe>
                    </div>
                ))}
            </div>

            <div className="flex justify-between gap-6">
                {liveStream.slice(2, 4).map((obj, index) => (
                    <div key={index} className="w-1/2 shadow-md rounded-lg overflow-hidden">
                        <div className="text-xl font-bold mb-1">{obj.name}</div>
                        <iframe
                            src={obj.url}
                            width="100%"
                            height="400"
                            allow="autoplay; fullscreen"
                            title={`Monitor Video ${index + 3}`}
                            className="rounded-lg"
                        ></iframe>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonitorPage;
