import type { ColumnDef } from "@tanstack/react-table";



export type Transaction = {
    _id: string;
    cashierId: string;
    subtotal: string;
    productDiscount: string;
    cartDiscount: string;
    totalDiscount: string;
    finalAmount: string;
    status: string;
    paymentMode: string;
    date: string;
};

export const EachSalesDetailColumns = (): ColumnDef<Transaction>[] => [
    { accessorKey: "_id", header: "SalesId" },
    { accessorKey: "cashierId", header: "CashierId" },
    { accessorKey: "subtotal", header: "Subtotal" },
    { accessorKey: "productDiscount", header: "ProductDiscount" },
    { accessorKey: "cartDiscount", header: "CartDiscount" },
    { accessorKey: "totalDiscount", header: "TotalDiscount" },
    { accessorKey: "finalAmount", header: "FinalAmount" },
    { accessorKey: "paymentMode", header: "PaymentMode" },
    { accessorKey: "status", header: "Status" },
    // {
    //     id: "actions",
    //     header: "Actions",
    //     cell: ({ row }) => {
    //         const sale = row.original;
    //         console.log(sale._id);

    //         return (
    //             <div className="flex items-center gap-2">
    //                 <Button
    //                     variant="outline"
    //                     className="bg-blue-500 text-white"
    //                     size="sm"
    //                     onClick={() =>
    //                         //  navigate(`/${sale.id}`)
    //                         navigate(`/manager/transactions/${sale._id}`)

    //                     }
    //                 >
    //                     View
    //                 </Button>

    //             </div>
    //         );
    //     },
    // },
];
