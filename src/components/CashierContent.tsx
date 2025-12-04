import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import { useBranchStock } from "@/hooks/useBranchStock";
import type { BranchProduct } from "@/lib/types/product";
import { PaymentModal } from "./PaymentModal";
import { useDiscount } from "@/hooks/useDiscount";
import type { DiscountResponse } from "@/lib/types/discount";
import { useSales } from "@/hooks/useSales";

interface CartItem extends BranchProduct {
  qty: number;
}


export default function CashierContent() {
  const { getbranchproductStock } = useBranchStock()
  const { checkDiscountMutation } = useDiscount()
  const { PaymentMutation } = useSales()

  const [discountResult, setDiscountResult] = useState<DiscountResponse | null>(null);

  const [paymentOpen, setPaymentOpen] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ------------------
  // CART HANDLERS
  // ------------------

  const handleAddToCart = (product: BranchProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const increaseQty = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, qty: Math.max(1, item.qty - 1) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleDiscount = () => {
    console.log("cartItems", cartItems);

    checkDiscountMutation.mutate(
      { items: cartItems },   // send cartData
      {
        onSuccess: (result) => {
          console.log("DISCOUNT RESULT:", result);
          setDiscountResult(result);   // store discount details
          setPaymentOpen(true);        // open modal only after success
        },
        onError: (err) => {
          console.error("Discount error", err);
        },
      }
    );
  };

  // ------------------
  // TOTALS
  // ------------------

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.qty * item.sellingPrice,
    0
  );

  const total = subtotal; // Add discount later if needed

  // ------------------
  // UI
  // ------------------

  return (
    <div className="bg-slate-100 p-4 sm:p-6 min-h-screen">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[calc(100vh-3rem)]">

        {/* LEFT — PRODUCT CATALOG */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            <Input placeholder="Search product name or SKU..." className="flex-1" />
            <Button className="w-full sm:w-auto">Clear</Button>
          </div>

          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>

            <CardContent>
              <ScrollArea className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">

                  {getbranchproductStock.data?.map((product: BranchProduct) => (
                    <div
                      key={product._id}
                      className="p-3 border rounded bg-white flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.sku} • {product.category}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="font-semibold">₹{product.sellingPrice}</div>
                        <Button size="sm" className="bg-blue-400" onClick={() => handleAddToCart(product)}>
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}

                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — CART */}
        <div className="relative lg:col-span-4 flex flex-col h-full">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart /> Cart <Badge>{cartItems.length}</Badge>
              </CardTitle>
            </CardHeader>

            {/* Main layout (flex) */}
            <div className="flex flex-col h-full">

              {/* Scrollable cart items */}
              <ScrollArea className="max-h-96 px-4">
                <div className="divide-y border rounded bg-white">
                  {cartItems.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">
                      Cart is empty
                    </div>
                  )}

                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="grid grid-cols-12 items-center gap-2 px-3 py-3"
                    >
                      {/* PRODUCT NAME */}
                      <div className="col-span-5">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.sku} • {item.category}
                        </div>
                      </div>

                      {/* QTY CONTROLS */}
                      <div className="col-span-3 flex items-center gap-1">
                        <Button size="icon" variant="outline" onClick={() => decreaseQty(item._id)}>
                          <Minus className="w-4 h-4" />
                        </Button>

                        <span className="w-8 text-center font-semibold">{item.qty}</span>

                        <Button size="icon" variant="outline" onClick={() => increaseQty(item._id)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* PRICE */}
                      <div className="col-span-3 text-right font-semibold">
                        ₹{item.qty * item.sellingPrice}
                      </div>

                      {/* REMOVE ICON */}
                      <div className="col-span-1 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item._id)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Sticky bottom totals + Pay button */}
              <div className="w-full border-t bg-white p-4 absolute bottom-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  <Button
                    className="w-full mt-3 bg-blue-500"
                    onClick={handleDiscount}
                    disabled={checkDiscountMutation.isPending}
                  >
                    {checkDiscountMutation.isPending ? "Checking..." : "Pay"}
                  </Button>


                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>
      <PaymentModal
        open={paymentOpen}
        total={discountResult?.finalAmount ?? total}
        discountData={discountResult}
        onClose={() => setPaymentOpen(false)}

        onConfirm={(paymentData) => {
          PaymentMutation.mutate(
            {
              cartResult: discountResult,
              paymentMode: paymentData.method,
            },
            {
              onSuccess: (res) => {
                if (res.url) {
                  window.location.href = res.url;   // redirect to Stripe
                  return;
                }

                setPaymentOpen(false);
                setCartItems([]);
              }
            }
          );
        }}


      />



    </div>
  );
}
