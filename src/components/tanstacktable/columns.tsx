// src/views/columns.tsx
import { Button } from "@/components/ui/button";

export const columns = () => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: any) => {
      const name = row.original.name;
      const image = row.original.image;

      return (
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={name}
            className="w-10 h-10 rounded-md object-cover border"
          />
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "shop",
    header: "Shop",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }: any) => `₹${row.original.price}`,
  },
  {
    accessorKey: "foodType",
    header: "Veg/Non-Veg",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => {
      const food = row.original;

      const handleDelete = () => {
        alert(`Delete clicked for ${food.name}`);
      };

      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-blue-500 text-white" size="sm" onClick={handleDelete}>
            Edit
          </Button>

          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      );
    },
  },
];
