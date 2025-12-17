import { DataTableWithFooter } from "./data-table-footer";

type ViewItemsProps = {
  items: any[];
  columns: any[];
  totalData: any;
};

export default function ViewTableItems({ items, totalData, columns }: ViewItemsProps) {
  return (
    <div className="">
      <DataTableWithFooter columns={columns} data={items} total={totalData} />
    </div>
  );
}
