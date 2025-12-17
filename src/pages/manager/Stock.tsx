import { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/components/tanstacktable/data-table";
import { stockColumns } from "@/components/tanstacktable/stock-columns";
import { useBranchStock } from "@/hooks/useBranchStock";
import type { BranchProduct } from "@/lib/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/app/providers/AuthProvider";
import Pagination from "@/components/ui/Pagination";
import type {  RestockRequestPayload } from "@/lib/types/restock";

const Stock = () => {
  const socket = useSocket();
  const { user } = useAuth();

  const {
    getbranchproductStock,
    addBranchMutation,
    page,
    setPage,
    search,
    setSearch,
  } = useBranchStock();

  if (!user) return <p>Please login again.</p>;

  /** ---------------- API RESPONSE ---------------- */
  const response = getbranchproductStock.data;
  const products: BranchProduct[] = response?.data ?? [];
  const pagination = response?.pagination;

  const totalPages = pagination?.totalPages ?? 1;
  const branchId = products[0]?.branchId;

  /** ---------------- SOCKET: JOIN BRANCH ---------------- */
  useEffect(() => {
    if (!socket || !socket.connected || !branchId) return;
    socket.emit("join-branch", branchId);
  }, [socket?.connected, branchId]);

  /** ---------------- SOCKET: LIVE UPDATES ---------------- */
  useEffect(() => {
    if (!socket) return;

    const handler = () => {
      getbranchproductStock.refetch();
    };

    socket.on("stock-updated", handler);
    return () => {
      socket.off("stock-updated", handler);
    }
  }, [socket, getbranchproductStock]);

  /** ---------------- UI STATE ---------------- */
  const [filter, setFilter] = useState<"all" | "in" | "out" | "requested">("all");
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  // const [notes, setNotes] = useState("");

  /** ---------------- FILTERS ---------------- */
  const filteredData = useMemo(() => {
    if (filter === "in") return products.filter(p => p.stock > 0);
    if (filter === "out") return products.filter(p => !p.inBranch && p.stock === 0);
    if (filter === "requested") return products.filter(p => p.isRequested);
    return products;
  }, [products, filter]);

  /** ---------------- ACTIONS ---------------- */
const handleSubmitRequest = () => {
  const payload: RestockRequestPayload = {
    items: Array.from(selectedItems.entries()).map(([productId, quantity]) => ({
      productId: productId!, // ! ensures TypeScript knows it's not undefined
      requestedQty: quantity,
      status: "PENDING",
    })),
  };

  addBranchMutation.mutate(payload);
  setSelectedItems(new Map());
};;

  const handleSelectProduct = (prod: BranchProduct) => {
    const updated = new Map(selectedItems);
    updated.has(prod._id)
      ? updated.delete(prod._id)
      : updated.set(prod._id, Math.max(prod.requiredLevel - prod.stock, 1));
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

  /** ---------------- RENDER ---------------- */
  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Stock Management</h1>

      {/* Filters */}
      <div className="flex gap-3 items-center mb-4">
        {["all", "in", "out", "requested"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f as any)}
          >
            {f.toUpperCase()}
          </Button>
        ))}

        <Input
          placeholder="Search product..."
          className="ml-auto w-64"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {/* Table */}
      <DataTable data={filteredData} columns={columns} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Request Box */}
      {selectedItems.size > 0 && (
        <div className=" flex justify-end p-6 mt-6">

          <Button onClick={handleSubmitRequest} className="bg-green-400">
            <Send className="w-4 h-4 mr-2" /> Submit Request
          </Button>
        </div>
      )}
    </div>
  );
};

export default Stock;
