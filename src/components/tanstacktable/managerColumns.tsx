import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";


export type Manager = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  branchId: string;
};

export const managerColumns = (
  handleEdit: (manager: Manager) => void,
  handleDelete: (manager: Manager) => void
): ColumnDef<Manager>[] => [
    { accessorKey: "username", header: "Username" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    {
      accessorKey: "isActive",
      header: "Active Status",
      cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
    },
    {
      accessorKey: "branchId",
      header: "Branch ID",
      cell: ({ row }) =>
        row.original.branchId ? row.original.branchId : "Not Assigned",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const manager = row.original;
        
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-blue-500 text-white"
              size="sm"
              onClick={() => handleEdit(manager)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(manager)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
