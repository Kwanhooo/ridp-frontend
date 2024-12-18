import React from 'react';

const MonitorPage = () => {
    // 视频源
    const liveStream = [
        {
            url: "https://monitor.ridp.0xcafebabe.cn/video?proName=guidao&chanName=B7DD532F-6151-459A-B53C-B849E9BE9B22",
            name: "滁宁城际西涧路特大桥1号摄像头"
        },
        {
            url: "https://monitor.ridp.0xcafebabe.cn/video?proName=guidao&chanName=AK0868434_1",
            name: "武广高铁淦河连续梁桥摄像头1"
        },
        {
            url: "https://monitor.ridp.0xcafebabe.cn/video?proName=guidao&chanName=AK0868423_1",
            name: "武广高铁枫树下大桥摄像头"
        },
        {
            url: "https://monitor.ridp.0xcafebabe.cn/video?proName=guidao&chanName=FB1667544_1",
            name: "武广高铁行将山1号隧道工点"
        },
        {
            url: "https://monitor.ridp.0xcafebabe.cn/video?proName=guidao&chanName=AK0868423_1",
            name: "武广高铁路基摄像头"
        },
        {
            url: "https://monitor.ridp.0xcafebabe.cn/video?proName=guidao&chanName=FQ9566853_1",
            name: "某客运专线大桥摄像头"
        }
    ];

    return (
        <div className="w-full h-full overflow-auto space-y-8 p-6 px-[10%]">
            <div className="flex justify-between gap-6">
                {liveStream.slice(0, 2).map((obj, index) => (
                    <div key={index} className="w-1/2 rounded-lg overflow-hidden">
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
                    <div key={index} className="w-1/2 rounded-lg overflow-hidden">
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

            <div className="flex justify-between gap-6">
                {liveStream.slice(4, 6).map((obj, index) => (
                    <div key={index} className="w-1/2 rounded-lg overflow-hidden">
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
