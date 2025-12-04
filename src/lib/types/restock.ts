export interface RestockRequestItem {
  _id?: string;
  productId: string;
  requestedQty: number;
  approvedQty?: number;
  status: string;
  requestId: string;
  requestItemId: string;
  product?: any; // optional, for embedded product details
}

export interface RestockRequest {
  _id: string;
  branchId: string;
  branchName: string;
  requestedBy: string;
  status: string;
  createdAt: string;
  notes?: string;
  items: RestockRequestItem[];
  manager?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}


export interface RestockRequestPayload {
  items: RestockRequestItem[];
  notes?: string;
}
export interface RestockRequest {
  _id: string;
  branchId: string;
  branchName: string;
  requestedBy: string;
  status: string;
  createdAt: string;
  notes?: string;
  items: RestockRequestItem[];
  manager?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface RestockRequestCreateItem {
  productId: string;
  requestedQty: number;
}

export interface RestockRequestCreatePayload {
  items: RestockRequestCreateItem[];
  notes?: string;
}