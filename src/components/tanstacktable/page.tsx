// src/components/tanstacktable/ViewItems.tsx
import { DataTable } from "./data-table";

type ViewItemsProps = {
  items: any[];
  columns: any[];
};  

export default function ViewItems({ items, columns }: ViewItemsProps) {

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={items} />
    </div>
  );
}
