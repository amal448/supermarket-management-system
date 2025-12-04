import type { ColumnDef } from "@tanstack/react-table";
import type { BranchProduct } from "@/lib/types/product";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const stockColumns = ({
  selectedItems,
  handleSelectProduct,
  handleQuantityChange,
}: any): ColumnDef<BranchProduct>[] => [
  {
    id: "select",
    header: "",
    cell: ({ row }) => {
      const p = row.original;
      return (
        <Checkbox
          checked={selectedItems.has(p._id)}
          onCheckedChange={() => handleSelectProduct(p)}
        />
      );
    },
  },

  {
    accessorKey: "name",
    header: "Product",
  },

  {
    accessorKey: "sku",
    header: "SKU",
  },

  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const p = row.original;

      if (p.isRequested)
        return <Badge variant="outline" className="bg-yellow-100">🟡 Requested</Badge>;

      if (p.stock > 0)
        return <Badge variant="outline" className="bg-green-100">🟢 In Stock</Badge>;

      return <Badge variant="outline" className="bg-red-100">🔴 Out of Stock</Badge>;
    },
  },

  {
    accessorKey: "stock",
    header: "Current Stock",
  },

  {
    accessorKey: "requiredLevel",
    header: "Min Level",
  },

{
  id: "qty",
  header: "Request Qty",
  cell: ({ row }) => {
    const p = row.original;

    // Already requested → show requested quantity (no input box)
    if (p.isRequested) {
      return (
        <span className="text-blue-600 font-semibold">
          {p.requestedQty}
        </span>
      );
    }

    // Not selected → show "-"
    if (!selectedItems.has(p._id)) return "-";

    // Show input field
    return (
      <Input
        type="number"
        value={selectedItems.get(p._id)}
        onChange={(e) =>
          handleQuantityChange(p._id, Number(e.target.value) || 1)
        }
        className="w-20"
      />
    );
  },
},

];
