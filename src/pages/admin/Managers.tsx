import { useState } from "react";
import ViewItems from "@/components/tanstacktable/page";
import { managerColumns } from "@/components/tanstacktable/managerColumns";
import { AddUser } from "@/components/sheet/AddUser";
import { EditManager } from "@/components/sheet/EditManager";
import { useManagerMutation } from "@/hooks/useManager";
import type { Manager } from "@/components/tanstacktable/managerColumns";

const Managers = () => {
  
  const { managersQuery,deleteUserMutation } = useManagerMutation();

  const [editOpen, setEditOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  if (managersQuery.isLoading) return <p>Loading managers...</p>;
  if (managersQuery.isError) return <p>Error loading data</p>;

  // Handler for edit button
  const handleEdit = (manager: Manager) => {
    setSelectedManager(manager);
    setEditOpen(true);
  };

  // Handler for delete button
  const handleDelete = (manager: Manager) => {
    // Pass unique identifier to delete mutation
    
    deleteUserMutation.mutate(manager); // or manager.id if you have one
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Managers List</h1>
          <p className="text-muted-foreground">Manage your staff accounts</p>
        </div>
        <AddUser />
      </div>

      <ViewItems
        items={managersQuery.data ?? []}
        columns={managerColumns(handleEdit, handleDelete)}
      />

      {/* EDIT SHEET */}
      <EditManager
        open={editOpen}
        setOpen={setEditOpen}
        data={selectedManager}
      />
    </div>
  );
};

export default Managers;
