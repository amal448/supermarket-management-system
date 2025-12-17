import { useUsers } from "@/hooks/useUsers";
import { SheetForm, type SheetField } from "./SheetForm";
import { useAuth } from "@/app/providers/AuthProvider";
import { useManagerMutation } from "@/hooks/useManager";
import { userSchema, type UserSchemaType } from "@/lib/validation/userValidation";

export function AddUser() {
  const { user } = useAuth();

  let addUserMutation: { mutate: (data: UserSchemaType) => void };

  if (user?.role === "admin") {
    ({ addUserMutation } = useManagerMutation());
  } else if (user?.role === "manager") {
    ({ addUserMutation } = useUsers());
  } else {
    throw new Error("Unauthorized role");
  }

  const roleOptions = getRoleOptions(user?.role as string);

  const fields: SheetField[] = [
    { name: "username", label: "User Name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      options: roleOptions,
    },
  ];

  const handleAddUser = (data: UserSchemaType) => {
    addUserMutation.mutate(data);
  };

  return (
    <SheetForm<UserSchemaType>
      title="Add User"
      description="Fill in the user details"
      fields={fields}
      onSubmit={handleAddUser}
      triggerLabel="Add User"
      schema={userSchema}
      defaultValues={{
        username: "",
        email: "",
        password: "",
        role: roleOptions.length > 0 ? roleOptions[0].value : "",
      }}
    />
  );
}

function getRoleOptions(currentRole: string) {
  if (currentRole === "admin") {
    return [{ value: "manager", label: "Manager" }];
  }
  if (currentRole === "manager") {
    return [
      { value: "cashier", label: "Cashier" },
      { value: "staff", label: "Staff" },
    ];
  }
  return [];
}
