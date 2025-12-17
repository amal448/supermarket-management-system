import { Button } from "@/components/ui/button"
import {
    Dialog,
    // DialogClose,
    DialogContent,
    // DialogDescription,
    DialogFooter,
    // DialogHeader,
    // DialogTitle,
    // DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUsers } from "@/hooks/useUsers"

export function EditUser({
    open,
    setOpen,
    data,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
    data: any;
}) {

    if (!data) return null; // do not render until user clicks Edit
    const { updateUserMutation } = useUsers();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement);

        const payload = {
            id: data._id,
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
            role: formData.get("role"),
        };

        updateUserMutation.mutate(payload);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <form onSubmit={handleSubmit} className="grid gap-4">

                    <Label>Name</Label>
                    <Input name="username" defaultValue={data.username} />

                    <Label>Email</Label>
                    <Input name="email" defaultValue={data.email} />

                    <Label>Password</Label>
                    <Input name="password" type="password" defaultValue="" />

                    <Label>Role</Label>
                    <select name="role" defaultValue={data.role}>
                        <option value="cashier">Cashier</option>
                        <option value="staff">Staff</option>
                    </select>

                    <DialogFooter>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

