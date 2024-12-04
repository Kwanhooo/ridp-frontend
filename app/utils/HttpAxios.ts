import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const instance: AxiosInstance = axios.create({
  // baseURL: "https://api.ridp.0xcafebabe.cn/api/ridp", // 你的 API 基础 URL
  // baseURL: "http://10.20.1.97:5555/api/ridp",
  baseURL: "http://127.0.0.1:5000/api/ridp",
  timeout: 10000, // 请求超时时间
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
    const response: AxiosResponse<T> = await instance.get(url, { params });
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
