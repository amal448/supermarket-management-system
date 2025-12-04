import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/lib/types/product";
import { Button } from "../ui/button";
import { EditUser } from "../sheet/EditUser";
import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
// import { EditUser } from "../sheet/EditUser";

export const staffColumns = (): ColumnDef<Product>[] => [
  { accessorKey: "username", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "password", header: "Password" },
  { accessorKey: "role", header: "Role" },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const [selectedUser, setSelectedUser] = useState<Product | null>(null);
      const { deleteUserMutation } = useUsers();
      
      return (
        <>
          <div className="flex gap-2">

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedUser(row.original); // set selected row
                setOpen(true);                 // open dialog
              }}
            >
              Edit
            </Button>
            <Button onClick={() => deleteUserMutation.mutate(row.original._id)} variant="destructive" size="sm">
              Delete
            </Button>
          </div>
          <EditUser open={open} setOpen={setOpen} data={selectedUser} />
        </>
      );
    },
  },
];
