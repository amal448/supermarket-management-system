import type { ColumnDef } from "@tanstack/react-table";

export type ShowTotalAnalysis = {
  date: string;
  actualProfit: number;
  expectedProfit: number;
  totalDiscount: number;
  totalRevenue: number;
  inHand: number;
  shortage: number;
};

export const BranchSalesAnalysisColumns = (): ColumnDef<ShowTotalAnalysis>[] => [
  {
    accessorKey: "date",
    header: "Date",
  },
   {
    accessorKey: "expectedProfit",
    header: "Profit Estimate",
  },
  {
    accessorKey: "actualProfit",
    header: "Profit After Discount",
  },
 
  {
    accessorKey: "totalDiscount",
    header: "Total Discount",
  },
  {
    accessorKey: "totalRevenue",
    header: "Total Revenue",
  },
  {
    accessorKey: "inHand",
    header: "In Hand",
  },
  {
    accessorKey: "shortage",
    header: "Shortage",
  },
];
