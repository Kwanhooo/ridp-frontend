import { Label } from "@/components/ui/label";

import { Dispatch, SetStateAction } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  selects: {
    label: string;
    options: string[];
    defaultValue: string;
    onChange: Dispatch<SetStateAction<string>>;
  }[];
  submit: () => void;
}

export default function ChartSetting({ selects, submit }: SelectOption) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-1">
      {selects.map((x) => (
        <div key={x.label}>
          <Select
            value={x.defaultValue}
            onValueChange={(value) => {
              submit();
              x.onChange(value);
            }}
          >
            <Label htmlFor={x.label}>{x.label}</Label>
            <SelectTrigger id={x.label}>
              <SelectValue placeholder="选择指标" />
            </SelectTrigger>
            <SelectContent position="popper">
              {x.options.map((option) => (
                <SelectItem value={option} key={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
