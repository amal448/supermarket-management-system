import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/lib/types/product";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { EditInventory } from "../sheet/EditInventory";
import { useInventory } from "@/hooks/useInventory";

export const productColumns = (role: string): ColumnDef<Product>[] => [
  { accessorKey: "name", header: "Product Name" },
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "unit", header: "Unit" },
  { accessorKey: "brand", header: "Brand" },

  {
    accessorKey: "costPrice",
    header: "Cost Price",
    cell: ({ row }) => <Badge variant="secondary">₹ {row.original.costPrice}</Badge>,
  },

  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
    cell: ({ row }) => <Badge className="bg-green-500">₹ {row.original.sellingPrice}</Badge>,
  },

  ...(role === "admin"
    ? [
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => {
            const product = row.original;
            const [open, setOpen] = useState(false);
            const [selected, setSelected] = useState<Product | null>(null);
            const { deleteProductMutation } = useInventory();

            return (
              <>
                <div className="flex items-center gap-2">
                  {/* EDIT BUTTON */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelected(product);
                      setOpen(true); // triggers the sheet
                    }}
                  >
                    Edit
                  </Button>

                  {/* DELETE BUTTON */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProductMutation.mutate(product)}
                  >
                    Delete
                  </Button>
                </div>

                {/* EDIT SHEET COMPONENT */}
                <EditInventory open={open} setOpen={setOpen} data={selected} />
              </>
            );
          },
        } satisfies ColumnDef<Product>,
      ]
    : []),
];
