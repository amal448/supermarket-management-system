import { SheetForm, type SheetField } from "./SheetForm";
import { useDiscount } from "@/hooks/useDiscount";
import { useInventory } from "@/hooks/useInventory";
import { useState } from "react";
import type { DiscountEntity } from "@/lib/types/discount";

export function AddDiscount() {
    const { addDiscountMutation } = useDiscount();
    const { productsQuery } = useInventory();

    const [selectedType, setSelectedType] = useState<string>("");
    const products = productsQuery.data?.data ?? [];
    const productOptions = products.map((p:any) => ({
        value: p._id!,
        label: p.name,
    }));

    // 🎯 Rebuild fields dynamically
    const baseFields: SheetField[] = [
        { name: "name", label: "Discount Name", required: true },

        {
            name: "productId",
            label: "Discount Product",
            required: true,
            type: "select",
            options: productOptions,
        },

        {
            name: "type",
            label: "Discount Type",
            required: true,
            type: "select",
            options: [
                { value: "BUY_X_GET_Y", label: "BUY_X_GET_Y" },
                { value: "PRODUCT_PERCENTAGE", label: "PRODUCT_PERCENTAGE" },
                { value: "CART_PERCENTAGE", label: "CART_PERCENTAGE" },
            ],
        },
    ];

    let dynamicFields: SheetField[] = [];

    if (selectedType === "BUY_X_GET_Y") {
        dynamicFields = [
            { name: "buyQty", label: "Buy Qty", type: "number", required: true },
            { name: "getQty", label: "Get Qty", type: "number", required: true },
        ];
    }

    if (selectedType === "PRODUCT_PERCENTAGE") {
        dynamicFields = [
            { name: "percentage", label: "Discount %", type: "number", required: true },
        ];
    }

    if (selectedType === "CART_PERCENTAGE") {
        dynamicFields = [
            {
                name: "minPurchaseAmountPaise",
                label: "Min Purchase Amount (Paise)",
                type: "number",
                required: true,
            },
            { name: "percentage", label: "Discount %", type: "number", required: true },
        ];
    }

    const dateFields: SheetField[] = [
        { name: "startDate", label: "Start Date", type: "date", required: true },
        { name: "endDate", label: "End Date", type: "date", required: true },
    ];

    // 👇 FINAL FIELDS
    const discountFields = [...baseFields, ...dynamicFields, ...dateFields];

    const handleAddDiscount = (data: DiscountEntity) => {
        addDiscountMutation.mutate(data);
    };

    return (
        <SheetForm
            title="Add Discount"
            description="Fill in the Discount details"
            fields={discountFields}
            onSubmit={handleAddDiscount}
            triggerLabel="Add Discount"
            resetOnFieldsChange={true} // Only here we reset
            onFieldChange={(name, value) => {
                if (name === "type") setSelectedType(value);
            }}
        />

    );
}
