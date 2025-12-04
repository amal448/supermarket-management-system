import type { DiscountResponse } from "./discount";

export interface CreatePaymentDTO {
  cartResult: DiscountResponse | null;
  paymentMode: string;
}

export interface PaymentResponse {
  url?: string;
  success?: boolean;
}
