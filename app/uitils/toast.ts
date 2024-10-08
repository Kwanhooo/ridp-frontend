import {toast} from "react-toastify";

export const showErrorToast = (message: string, error: unknown) => {
    let errorMessage = '未知错误';

    if (error instanceof Error) {
        errorMessage = error.message;
    }
    toast.error(`${message}：${errorMessage}`, {
        position: 'bottom-right',
        autoClose: 5000, // 自动关闭时间
    });
};
