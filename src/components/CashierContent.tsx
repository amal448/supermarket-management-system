import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import { useBranchStock } from "@/hooks/useBranchStock";
import type { BranchProduct } from "@/lib/types/product";
import { PaymentModal } from "./PaymentModal";
import { useDiscount } from "@/hooks/useDiscount";
import type { DiscountResponse } from "@/lib/types/discount";
import { useSales } from "@/hooks/useSales";
import { useSocket } from "@/hooks/useSocket";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import ViewItems from "@/components/tanstacktable/page";
import Pagination from "./ui/Pagination";

interface CartItem extends BranchProduct {
  qty: number;
}


export default function CashierContent() {

  const socket = useSocket();
  const { getbranchproductStock, page, setPage, search, setSearch } = useBranchStock()
  const { checkDiscountMutation } = useDiscount()
  const { PaymentMutation } = useSales()

  const products: BranchProduct[] =
    getbranchproductStock.data?.data ?? [];
  const pagination =
    getbranchproductStock.data?.pagination;

  const totalPages = pagination?.totalPages ?? 1;
  const branchId = products[0]?.branchId;

  const navigate = useNavigate()
  const [discountResult, setDiscountResult] = useState<DiscountResponse | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const getStock = (id: string) => {
    return products.find((p) => p._id === id)?.stock ?? 0;
  };
  const handleAddToCart = (product: BranchProduct) => {
    const stock = product.stock;

    setCartItems((prev) => {
      const existing = prev.find((p) => p._id === product._id);

      if (existing) {
        if (existing.qty + 1 > stock) {
          alert(`Only ${stock} items available`);
          return prev;
        }

        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      if (stock < 1) {
        alert("Out of stock");
        return prev;
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };


  const increaseQty = (id: string) => {
    const stock = getStock(id);

    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          if (item.qty + 1 > stock) {
            alert(`You cannot exceed stock. Available: ${stock}`);
            return item;
          }
          return { ...item, qty: item.qty + 1 };
        }
        return item;
      })
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


  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.qty * item.sellingPrice,
    0
  );

  const total = subtotal; // Add discount later if needed

  const payDisabled = checkDiscountMutation.isPending || cartItems.length === 0;
  const payClass = `w-full mt-3 bg-blue-500 text-white ${payDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 cursor-pointer'}`;

  const productTableColumns: ColumnDef<BranchProduct>[] = [
    { accessorKey: "name", header: "Product" },
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "category", header: "Category" },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const s = row.original.stock;
        return <Badge className={s > 0 ? "bg-green-500" : "bg-red-500"}>{s}</Badge>;
      },
    },
    {
      accessorKey: "sellingPrice",
      header: "Price",
      cell: ({ row }) => <Badge className="bg-green-500">₹{row.original.sellingPrice}</Badge>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Button size="sm" variant="default" className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer" onClick={() => handleAddToCart(product)}>
            Add
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (!socket || !socket.connected || !branchId) return;

    console.log("📡 Cashier joining branch room:", branchId);
    socket.emit("join-branch", branchId);

  }, [socket?.connected, branchId]);

  useEffect(() => {
    if (!socket) return;

    const handler = () => {
      console.log("🔥 CASHIER RECEIVED LIVE STOCK UPDATE");
      getbranchproductStock.refetch();
    };

    socket.on("stock-updated", handler);

    return () => {
      socket.off("stock-updated", handler);
    }
  }, [socket, getbranchproductStock]);


  return (
    <div className="bg-slate-100 p-4 sm:p-6 min-h-screen">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[calc(100vh-3rem)]">

        {/* LEFT — PRODUCT CATALOG */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            <Input
              placeholder="Search product name or SKU..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />

            <Button
              variant="default"
              onClick={() => setSearch("")}
              className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            >
              Clear
            </Button>
          </div>

          <Card className="flex flex-col h-full">
            {/* <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader> */}

            <CardContent className="flex-1">
              <ScrollArea className="h-full">
                <div className="p-2 bg-white rounded">
                  <ViewItems items={products} columns={productTableColumns} />
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="mt-auto">
              <div className="w-full flex justify-end py-2">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* RIGHT — CART */}
        <div className="relative lg:col-span-4 flex flex-col h-full">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart /> Cart <Badge className="bg-blue-500">{cartItems.length}</Badge>
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
                    variant="default"
                    className={payClass}
                    onClick={handleDiscount}
                    disabled={payDisabled}
                  >
                    {checkDiscountMutation.isPending ? "Checking..." : "Pay"}
                  </Button>

                  {cartItems.length === 0 && (
                    <div className="text-xs text-muted-foreground mt-2">Add items to the cart to enable payment</div>
                  )}

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
                navigate("/payment-success");
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
