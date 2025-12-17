import { useState } from "react";
import { SheetForm, type SheetField } from "./SheetForm";
import { useInventory } from "@/hooks/useInventory";
import { ProductSchema, type ProductInput } from "@/lib/validation/addProductValidation";

const productFields: SheetField[] = [
  { name: "name", label: "Product Name", required: true },
  {
    name: "category",
    label: "Category",
    required: true,
    type: "select",
    options: [
      { value: "electronics", label: "Electronics" },
      { value: "grocery", label: "Grocery" },
      { value: "clothing", label: "Clothing" },
      { value: "stationery", label: "Stationery" },
    ],
  },
  {
    name: "unit",
    label: "Unit",
    required: true,
    type: "select",
    options: [
      { value: "pcs", label: "Pieces" },
      { value: "kg", label: "Kg" },
      { value: "litre", label: "Litre" },
      { value: "pack", label: "Pack" },
    ],
  },
  { name: "brand", label: "Brand", required: true },
  { name: "costPrice", label: "Cost Price", type: "number", required: true },
  { name: "sellingPrice", label: "Selling Price", type: "number", required: true },
];

export function AddInventory() {
  const { addProductMutation } = useInventory();
  const [open, setOpen] = useState(false);

  const handleAddProduct = (data: ProductInput) => {
    addProductMutation.mutate(data, { onSuccess: () => setOpen(false) });
  };

  return (
    <SheetForm<ProductInput>
      title="Add Product"
      description="Fill in the product details"
      fields={productFields}
      onSubmit={handleAddProduct}
      triggerLabel="Add Product"
      schema={ProductSchema}
      open={open}
      setOpen={setOpen}
    />
  );
}
