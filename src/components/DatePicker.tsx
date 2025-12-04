"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function DatePicker({
  label,
  name,
  defaultValue,
  onChange,
}: {
  label: string;
  name: string;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : undefined
  );
  const [month, setMonth] = React.useState<Date | undefined>(defaultValue);
  const [value, setValue] = React.useState(formatDate(defaultValue));

  return (
    <div className="flex flex-col gap-3 w-full">
      <Label>{label}</Label>

      <div className="relative flex gap-2 w-full">
        <Input
          name={name}
          value={value}
          readOnly
          placeholder="Select date"
          className="bg-background pr-10 cursor-pointer"
          onClick={() => setOpen(true)}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="end" sideOffset={10}>
            <Calendar
              mode="single"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={(d) => {
                if (!d) return;
                setDate(d);
                setValue(formatDate(d));
                onChange?.(d);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
