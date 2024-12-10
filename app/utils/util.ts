export const OFFSET = 8; // 东八区

export const formatTime = (time: string | Date): string => {
  // Fri, 01 Nov 2024 07:44:35 GMT to 2024-11-01 13:25:16

  const date = time instanceof Date ? time : new Date(time);
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hour = date.getUTCHours().toString().padStart(2, "0");
  const minute = date.getUTCMinutes().toString().padStart(2, "0");
  const second = date.getUTCSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// 如果其中一个参数为空字符串或者undefined，则返回false
// 只有所有参数全部不为空字符串和undefined时，才返回true
export function checkParameters(...args: (string | undefined)[]): boolean {
  return !args.some((arg) => arg === undefined || arg === "");
}
