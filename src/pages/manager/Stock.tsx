import { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/components/tanstacktable/data-table";
import { stockColumns } from "@/components/tanstacktable/stock-columns";
import { useBranchStock } from "@/hooks/useBranchStock";
import type { BranchProduct } from "@/lib/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";

const Stock = () => {
  const socket = useSocket();
  const { getbranchproductStock, addBranchMutation } = useBranchStock();

  const products: BranchProduct[] = getbranchproductStock.data ?? [];
  const branchId = products[0]?.branchId;
  console.log("products", products);

  console.log("🔌 Socket on Stock page:", socket);
  console.log("🏬 Branch ID:", branchId);

  /** -------------------------------------------
   * 1) JOIN BRANCH ROOM (Only when both exist)
   --------------------------------------------*/
  useEffect(() => {
    console.log("hii");
    
    if (!socket) {
      console.log("⏳ Waiting for socket...");
      return;
    }

    if (!socket.connected) {
      console.log("⏳ Socket not connected yet…");
      return;
    }

    if (!branchId) {
      console.log("⏳ Waiting for branchId...");
      return;
    }

    console.log("📡 Joining branch room:", branchId);
    socket.emit("join-branch", branchId);

  }, [socket?.connected, branchId]);

  /** -------------------------------------------
   * 2) LISTEN FOR LIVE STOCK UPDATES
   --------------------------------------------*/
  useEffect(() => {
    if (!socket) return;

    const handler = (updatedStock: any) => {
      console.log("🔥 LIVE STOCK UPDATE RECEIVED:", updatedStock);

      // Refetch fresh stock from API
      getbranchproductStock.refetch();
    };

    socket.on("stock-updated", handler);

    return () => {
      socket.off("stock-updated", handler);
    };
  }, [socket, getbranchproductStock]);

  /** -------------------------------------------
   * UI Logic Below (unchanged)
   --------------------------------------------*/
  const [filter, setFilter] = useState<"all" | "in" | "out" | "requested">("all");
  const [search, setSearch] = useState("");

  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const [notes, setNotes] = useState("");

  const inStock = useMemo(() => products.filter((p) => p.stock > 0), [products]);
  const outOfStock = useMemo(
    () => products.filter((p) => !p.inBranch && p.stock === 0),
    [products]
  );
  const requested = useMemo(() => products.filter((p) => p.isRequested), [products]);

  const filteredData = useMemo(() => {
    let data = products;

    if (filter === "in") data = inStock;
    if (filter === "out") data = outOfStock;
    if (filter === "requested") data = requested;

    if (search.trim()) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [products, filter, search]);

  const handleSubmitRequest = () => {
    const items = Array.from(selectedItems.entries()).map(
      ([productId, qty]) => ({
        productId,
        quantity: qty,
      })
    );
    addBranchMutation.mutate({ items, notes });
  };

  const handleSelectProduct = (prod: BranchProduct) => {
    const updated = new Map(selectedItems);

    if (updated.has(prod._id)) {
      updated.delete(prod._id);
    } else {
      const recommendedQty = Math.max(prod.requiredLevel - prod.stock, 1);
      updated.set(prod._id, recommendedQty);
    }
    setSelectedItems(updated);
  };

  const handleQuantityChange = (id: string, qty: number) => {
    const updated = new Map(selectedItems);
    updated.set(id, qty);
    setSelectedItems(updated);
  };

  const columns = stockColumns({
    selectedItems,
    handleSelectProduct,
    handleQuantityChange,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Stock Management</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 border rounded bg-green-50">
          <h3 className="font-semibold">In Stock</h3>
          <p>{inStock.length} items</p>
        </div>

        <div className="p-4 border rounded bg-red-50">
          <h3 className="font-semibold">Out of Stock</h3>
          <p>{outOfStock.length} items</p>
        </div>

        <div className="p-4 border rounded bg-amber-50">
          <h3 className="font-semibold">Requested</h3>
          <p>{requested.length} items</p>
        </div>

        <div className="p-4 border rounded bg-blue-50">
          <h3 className="font-semibold">All Products</h3>
          <p>{products.length} items</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center mb-4">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All
        </Button>

        <Button variant={filter === "in" ? "default" : "outline"} onClick={() => setFilter("in")}>
          In Stock
        </Button>

        <Button variant={filter === "out" ? "default" : "outline"} onClick={() => setFilter("out")}>
          Out of Stock
        </Button>

        <Button
          variant={filter === "requested" ? "default" : "outline"}
          onClick={() => setFilter("requested")}
        >
          Requested
        </Button>

        <Input
          placeholder="Search product..."
          className="ml-auto w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <DataTable data={filteredData} columns={columns} />

      {/* Restock Request Box */}
      {selectedItems.size > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Submit Restock Request</h3>

          {/* Selected items */}
          <div className="mb-4">
            <div className="bg-gray-50 rounded-md p-3 space-y-2">
              {Array.from(selectedItems.entries()).map(([productId, qty]) => {
                const product = products.find((p) => p._id === productId);
                return (
                  <div key={productId} className="flex justify-between text-sm">
                    <span>{product?.name}</span>
                    <span className="font-medium">{qty} {product?.unit}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add notes..."
            className="w-full p-3 border rounded mb-4"
          />

          <Button onClick={handleSubmitRequest} className="flex items-center">
            <Send className="w-4 h-4 mr-2" />
            Submit Request
          </Button>
        </div>
      )}
    </div>
  );
};

export default Stock;
