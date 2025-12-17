export type Period = "daily" | "monthly" | "yearly";

export type SalesAnalysisItem = {
  _id: { year: number; month?: number; day?: number };
  actualProfit: number;
  expectedProfit: number;
  totalDiscount: number;
  totalRevenue: number;
};

export type SalesAnalysisResponse = {
  data: SalesAnalysisItem[];
  total: {
    actualProfit: number;
    expectedProfit: number;
    totalDiscount: number;
    totalRevenue: number;
  };
};
