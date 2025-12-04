import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { DiscountResponse } from "@/lib/types/discount";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

interface PaymentModalProps {
  open: boolean;
  total: number;
  onClose: () => void;
  onConfirm: (paymentData: any) => void;
  discountData?: DiscountResponse | null;
}

export function PaymentModal({ open, total, discountData, onClose, onConfirm }: PaymentModalProps) {
  const [method, setMethod] = useState<string>("CASH");

  const handleSubmit = () => {
    onConfirm({
      discountData,
      method,
      cashReceived: method === "CASH" ? total : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Discounts Card */}
          {discountData && discountData.totalDiscount > 0 && (
            <Card>
              <CardContent className="space-y-2">
                <h3 className="text-md font-semibold">Eligible Discounts</h3>

                <div className="space-y-4 text-sm">
                  {/* Product-level discounts */}
                  {discountData.lines
                    .filter((line) => (line.appliedDiscountAmount ?? 0) > 0)
                    .map((line) => (
                      <div key={line.productId} className="flex justify-between">
                        <div>
                          {line.productName ?? line.productId}
                          {line.freeUnits > 0 && ` (+${line.freeUnits} free)`}:{" "}
                          {line.appliedDiscountName} ({line.appliedDiscountType})
                        </div>
                        <div className="text-red-500">- ₹{line.appliedDiscountAmount ?? 0}</div>
                      </div>
                    ))}


                  {/* Cart-level discount */}
                  {discountData.cartLevelDiscount! > 0 && (
                    <div className="flex justify-between font-medium text-purple-600">
                      <div>Cart Level Discount</div>
                      <div>- ₹{discountData.cartLevelDiscount}</div>
                    </div>
                  )}
                </div>
                <Separator />
                {/* Totals */}
                <div className=" mt-2 pt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{discountData.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Discount</span>
                    <span>₹{discountData.totalDiscount}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Final Amount</span>
                    <span>₹{discountData.finalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          <div>
            <label className="font-medium">Payment Method</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {["CASH", "CARD", "UPI"].map((m) => (
                <Button
                  key={m}
                  variant={method === m ? "default" : "secondary"}
                  onClick={() => setMethod(m)}
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>

          {/* Cash Received */}
          {method === "CASH" && (
            <div className="flex  justify-between my-10 gap-2 bg-gray-200 py-2 px-4 rounded">
              <h4 className="scroll-m-20 text-lg font-semibold tracking-tight uppercase">
                Cash :
              </h4>
              {/* <Input value={discountData?.finalAmount ?? total} className="font-bold" /> */}
             
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                ₹ {discountData?.finalAmount ?? total} /-
              </h4>
            </div>
          )}

          <Button className="w-full mt-2 bg-green-500" onClick={handleSubmit}>
            Confirm Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
