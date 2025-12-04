import type { Product } from "@/lib/types/product";
import { SheetForm, type SheetField } from "./SheetForm";
import { useInventory } from "@/hooks/useInventory";

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

export function EditInventory({
    open,
    setOpen,
    data,
}: {
    open: boolean;
    setOpen: (val: boolean) => void;
    data: Product | null;
}) {
    const { editProductMutation } = useInventory();

    const handleEditProduct = (values: Record<string, any>) => {
        editProductMutation.mutate(values as Product); // 🎯 FIXED
        setOpen(false);
    };

    return (
        <SheetForm
            title="Edit Product"
            description="Update product details"
            fields={productFields}
            onSubmit={handleEditProduct}
            defaultValues={data || undefined}
            open={open}
            setOpen={setOpen}
        />
    );
}
