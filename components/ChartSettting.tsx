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
    <div className="flex flex-row space-x-2">
      {selects.map((x) => (
        <Select
          key={x.label}
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
      ))}
    </div>
  );
}
