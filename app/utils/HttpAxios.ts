import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios";

const instance: AxiosInstance = axios.create({
    baseURL: "http://49.235.111.245:24671/api/ridp", // 部署后端
    // baseURL: "https://api.ridp.0xcafebabe.cn/api/ridp", // 部署后端的SSL反向代理
    timeout: 1000000, // 请求超时时间
    headers: {
        // 请求头
        "Content-Type": "application/json",
    },
});

/*
使用示例
const fetchData = async () => {
  try {
    const data: UploadResponse = await get<UploadResponse>('/upload', { param1: 'value1', param2: 'value2' });
    console.log('GET Response:', data);
  } catch (error) {
    console.error('GET Error:', error);
  }
};
**/
export const get = async <T>(url: string, params: object = {}): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await instance.get(url, {params});
        return response.data;
    } catch (error) {
        handleError(error as AxiosError);
        throw error;
    }
};

export const post = async <T>(url: string, data: object = {}): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await instance.post(url, data);
        return response.data;
    } catch (error) {
        handleError(error as AxiosError);
        throw error;
    }
};

// 错误处理函数
const handleError = (error: AxiosError) => {
    if (error.response) {
        // 请求已发出，但服务器响应状态码不在 2xx 范围内
        console.error("Response Error:", error.response.data);
        console.error("Status Code:", error.response.status);
        console.error("Headers:", error.response.headers);
    } else if (error.request) {
        // 请求已发出，但没有收到响应
        console.error("Request Error:", error.request);
    } else {
        // 其他错误
        console.error("Error:", error.message);
    }
};

//  put、delete
