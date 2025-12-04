import type { ColumnDef } from "@tanstack/react-table";


export type Transaction = {
  id: string;
  paymentMode: string;
  status: string;
  subtotal: string;
  totalDiscount: string;
  branchId: string;
  finalAmount: string;
};

export const CashierColumns = (
): ColumnDef<Transaction>[] => [
    { accessorKey: "branchId", header: "BranchId" },
    { accessorKey: "_id", header: "SalesId" },
    { accessorKey: "paymentMode", header: "PaymentMode" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "subtotal", header: "Subtotal" },
    { accessorKey: "totalDiscount", header: "TotalDiscount" },
    { accessorKey: "finalAmount", header: "FinalAmount" },
    
  ];
