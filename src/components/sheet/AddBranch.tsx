import { SheetForm, type SheetField } from "./SheetForm";
import { useBranches } from "@/hooks/useBranches";
import { useManagerMutation } from "@/hooks/useManager";
import type { AddBranchInput } from "@/lib/validation/addBranchValidation";
import { addBranchSchema } from "@/lib/validation/addBranchValidation";

export function AddBranch() {
  const { managersQuery } = useManagerMutation()
  const { addBranchMutation } = useBranches();


  const managerOptions =
    managersQuery.data?.map((m) => ({
      value: m._id ?? "",   // 🔥 ensures always string
      label: m.username,
    })) ?? [];


  const branchFields: SheetField[] = [
    { name: "name", label: "Branch Name", required: true },
    { name: "location", label: "Location" },
    {
      name: "managerId",
      label: "Manager",
      type: "select",
      required: true,
      options: managerOptions,
    },
  ];

  const handleAddBranch = (data: Record<string, any>) => {
    // call BranchService.create here
    addBranchMutation.mutate(data)
  };

  return (
    <SheetForm<AddBranchInput>
      title="Add Branch"
      description="Fill in the branch details"
      fields={branchFields}
      onSubmit={handleAddBranch}
      triggerLabel="Add Branch"
      schema={addBranchSchema}
      defaultValues={{
        name: "",
        location: "",
        managerId:"",
      }}
    />
  );
}
