import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toZonedTime, format } from "date-fns-tz";
import { Calendar } from "@/components/ui/calendar";
import { zhCN } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTime } from "@/app/utils/util";

type DateTimePickerProps = {
  time_list: string[];
  timeChange: (value: string) => void;
};

// 此组件全部使用东八区时间，调用后端API时再转换成UTC时间
export const DateTimePicker = ({
  time_list,
  timeChange,
}: DateTimePickerProps) => {
  // console.log(time_list[0]);

  const handle_time_list = time_list?.map((time) => {
    const utcDate = new Date(time); // 解析 UTC 时间字符串
    return toZonedTime(utcDate, "+08:00"); // 转换为东八区时间
  });

  // console.log(handle_time_list[0]);

  const [selectedDateTime, setSelectedDateTime] = useState<Date>(); // 定义 selectedDateTime 状态

  const [filteredTimeList, setFilteredTimeList] = useState<Date[]>([]); // 定义 filteredTimeList 状态

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setFilteredTimeList([]); // 如果没有选定日期，清空时间列表
      return;
    }

    if (date) {
      setSelectedDateTime(date);

      const filteredTimes = handle_time_list.filter((time) => {
        return format(time, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
      });
      setFilteredTimeList(filteredTimes); // 使用 setFilteredTimeList 更新状态
    }
  };

  const handleTimeChange = (time: string) => {
    if (time) {
      const select_time = new Date(time);
      const newDateTime = selectedDateTime;
      newDateTime?.setHours(
        select_time.getHours(),
        select_time.getMinutes(),
        select_time.getSeconds()
      );
      setSelectedDateTime(newDateTime);

      timeChange(formatTime(newDateTime!));
    }
  };

  const minDate = new Date(handle_time_list[0]);
  const maxDate = new Date(handle_time_list[handle_time_list.length - 1]);

  // useEffect(() => {
  //   if (selectedDateTime) {
  //     console.log("selectedDateTime", selectedDateTime);

  //     const filteredTimes = handle_time_list.filter((time) => {
  //       return (
  //         format(time, "yyyy-MM-dd") === format(selectedDateTime, "yyyy-MM-dd")
  //       );
  //     });
  //     setFilteredTimeList(filteredTimes); // 使用 setFilteredTimeList 更新状态
  //   } else {

  //   }
  // }, [selectedDateTime]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !selectedDateTime && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDateTime ? (
            format(selectedDateTime, "yyyy-MM-dd HH:mm:ss")
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDateTime}
          onSelect={handleDateSelect}
          initialFocus
          locale={zhCN}
          defaultMonth={minDate}
          disabled={{ before: minDate, after: maxDate }}
        />
        <div className="border-t border-border p-3 ">
          <Select onValueChange={handleTimeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="请在上方选择日期" />
            </SelectTrigger>
            <SelectContent className="overflow-y-auto">
              {filteredTimeList.map((time) => (
                <SelectItem key={time.toString()} value={time.toString()}>
                  {format(time, "HH:mm:ss")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
};
