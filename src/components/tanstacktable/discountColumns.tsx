import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { useState } from "react";
// import { EditUser } from "../sheet/EditUser";
import type { DiscountEntity } from "@/lib/types/discount";
import { EditDiscount } from "../sheet/EditDiscount";
import { useDiscount } from "@/hooks/useDiscount";

export const DiscountColumns = ({ discountTag
}: {
    discountTag: string[];
}): ColumnDef<DiscountEntity>[] => [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "type", header: "Offer Type" },

        {
            id: "product",
            header: "Product",
            cell: ({ row }) => {
                const d = row.original;

                if (d.type === "BUY_X_GET_Y" || d.type === "PRODUCT_PERCENTAGE")
                    return d.productId ?? "—";

                return "—"; // no product for cart-level discounts
            }
        },

        {
            id: "value",
            header: "Value",
            cell: ({ row }) => {
                const d = row.original;

                switch (d.type) {
                    case "BUY_X_GET_Y":
                        return `Buy ${d.buyQty} Get ${d.getQty}`;
                    case "PRODUCT_PERCENTAGE":
                    case "CART_PERCENTAGE":
                        return `${d.percentage}%`;

                    default:
                        return "—";
                }
            }
        },

        {
            accessorKey: "startDate",
            header: "Start Date",
            cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
        },
        {
            accessorKey: "endDate",
            header: "End Date",
            cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
        },

        {
            id: "actions",
            cell: ({ row }) => {
                const [open, setOpen] = useState(false);
                const [selected, setSelected] = useState<DiscountEntity | null>(null);
                const { deleteDiscountMutation } = useDiscount();

                const discountItem=row.original
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelected(row.original);
                                setOpen(true);
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteDiscountMutation.mutate(discountItem.id!)}
                        // adjust delete function as needed
                        >
                            Delete
                        </Button>
                        <EditDiscount open={open} setOpen={setOpen} data={selected} filteredTag={discountTag} />
                    </div>
                );
            },
        },
    ];

