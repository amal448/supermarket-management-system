import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SheetField = {
  name: string;
  label: string;
  defaultValue?: string;
  type?: "text" | "number" | "email" | "password" | "select" | "date";
  required?: boolean;
  options?: { value: string; label: string }[];
};

export type SheetFormProps<T = Record<string, any>> = {
  title: string;
  description?: string;
  fields: SheetField[];
  onSubmit: (data: T) => void;
  triggerLabel?: string;
  open?: boolean;
  setOpen?: (val: boolean) => void;
  defaultValues?: T;
  onFieldChange?: (name: string, value: string) => void;

};

export function SheetForm<T = Record<string, any>>({
  title,
  description,
  fields,
  onSubmit,
  triggerLabel,
  open: controlledOpen,
  setOpen: setControlledOpen,
  defaultValues,
  onFieldChange,

}: SheetFormProps<T>) {
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;

  const [open, setOpen] = React.useState(false);
  const finalOpen = isControlled ? controlledOpen : open;
  const finalSetOpen = isControlled ? setControlledOpen : setOpen;

  const initialFormData: Record<string, any> = fields.reduce(
    (acc, f) => ({ ...acc, [f.name]: f.defaultValue ?? "" }),
    {}
  );

  const [formData, setFormData] = React.useState<Record<string, any>>(initialFormData);

  // Update formData when defaultValues change (for edit)
  useEffect(() => {
    if (defaultValues) {
      setFormData({ ...initialFormData, ...defaultValues });
    }
  }, [defaultValues]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getFieldValue = (name: string) => formData[name] ?? "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as T);
    finalSetOpen(false);
  };

  return (
    <Sheet open={finalOpen} onOpenChange={finalSetOpen}>
      {!isControlled && triggerLabel && (
        <SheetTrigger asChild>
          <Button variant="outline">{triggerLabel}</Button>
        </SheetTrigger>
      )}

      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="space-y-4 mt-4 overflow-y-auto pr-2">
          <form className="grid gap-6 px-4" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.name} className="grid gap-2">
                <Label htmlFor={field.name}>{field.label}</Label>

                {field.type === "select" && field.options ? (
                  <Select
                    value={getFieldValue(field.name)}
                    onValueChange={(val) => {
                      handleChange(field.name, val);
                      onFieldChange?.(field.name, val); // notify parent
                    }}
                  >

                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {field.options.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type ?? "text"}
                    value={getFieldValue(field.name)}
                    required={field.required}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}

            <SheetFooter className="mt-4 flex justify-end gap-2">
              <Button type="submit">Save</Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
