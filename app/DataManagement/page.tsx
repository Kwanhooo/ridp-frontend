// pages/page3.tsx
"use client";

import { useState, useEffect } from "react";

import MyLineChart from "@/components/LineChart";
import ChartSetting from "@/components/ChartSettting";
import { get } from "../uitils/HttpAxios";

type ChartData = {
  filename: string;
  file_content: {
    time: string;
    value: number;
  }[];
};

// const chartData = {
//   filename: "xxx.csv",
//   file_content: [
//     { time: "2024-04-10 06:19:38.000", value: 0.0027995109558105 },
//     { time: "2024-04-10 06:19:38.001", value: 0.0013256072998046 },
//     { time: "2024-04-10 06:19:38.002", value: -0.000495433807373 },
//     { time: "2024-04-10 06:19:38.003", value: -0.0006523132324218 },
//     { time: "2024-04-10 06:19:38.004", value: 0.001415729522705 },
//     { time: "2024-04-10 06:19:38.005", value: 0.0029530525207519 },
//     { time: "2024-04-10 06:19:38.006", value: 0.0017380714416503 },
//     { time: "2024-04-10 06:19:38.007", value: -0.0003962516784667 },
//     { time: "2024-04-10 06:19:38.008", value: -0.0012845993041992 },
//     { time: "2024-04-10 06:19:38.009", value: 0.0008859634399414 },
//     { time: "2024-04-10 06:19:38.010", value: 0.0026187896728515 },
//     { time: "2024-04-10 06:19:38.011", value: 0.0022416114807128 },
//     { time: "2024-04-10 06:19:38.012", value: 0.0001816749572753 },
//     { time: "2024-04-10 06:19:38.013", value: -0.0015311241149902 },
//     { time: "2024-04-10 06:19:38.014", value: -0.0001072883605957 },
//     { time: "2024-04-10 06:19:38.015", value: 0.0021233558654785 },
//     { time: "2024-04-10 06:19:38.016", value: 0.0023107528686523 },
//     { time: "2024-04-10 06:19:38.017", value: 0.0004267692565917 },
//     { time: "2024-04-10 06:19:38.018", value: -0.0010571479797363 },
//     { time: "2024-04-10 06:19:38.019", value: -0.00000095367431640625 },
//     { time: "2024-04-10 06:19:38.020", value: 0.0019540786743164 },
//     { time: "2024-04-10 06:19:38.021", value: 0.0025243759155273 },
//     { time: "2024-04-10 06:19:38.022", value: 0.0008220672607421 },
//     { time: "2024-04-10 06:19:38.023", value: -0.0009064674377441 },
//     { time: "2024-04-10 06:19:38.024", value: -0.0004072189331054 },
//     { time: "2024-04-10 06:19:38.025", value: 0.0016651153564453 },
//     { time: "2024-04-10 06:19:38.026", value: 0.0026750564575195 },
//     { time: "2024-04-10 06:19:38.027", value: 0.0011372566223144 },
//     { time: "2024-04-10 06:19:38.028", value: -0.0008611679077148 },
//     { time: "2024-04-10 06:19:38.029", value: -0.0005245208740234 },
//     { time: "2024-04-10 06:19:38.030", value: 0.0016498565673828 },
//     { time: "2024-04-10 06:19:38.031", value: 0.002845287322998 },
//     { time: "2024-04-10 06:19:38.032", value: 0.0015201568603515 },
//     { time: "2024-04-10 06:19:38.033", value: -0.0007061958312988 },
//     { time: "2024-04-10 06:19:38.034", value: -0.0009765625 },
//     { time: "2024-04-10 06:19:38.035", value: 0.0012731552124023 },
//     { time: "2024-04-10 06:19:38.036", value: 0.0028433799743652 },
//     { time: "2024-04-10 06:19:38.037", value: 0.0022459030151367 },
//     { time: "2024-04-10 06:19:38.038", value: 0.00006103515625 },
//     { time: "2024-04-10 06:19:38.039", value: -0.0013742446899414 },
//     { time: "2024-04-10 06:19:38.040", value: 0.0005640983581542 },
//     { time: "2024-04-10 06:19:38.041", value: 0.0025477409362792 },
//     { time: "2024-04-10 06:19:38.042", value: 0.0022711753845214 },
//     { time: "2024-04-10 06:19:38.043", value: 0.0002079010009765 },
//     { time: "2024-04-10 06:19:38.044", value: -0.0009903907775878 },
//     { time: "2024-04-10 06:19:38.045", value: 0.0003890991210937 },
//     { time: "2024-04-10 06:19:38.046", value: 0.0024385452270507 },
//     { time: "2024-04-10 06:19:38.047", value: 0.0028905868530273 },
//     { time: "2024-04-10 06:19:38.048", value: 0.0009007453918457 },
//     { time: "2024-04-10 06:19:38.049", value: -0.0011019706726074 },
//     { time: "2024-04-10 06:19:38.050", value: -0.0002970695495605 },
//     { time: "2024-04-10 06:19:38.051", value: 0.002197265625 },
//     { time: "2024-04-10 06:19:38.052", value: 0.0029840469360351 },
//     { time: "2024-04-10 06:19:38.053", value: 0.0013437271118164 },
//     { time: "2024-04-10 06:19:38.054", value: -0.0008468627929687 },
//     { time: "2024-04-10 06:19:38.055", value: -0.0007128715515136 },
//     { time: "2024-04-10 06:19:38.056", value: 0.0015320777893066 },
//     { time: "2024-04-10 06:19:38.057", value: 0.0026483535766601 },
//     { time: "2024-04-10 06:19:38.058", value: 0.0014572143554687 },
//     { time: "2024-04-10 06:19:38.059", value: -0.0006256103515625 },
//     { time: "2024-04-10 06:19:38.060", value: -0.000831127166748 },
//     { time: "2024-04-10 06:19:38.061", value: 0.0013842582702636 },
//     { time: "2024-04-10 06:19:38.062", value: 0.0031023025512695 },
//     { time: "2024-04-10 06:19:38.063", value: 0.0023732185363769 },
//     { time: "2024-04-10 06:19:38.064", value: 0.0003085136413574 },
//     { time: "2024-04-10 06:19:38.065", value: -0.0004620552062988 },
//     { time: "2024-04-10 06:19:38.066", value: 0.0012407302856445 },
//     { time: "2024-04-10 06:19:38.067", value: 0.0030388832092285 },
//     { time: "2024-04-10 06:19:38.068", value: 0.0023179054260253 },
//     { time: "2024-04-10 06:19:38.069", value: -0.0002236366271972 },
//     { time: "2024-04-10 06:19:38.070", value: -0.0012493133544921 },
//     { time: "2024-04-10 06:19:38.071", value: 0.0004305839538574 },
//     { time: "2024-04-10 06:19:38.072", value: 0.0028018951416015 },
//     { time: "2024-04-10 06:19:38.073", value: 0.0028343200683593 },
//     { time: "2024-04-10 06:19:38.074", value: 0.0004491806030273 },
//     { time: "2024-04-10 06:19:38.075", value: -0.0010442733764648 },
//     { time: "2024-04-10 06:19:38.076", value: -0.0002970695495605 },
//     { time: "2024-04-10 06:19:38.077", value: 0.0020985603332519 },
//     { time: "2024-04-10 06:19:38.078", value: 0.0025582313537597 },
//     { time: "2024-04-10 06:19:38.079", value: 0.0006208419799804 },
//     { time: "2024-04-10 06:19:38.080", value: -0.0008959770202636 },
//     { time: "2024-04-10 06:19:38.081", value: -0.0003156661987304 },
//     { time: "2024-04-10 06:19:38.082", value: 0.0019135475158691 },
//     { time: "2024-04-10 06:19:38.083", value: 0.0028142929077148 },
//     { time: "2024-04-10 06:19:38.084", value: 0.0014510154724121 },
//     { time: "2024-04-10 06:19:38.085", value: -0.000955581665039 },
//     { time: "2024-04-10 06:19:38.086", value: -0.0007648468017578 },
//     { time: "2024-04-10 06:19:38.087", value: 0.0013041496276855 },
//     { time: "2024-04-10 06:19:38.088", value: 0.002786636352539 },
//     { time: "2024-04-10 06:19:38.089", value: 0.0018362998962402 },
//     { time: "2024-04-10 06:19:38.090", value: -0.0001792907714843 },
//     { time: "2024-04-10 06:19:38.091", value: -0.0008578300476074 },
//     { time: "2024-04-10 06:19:38.092", value: 0.0009765625 },
//     { time: "2024-04-10 06:19:38.093", value: 0.0029902458190917 },
//     { time: "2024-04-10 06:19:38.094", value: 0.0026164054870605 },
//     { time: "2024-04-10 06:19:38.095", value: 0.0006904602050781 },
//     { time: "2024-04-10 06:19:38.096", value: -0.0007820129394531 },
//     { time: "2024-04-10 06:19:38.097", value: 0.0006732940673828 },
//     { time: "2024-04-10 06:19:38.098", value: 0.00272798538208 },
//     { time: "2024-04-10 06:19:38.099", value: 0.0029568672180175 },
//     { time: "2024-04-10 06:19:38.100", value: 0.0005726814270019 },
//     { time: "2024-04-10 06:19:38.101", value: -0.0009465217590332 },
//     { time: "2024-04-10 06:19:38.102", value: -0.00009059906005859376 },
//     { time: "2024-04-10 06:19:38.103", value: 0.0021333694458007 },
//     { time: "2024-04-10 06:19:38.104", value: 0.0026555061340332 },
//     { time: "2024-04-10 06:19:38.105", value: 0.0008563995361328 },
//     { time: "2024-04-10 06:19:38.106", value: -0.0004439353942871 },
//     { time: "2024-04-10 06:19:38.107", value: 0.0001578330993652 },
//     { time: "2024-04-10 06:19:38.108", value: 0.0022006034851074 },
//     { time: "2024-04-10 06:19:38.109", value: 0.0030460357666015 },
//     { time: "2024-04-10 06:19:38.110", value: 0.0017313957214355 },
//     { time: "2024-04-10 06:19:38.111", value: -0.0006165504455566 },
//     { time: "2024-04-10 06:19:38.112", value: -0.0005521774291992 },
//     { time: "2024-04-10 06:19:38.113", value: 0.0020308494567871 },
//     { time: "2024-04-10 06:19:38.114", value: 0.0029668807983398 },
//     { time: "2024-04-10 06:19:38.115", value: 0.0019540786743164 },
//     { time: "2024-04-10 06:19:38.116", value: -0.0002326965332031 },
//     { time: "2024-04-10 06:19:38.117", value: -0.0005035400390625 },
//     { time: "2024-04-10 06:19:38.118", value: 0.0015935897827148 },
//     { time: "2024-04-10 06:19:38.119", value: 0.0031118392944335 },
//     { time: "2024-04-10 06:19:38.120", value: 0.0024013519287109 },
//     { time: "2024-04-10 06:19:38.121", value: -0.0001387596130371 },
//     { time: "2024-04-10 06:19:38.122", value: -0.0006628036499023 },
//     { time: "2024-04-10 06:19:38.123", value: 0.0010294914245605 },
//     { time: "2024-04-10 06:19:38.124", value: 0.0026931762695312 },
//     { time: "2024-04-10 06:19:38.125", value: 0.0024080276489257 },
//     { time: "2024-04-10 06:19:38.126", value: 0.0002474784851074 },
//     { time: "2024-04-10 06:19:38.127", value: -0.0010933876037597 },
//     { time: "2024-04-10 06:19:38.128", value: 0.0005507469177246 },
//     { time: "2024-04-10 06:19:38.129", value: 0.0023212432861328 },
//     { time: "2024-04-10 06:19:38.130", value: 0.0024023056030273 },
//     { time: "2024-04-10 06:19:38.131", value: 0.00059175491333 },
//     { time: "2024-04-10 06:19:38.132", value: -0.0009651184082031 },
//     { time: "2024-04-10 06:19:38.133", value: 0.007104873657226562 },
//     { time: "2024-04-10 06:19:38.134", value: 0.0020408630371093 },
//     { time: "2024-04-10 06:19:38.135", value: 0.0025215148925781 },
//     { time: "2024-04-10 06:19:38.136", value: 0.0009641647338867 },
//     { time: "2024-04-10 06:19:38.137", value: -0.0007414817810058 },
//     { time: "2024-04-10 06:19:38.138", value: -0.0002970695495605 },
//     { time: "2024-04-10 06:19:38.139", value: 0.0021686553955078 },
//     { time: "2024-04-10 06:19:38.140", value: 0.0027909278869628 },
//     { time: "2024-04-10 06:19:38.141", value: 0.0012092590332031 },
//     { time: "2024-04-10 06:19:38.142", value: -0.0010342597961425 },
//     { time: "2024-04-10 06:19:38.143", value: -0.000864028930664 },
//     { time: "2024-04-10 06:19:38.144", value: 0.0016379356384277 },
//     { time: "2024-04-10 06:19:38.145", value: 0.0028958320617675 },
//     { time: "2024-04-10 06:19:38.146", value: 0.0020604133605957 },
//     { time: "2024-04-10 06:19:38.147", value: -0.0002956390380859 },
//     { time: "2024-04-10 06:19:38.148", value: -0.0010905265808105 },
//     { time: "2024-04-10 06:19:38.149", value: 0.0008187294006347 },
//     { time: "2024-04-10 06:19:38.150", value: 0.0026588439941406 },
//     { time: "2024-04-10 06:19:38.151", value: 0.0021705627441406 },
//     { time: "2024-04-10 06:19:38.152", value: -0.00002288818359375 },
//     { time: "2024-04-10 06:19:38.153", value: -0.0010871887207031 },
//     { time: "2024-04-10 06:19:38.154", value: 0.0003910064697265 },
//     { time: "2024-04-10 06:19:38.155", value: 0.0026688575744628 },
//     { time: "2024-04-10 06:19:38.156", value: 0.0024614334106445 },
//     { time: "2024-04-10 06:19:38.157", value: 0.0002446174621582 },
//     { time: "2024-04-10 06:19:38.158", value: -0.0010414123535156 },
//     { time: "2024-04-10 06:19:38.159", value: 0.0001730918884277 },
//     { time: "2024-04-10 06:19:38.160", value: 0.0025620460510253 },
//     { time: "2024-04-10 06:19:38.161", value: 0.0029406547546386 },
//     { time: "2024-04-10 06:19:38.162", value: 0.0008764266967773 },
//     { time: "2024-04-10 06:19:38.163", value: -0.0008974075317382 },
//     { time: "2024-04-10 06:19:38.164", value: -0.0002598762512207 },
//     { time: "2024-04-10 06:19:38.165", value: 0.0019898414611816 },
//     { time: "2024-04-10 06:19:38.166", value: 0.0028152465820312 },
//     { time: "2024-04-10 06:19:38.167", value: 0.0015172958374023 },
//     { time: "2024-04-10 06:19:38.168", value: -0.000737190246582 },
//     { time: "2024-04-10 06:19:38.169", value: -0.0006666183471679 },
//     { time: "2024-04-10 06:19:38.170", value: 0.0016908645629882 },
//     { time: "2024-04-10 06:19:38.171", value: 0.0030603408813476 },
//     { time: "2024-04-10 06:19:38.172", value: 0.0019392967224121 },
//   ],
// };

const Page = () => {
  const [selectedBridge, setSelectedBridge] = useState<string>("");
  const [bridgeOptions, setBridgeOptions] = useState<string[]>([]);

  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeOptions, setTimeOptions] = useState<string[]>([]);

  const [selectedMetric, setSelectedMetric] = useState<string>("");
  const [metricOptions, setMetricOptions] = useState<string[]>([]);

  const [selectedType, setSelectedType] = useState<string>("");

  const [selectedLimitation, setSelectedLimitation] = useState<string>("");
  const [selectedExtension, setSelectedExtension] = useState<string>("");

  const [originChartData, setOriginChartData] = useState<ChartData>(
    {} as ChartData
  );
  const [handleChartData, setHandleChartData] = useState<ChartData>(
    {} as ChartData
  );

  useEffect(() => {
    // Fetch data from the API
    const fetch_data = async () => {
      try {
        const bridge_options = await get<string[]>("bridges");
        setSelectedBridge(bridge_options[0]);
        setBridgeOptions(bridge_options);

        // const time_options = await get<string[]>("times", {
        //   bridge: bridge_options[0],
        // });
        // setSelectedTime(time_options[0]);
        // setTimeOptions(time_options);

        const metric_options = await get<string[]>("types");
        setSelectedMetric(metric_options[0]);
        setMetricOptions(metric_options);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetch_data();
  }, []);

  useEffect(() => {
    // Fetch time options when selectedBridge changes
    const fetch_time_options = async () => {
      try {
        const time_options = await get<string[]>("times", {
          bridge: selectedBridge,
        });
        setSelectedTime(time_options[0]);
        setTimeOptions(time_options);
      } catch (error) {
        console.error("Error fetching time options:", error);
      }
    };
    fetch_time_options();
  }, [selectedBridge]);

  useEffect(() => {
    // Fetch origin chart data when selectedMetric change
    const fetch_handle_chart_data = async () => {
      try {
        if (selectedType === "CleanModel") {
          const handle_chart_data = await get<ChartData>(
            "model-management/clean",
            {
              bridge: selectedBridge,
              time: selectedTime,
              type: selectedMetric,
              Parameters: {
                limitation: selectedLimitation,
              },
            }
          );
          setHandleChartData(handle_chart_data);
        } else if (selectedType === "CutModel") {
          const handle_chart_data = await get<ChartData>(
            "model-management/cut",
            {
              bridge: selectedBridge,
              time: selectedTime,
              type: selectedMetric,
              Parameters: {
                limitation: selectedLimitation,
                extension: selectedExtension,
              },
            }
          );
          setHandleChartData(handle_chart_data);
        } else if (selectedType === "FilterModel") {
          const handle_chart_data = await get<ChartData>(
            "model-management/filter",
            {
              bridge: selectedBridge,
              time: selectedTime,
              type: selectedMetric,
              Parameters: {
                window_size: 100,
              },
            }
          );
          setHandleChartData(handle_chart_data);
        }
      } catch (error) {
        console.error("Error fetching time options:", error);
      }
    };
    // render handleChartData only if originChartData is not empty
    if (Object.keys(originChartData).length > 0) {
      fetch_handle_chart_data();
    }
  }, [selectedType]);

  const selects = [
    {
      label: "桥梁",
      options: bridgeOptions,
      defaultValue: selectedBridge,
      onChange: setSelectedBridge,
    },
    {
      label: "时间",
      options: timeOptions,
      defaultValue: selectedTime,
      onChange: setSelectedTime,
    },
    {
      label: "指标",
      options: metricOptions,
      defaultValue: selectedMetric,
      onChange: setSelectedMetric,
    },
    {
      label: "模型类型",
      options: ["CleanModel", "CutModel", "FilterModel"],
      defaultValue: selectedType,
      onChange: setSelectedType,
    },
    {
      label: "阈值",
      options: ["0.01"],
      defaultValue: selectedLimitation,
      onChange: setSelectedLimitation,
    },
    {
      label: "拓展",
      options: ["0.05"],
      defaultValue: selectedExtension,
      onChange: setSelectedExtension,
    },
  ];

  const handleSubmit = async () => {
    // 获取图表数据
    try {
      const response = await get<ChartData>("metrics", {
        bridge: selectedBridge,
        time: selectedTime,
        type: selectedMetric,
      });
      setOriginChartData(response);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="h-1/8 p-2 border-b border-gray-700">
        <ChartSetting selects={selects} submit={handleSubmit} />
      </div>

      <div className="flex flex-col h-7/8 p-2 w-full space-y-2">
        <div className="h-1/2">
          <MyLineChart data={originChartData} title="原始数据"></MyLineChart>
        </div>
        <div className="h-1/2">
          <MyLineChart data={handleChartData} title="模型数据"></MyLineChart>
        </div>
      </div>
    </div>
  );
};

export default Page;
