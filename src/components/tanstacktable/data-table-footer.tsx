// src/components/tanstacktable/data-table-footer.tsx

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type TotalRecord = Record<string, number | string>;

type DataTableProps<TData> = {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    total?: TotalRecord; // optional, safe
};

export function DataTableWithFooter<TData>({
    columns,
    data,
    total = {}, // default to empty object
}: DataTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const headerGroup = table.getHeaderGroups()[0];

    return (
        <div className="overflow-hidden rounded-md border cursor-pointer">
            <Table>
                {/* HEADER */}
                <TableHeader>
                    <TableRow>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                {/* BODY */}
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center h-24">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>

                {/* FOOTER */}
                <TableFooter>
                    <TableRow>
                        {headerGroup.headers.map((header) => {
                            // Safely get accessorKey if it exists
                            const accessor = (header.column.columnDef as any)?.accessorKey as
                                | keyof TData
                                | undefined;

                            let footerValue: string | number = "";

                            if (accessor && total[String(accessor)] !== undefined) {
                                // Cast to string when indexing total
                                footerValue = total[String(accessor)]!;
                            } else if (header.column.id && header.column.id === "date") {
                                footerValue = "Total";
                            }

                            return (
                                <TableCell key={header.id} className="font-bold">
                                    {footerValue}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableFooter>

            </Table>
        </div>
    );
}
