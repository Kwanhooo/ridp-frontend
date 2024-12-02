import React from 'react';

const MonitorPage = () => {
    // 视频源的数组
    const videoUrls = [
        "http://119.36.93.103:30779/video?proName=guidao&chanName=B7DD532F-6151-459A-B53C-B849E9BE9B22",
        "http://119.36.93.103:30779/video?proName=guidao&chanName=AK0868434_1",
        "http://119.36.93.103:30779/video?proName=guidao&chanName=AK0868423_1",
        "http://119.36.93.103:30779/video?proName=guidao&chanName=FB1667544_1",
        "http://119.36.93.103:30779/video?proName=guidao&chanName=AK0868423_1"
    ];

    return (
        <div className="w-full h-full overflow-auto space-y-6 p-6 px-[10%]">
            {/* 第一行，两个视频 */}
            <div className="flex justify-between gap-6">
                {videoUrls.slice(0, 2).map((url, index) => (
                    <div key={index} className="w-1/2 bg-white shadow-md rounded-lg overflow-hidden">
                        <iframe
                            src={url}
                            width="100%"
                            height="400"
                            frameBorder="0"
                            allow="autoplay; fullscreen"
                            title={`Monitor Video ${index + 1}`}
                            className="rounded-lg"
                        ></iframe>
                    </div>
                ))}
            </div>

            {/* 第二行，两个视频 */}
            <div className="flex justify-between gap-6">
                {videoUrls.slice(2, 4).map((url, index) => (
                    <div key={index} className="w-1/2 bg-white shadow-md rounded-lg overflow-hidden">
                        <iframe
                            src={url}
                            width="100%"
                            height="400"
                            frameBorder="0"
                            allow="autoplay; fullscreen"
                            title={`Monitor Video ${index + 3}`}
                            className="rounded-lg"
                        ></iframe>
                    </div>
                ))}
            </div>

            {/* 第三行，最后一个视频，居左且占满整个宽度 */}
            <div className="flex justify-start gap-6">
                <div className="w-1/2 bg-white shadow-md rounded-lg overflow-hidden">
                    <iframe
                        src={videoUrls[4]}
                        width="100%"
                        height="400"
                        frameBorder="0"
                        allow="autoplay; fullscreen"
                        title="Monitor Video 5"
                        className="rounded-lg"
                    ></iframe>
                </div>
                <div className="w-1/2 bg-white overflow-hidden"></div>

            </div>
        </div>
    );
};

export default MonitorPage;
