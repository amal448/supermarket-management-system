import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import type { NavigateFunction } from "react-router-dom";



export type Transaction = {
    _id: string;
    cashierId:string;
    paymentMode: string;
    status: string;
    subtotal: string;
    totalDiscount: string;
    finalAmount: string;
};

export const BranchSalesColumns = ( navigate: NavigateFunction): ColumnDef<Transaction>[] => [
        { accessorKey: "cashierId", header: "CashierId" },
        { accessorKey: "_id", header: "SalesId" },
        { accessorKey: "paymentMode", header: "PaymentMode" },
        { accessorKey: "status", header: "Status" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const sale = row.original;
                console.log(sale._id);
                
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="bg-blue-500 text-white"
                            size="sm"
                            onClick={() =>
                                //  navigate(`/${sale.id}`)
                               navigate(`/manager/transactions/${sale._id}`)

                                }
                        >
                            View
                        </Button>

                    </div>
                );
            },
        },
    ];
