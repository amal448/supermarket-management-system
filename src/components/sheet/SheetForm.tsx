import React from "react";
import { useForm, Controller, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodSchema } from "zod";

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

// TYPES
export type SheetField = {
  name: string;
  label: string;
  defaultValue?: any;
  type?: "text" | "number" | "email" | "password" | "select" | "date";
  required?: boolean;
  options?: { value: string; label: string }[];
};

export type SheetFormProps<T extends FieldValues> = {
  title: string;
  description?: string;
  fields: SheetField[];
  onSubmit: (data: T) => void;
  triggerLabel?: string;
  open?: boolean;
  setOpen?: (val: boolean) => void;
  defaultValues?: Partial<T>;
  schema?: ZodSchema<any>;
  onFieldChange?: (name: string, value: any) => void;
  /** Called after parent async mutation succeeds  */
  onSuccess?: () => void;

  /** Only reset when fields change (dynamic forms) */
  resetOnFieldsChange?: boolean;
};

// --------------------------
// COMPONENT
// --------------------------
export function SheetForm<T extends FieldValues = FieldValues>({
  title,
  description,
  fields,
  onSubmit,
  triggerLabel,
  open: controlledOpen,
  setOpen: setControlledOpen,
  defaultValues,
  schema,
  resetOnFieldsChange,
  onFieldChange,
}: SheetFormProps<T>) {
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;

  const [open, setOpen] = React.useState(false);
  const finalOpen = isControlled ? controlledOpen : open;
  const finalSetOpen = isControlled ? setControlledOpen : setOpen;

  // --------------------------
  // React Hook Form
  // --------------------------
  const form = useForm<T>({
    resolver: schema ? (zodResolver(schema as any) as any) : undefined,
    defaultValues: defaultValues as any,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = form;

  // --------------------------
  // Reset form when sheet closes
  // --------------------------
  React.useEffect(() => {
    if (!finalOpen) {
      reset(defaultValues as any);
    }
  }, [finalOpen, reset, defaultValues]);

  // Reset when fields change (for dynamic forms like AddDiscount)
  React.useEffect(() => {
    if (resetOnFieldsChange) {
      const values: any = {};
      fields.forEach((f) => {
        values[f.name] = defaultValues?.[f.name] ?? "";
      });
      reset(values);
    }
  }, [fields, defaultValues, reset, resetOnFieldsChange]);

  // --------------------------
  // Submit (parent async runs mutation)
  // --------------------------
  const submitForm = (data: T) => {
    onSubmit(data);
  };

  return (
    <Sheet open={finalOpen} onOpenChange={finalSetOpen}>
      {triggerLabel && (
        <SheetTrigger asChild>
          <Button variant="outline" onClick={() => finalSetOpen(true)}>
            {triggerLabel}
          </Button>
        </SheetTrigger>
      )}

      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form
            id="sheet-form"
            onSubmit={handleSubmit(submitForm)}
            className="space-y-6 mt-4 px-2"
          >
            {fields.map((field) => (
              <div key={field.name} className="grid gap-2">
                <Label htmlFor={field.name}>{field.label}</Label>

                <Controller
                  control={control}
                  name={field.name as any}
                  render={({ field: rhfField }) => {
                    // Select
                    if (field.type === "select" && field.options) {
                      return (
                        <Select
                          value={rhfField.value ?? ""}
                          onValueChange={(val) => {
                            rhfField.onChange(val);
                            onFieldChange?.(field.name, val);
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
                      );
                    }

                    // Input
                    return (
                      <Input
                        {...rhfField}
                        type={field.type ?? "text"}
                        value={rhfField.value ?? ""}
                        onChange={(e) => {
                          rhfField.onChange(e);
                          onFieldChange?.(field.name, e.target.value);
                        }}
                      />
                    );
                  }}
                />

                {errors[field.name as keyof T] && (
                  <p className="text-red-500 text-sm">
                    {(errors[field.name as keyof T] as any)?.message}
                  </p>
                )}
              </div>
            ))}

            <SheetFooter className="border-t pt-4 mt-2 bg-white">
              <Button type="submit" form="sheet-form">
                Save
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
