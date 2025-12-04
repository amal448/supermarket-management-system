export interface Product {
  _id?: string
  name: string;
  sku: string;
  category: string;
  unit: string;         // kg, g, pcs
  brand?: string;
  costPrice: number;
  sellingPrice: number;
  createdBy?: string
};
export interface BranchProduct {
  _id: string;
  branchId: string;
  name: string;
  sku: string;
  category: string;
  sellingPrice: number;   // FIX
  unit: string;
  product: Product;
  stock: number;
  requiredLevel: number;
  isLowStock: boolean;
  isRequested: boolean;
  inBranch: boolean;
  isOutOfStock: boolean;
  requestedQty: boolean
}