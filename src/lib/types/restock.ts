export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  brand: string;
  costPrice: number;
  sellingPrice: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RestockRequestItem {
  requestItemId: string;
  productId?: string;
  requestedQty: number;
  approvedQty: number;
  status: string;
  product: Product;
}

export interface Branch {
  _id: string;
  name: string;
  location?: string;
  managerId?: string;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface RestockRequest {
  _id: string;
  requestedBy: string;
  status: string;
  createdAt: string;
  branch?: Branch;      // for single request
  branchId?: string;    // for list endpoint
  branchName?: string;  // for list endpoint
  items: RestockRequestItem[];
  manager?: Manager;
}

// src/lib/types/restock.ts
export type RestockRequestPayload = {
  items: {
    productId: string;
    requestedQty: number;
    status?: string;
  }[];
};
