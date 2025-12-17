import { AddBranch } from "@/components/sheet/AddBranch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBranches } from "@/hooks/useBranches";
import { useNavigate } from "react-router-dom";

export const Branches = () => {
  const { branchesQuery, managersQuery } = useBranches();
  const navigate = useNavigate()

  const managersMap = new Map(
    managersQuery.data?.map((m: any) => [m._id, m])
  );
  console.log("managersMap", managersMap);
  console.log("branchesQuery", branchesQuery.data);

  const branchesWithManagers = branchesQuery.data?.map((branch: any) => ({
    ...branch,
    manager: managersMap.get(branch.managerId)
  }));

  console.log("branchesWithManagers", branchesWithManagers);

  if (branchesQuery.isLoading) return <p>Loading branches...</p>;
  if (managersQuery.isLoading) return <p>Loading managers...</p>;

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Branch Management</h1>
          <p className="text-muted-foreground">Manage branches & locations</p>
        </div>
        <AddBranch />
      </div>

      {branchesWithManagers?.map((branch: any) => (
        <Card key={branch._id}>
          <CardHeader>
            <CardTitle className="uppercase">{branch.name}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex gap-4">
              <img
                className="rounded w-52 h-32 object-cover"
                src="https://tse1.mm.bing.net/th/id/OIP.zwU8XWjBab_ooGjzvKUK9wHaEC?pid=Api&P=0&h=180"
                alt="Branch"
              />

              <div className="space-y-2">
                <p><strong>Manager:</strong> {branch?.manager?.username || "Not assigned"}</p>
                <p><strong>Email:</strong> {branch?.manager?.email}</p>
                <p><strong>BranchId:</strong> {branch?.manager?.branchId}</p>

                <Button onClick={() => navigate(`/admin/branch-details/${branch._id}`)}>
                  View
                </Button>

              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

