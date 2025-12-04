import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "../DatePicker"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDiscount } from "@/hooks/useDiscount"
import type { DiscountEntity } from "@/lib/types/discount"

export function EditDiscount({
    open,
    setOpen,
    data,
    filteredTag
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
    data: DiscountEntity | null;
    filteredTag: string[];
}) {

    if (!data) return null; // do not render until user clicks Edit
    const { editDiscountMutation } = useDiscount();
    console.log("filtered", filteredTag);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement);

        const payload = {
            id: data.id,
            name: formData.get("name") as string,
            type: formData.get("type") as any,
            buyQty: data.buyQty,
            getQty: data.getQty,
            percentage: Number(formData.get("value")),
            startDate: new Date(formData.get("startDate") as string),
            endDate: new Date(formData.get("endDate") as string),
            isActive: formData.get("active") === "true",
            productId: data.productId,
        };

        editDiscountMutation.mutate(payload);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <form onSubmit={handleSubmit} className="grid gap-4">

                    <Label>Offer Name</Label>
                    <Input name="name" defaultValue={data.name} />

                    <Label> Discount Value</Label>
                    <Input name="value" defaultValue={data.percentage} />


                    <Label>Offer Type</Label>
                    <Select name="type" defaultValue={data.type}>

                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredTag.map(tag => (
                                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                            ))}


                        </SelectContent>
                    </Select>
                    <DatePicker
                        label="Start Date"
                        name="startDate"
                        defaultValue={new Date(data.startDate)}
                        onChange={(d) => console.log("startDate", d)}
                    />

                    <DatePicker
                        label="End Date"
                        name="endDate"
                        defaultValue={new Date(data.endDate)}
                        onChange={(d) => console.log("endDate", d)}
                    />
                    <DialogFooter>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

