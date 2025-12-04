import { AddUser } from '@/components/sheet/AddUser';
import ViewItems from '@/components/tanstacktable/page';
import { staffColumns } from '@/components/tanstacktable/staffColumns';
import { useUsers } from '@/hooks/useUsers';

const StaffManagement = () => {
    const { usersQuery } = useUsers();
    
    if (usersQuery.isLoading) return <p>Loading products...</p>;
    if (usersQuery.isError) {
        const errMsg =
            (usersQuery.error as any)?.response?.data?.message ||
            (usersQuery.error as any)?.message ||
            "Something went wrong";

        return <p className="text-red-500">{errMsg}</p>;
    }


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
                    <p className="text-muted-foreground">Manage your staff accounts</p>
                </div>
                <AddUser />
            </div>

            <ViewItems items={usersQuery.data ?? []} columns={staffColumns()} />
        </div>
    );
};

export default StaffManagement;
