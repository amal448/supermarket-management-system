import type { Product } from "@/lib/types/product";
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

    // const handleEditProduct = (values: Record<string, any>) => {
    //     editProductMutation.mutate(values as Product); // 🎯 FIXED
    //     setOpen(false);
    // };
    // Clean data for the form (strings for number inputs)
    const cleanedData: Partial<ProductInput> | undefined = data
        ? {
            name: data.name,
            category: data.category as ProductInput["category"],
            unit: data.unit as ProductInput["unit"],
            brand: data.brand ?? "",
            costPrice: data.costPrice ?? 0,
            sellingPrice: data.sellingPrice ?? 0,
        }
        : undefined;
    return (
        <SheetForm<ProductInput >
            title="Edit Product"
            description="Update product details"
            fields={productFields}
            onSubmit={(values) => {
                // Convert numbers back for backend
                editProductMutation.mutate({
                    ...values,
                    costPrice: Number(values.costPrice),
                    sellingPrice: Number(values.sellingPrice),
                    _id: data?._id, // ensure _id is sent
                });
                setOpen(false);
            }}
            schema={ProductSchema}
            defaultValues={cleanedData}
            open={open}
            setOpen={setOpen}
        />
    );
}
