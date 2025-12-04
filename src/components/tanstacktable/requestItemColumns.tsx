import type { ColumnDef } from "@tanstack/react-table";
import type { RestockRequestItem } from "@/lib/types/restock";
import { Button } from "../ui/button";

export function stockRequestItemColumns({
  selectedItems,
  handleSelectProduct,
  handleItemQuantityChange,
  handleApproveItem,
  handleRejectItem
}: {
  selectedItems: Map<string, number>;
  handleSelectProduct: (item: RestockRequestItem) => void;
  handleItemQuantityChange: (requestItemId: string, qty: number) => void;
  handleApproveItem: (item: RestockRequestItem) => void;
  handleRejectItem: (item: RestockRequestItem) => void;
}): ColumnDef<RestockRequestItem>[] {
  return [
    {
      header: "Select",
      cell: ({ row }) => {
        const item = row.original;
        const checked = selectedItems.has(item.requestItemId);
        const disabled = item.status === "APPROVED" || item.status === "REJECTED";

        return (
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={() => handleSelectProduct(item)}
          />
        );
      },
    },
    {
      accessorKey: "product.name",
      header: "Product Name",
    },
    {
      accessorKey: "product.brand",
      header: "Brand",
    },
    {
      accessorKey: "product.category",
      header: "Category",
    },
    {
      accessorKey: "requestedQty",
      header: "Requested Qty",
    },
    {
      header: "Approved Qty",
      cell: ({ row }) => {
        const item = row.original;
        const disabled = item.status === "APPROVED" || item.status === "REJECTED";
        const value = selectedItems.get(item.requestItemId) ?? item.approvedQty ?? 0;

        return (
          <input
            type="number"
            value={value}
            min={0}
            disabled={disabled}
            onChange={(e) =>
              handleItemQuantityChange(item.requestItemId, Number(e.target.value))
            }
            className={`border p-1 w-20 ${disabled ? "bg-gray-200 cursor-not-allowed" : ""}`}
          />
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        const disabled = item.status === "APPROVED" || item.status === "REJECTED";

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              className={disabled ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-green-500 text-white"}
              onClick={() => handleApproveItem(item)}
            >
              Approve
            </Button>

            <Button
              variant="destructive"
              size="sm"
              disabled={disabled}
              className={disabled ? "bg-gray-400 text-gray-200 cursor-not-allowed" : ""}
              onClick={() => handleRejectItem(item)}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];
}
