export type DiscountType = "BUY_X_GET_Y"
    | "PRODUCT_PERCENTAGE"
    | "CART_PERCENTAGE";

export interface DiscountEntity {
    id?: string;
    name: string; //discount name
    type: DiscountType
    productId?: string;
    // category?: string;
    // minQty?: number; //for product discounts
    buyQty?: number;
    getQty?: number;//free
    flatAmountPaise?: number; // per-unit for product flat; absolute for cart flat
    percentage?: number;
    minPurchaseAmountPaise?: number;
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;

}
export interface DiscountLine {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    discountAmount: number;
    freeUnits: number;
    finalAmount: number;
    appliedDiscountAmount?: number;
    appliedDiscountType?: string
    appliedDiscountName?: string
    discount?: {
        id: string;
        name: string;
        type: string;
    };
}

export interface DiscountResponse {
    subtotal: number;
    totalProductLevelDiscount: number;
    cartLevelDiscount: number;
    totalDiscount: number;
    finalAmount: number;
    lines: DiscountLine[];
}

