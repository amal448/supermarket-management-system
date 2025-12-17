import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";
import { useManagerMutation } from "@/hooks/useManager";
import { useBranches } from "@/hooks/useBranches";


export type Manager = {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    branchId: string;
};

const managerFields = [
    { name: "username", label: "Username", required: true },
    { name: "email", label: "Email", required: true, type: "email" },
    { name: "password", label: "Password", type: "password" },
    { name: "role", label: "Role", required: true },
    { name: "branchId", label: "Branch ID" },
];

export function EditManager({
    open,
    setOpen,
    data,
}: {
    open: boolean;
    setOpen: (val: boolean) => void;
    data: any | null;   // receives manager row from table (likely contains _id)
}) {
    const { updateUserMutation } = useManagerMutation();
    const { branchesQuery } = useBranches();
    console.log("branchesQuery",branchesQuery.data);
    
    const [formData, setFormData] = React.useState<Manager>({
        id: "",
        username: "",
        email: "",
        password: "",
        role: "",
        branchId: ""
    });

    // ✅ Convert _id → id when the data is received
    React.useEffect(() => {
        if (data) {
            const { _id, ...rest } = data;
            setFormData({
                id: _id,     // 🔥 backend wants id
                ...rest,
            });
        }
    }, [data]);

    const handleChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserMutation.mutate(formData); // now includes id
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Manager</SheetTitle>
                    <SheetDescription>Update manager details</SheetDescription>
                </SheetHeader>

                <form className="space-y-4 mt-4 px-4" onSubmit={handleSubmit}>
                    {managerFields.map((field) => (
                        <div key={field.name} className="grid gap-2">
                            <Label htmlFor={field.name}>{field.label}</Label>

                            <Input
                                id={field.name}
                                type={field.type || "text"}
                                value={formData[field.name as keyof Manager] || ""}
                                required={field.required}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                            />
                        </div>
                    ))}

                    <SheetFooter className="flex justify-end gap-2 mt-4">
                        <Button type="submit">Save</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
