import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

// Define the type of a request row to help with TS
interface RequestRow {
  _id: string;
  branchName: string;
  status: string;
  items: any[];
  manager: {
    name: string;
    email: string;
    role: string;
    id: string;
  };
}

export const requestColumns: ColumnDef<RequestRow>[] = [
  {
    accessorKey: "branchName",
    header: "Branch",
    cell: ({ row }) => {
      // row.original is of type RequestRow
      return <span>{row?.original?.branchName || "-"}</span>;
    },
  },
  {
    accessorKey: "manager.name",
    header: "Requested By",
    cell: ({ row }) => <span>{row.original.manager?.name || "-"}</span>,
  },
  {
    header: "Items",
    cell: ({ row }) => <span>{row.original.items?.length || 0} item(s)</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span>{row.original.status}</span>,
  },
  {
    id: "details",
    header: "Action",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const req = row.original;

      return (
        <span
          className="cursor-pointer text-blue-500"
          onClick={() =>

            navigate(`/admin/stock-request-detail/${req._id}`)

          }
        >
          View Items
        </span>
      );
    },
  },
];
