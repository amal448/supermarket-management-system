import { useState, useMemo } from "react";
import ViewItems from "@/components/tanstacktable/page";
import { requestColumns } from "@/components/tanstacktable/requestColumns";
import { useAdminStockRequests } from "@/hooks/useAdminStockRequests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RestockRequest } from "@/lib/types/restock";

const ViewStockRequest = () => {
  const { data, isLoading, isError } = useAdminStockRequests();
  const [filter, setFilter] = useState<"all" | "approved" | "partially" | "rejected">("all");
  const [search, setSearch] = useState("");

  const requests: RestockRequest[] = data || [];

  const filteredData = useMemo(() => {
    let filtered = requests;

    if (filter !== "all") {
      filtered = filtered.filter((req) => {
        switch (filter) {
          case "approved":
            return req.status === "APPROVED";
          case "partially":
            return req.status === "PARTIALLY_APPROVED";
          case "rejected":
            return req.status === "REJECTED";
          default:
            return true;
        }
      });
    }

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req?.branch?.name.toLowerCase().includes(lowerSearch) ||
          req?.manager?.name?.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [requests, filter, search]);

  if (isLoading) return <p>Loading stock requests...</p>;
  if (isError) return <p>Error loading data</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Stock Management</h1>
          <p className="text-muted-foreground">Manage your stock requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap overflow-hidden gap-3 items-center mb-4 ">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All
        </Button>
        <Button
          variant={filter === "approved" ? "default" : "outline"}
          onClick={() => setFilter("approved")}
        >
          Approved
        </Button>
        <Button
          variant={filter === "partially" ? "default" : "outline"}
          onClick={() => setFilter("partially")}
        >
          Partially Approved
        </Button>
        <Button
          variant={filter === "rejected" ? "default" : "outline"}
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </Button>
        <Input
          placeholder="Search by branch or manager..."
          className="ml-auto w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <ViewItems items={filteredData} columns={requestColumns} />
    </div>
  );
};

export default ViewStockRequest;
