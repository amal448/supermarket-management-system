
type Props = {
  todaysRevenue: number;
  monthlyTotal: number;
  yearlyTotal: number;
  todaysTransactions: number;
  loading: boolean;
  todaysPurchase:number
};

const DashBoardCard = ({
  todaysRevenue,
  monthlyTotal,
  yearlyTotal,
  todaysPurchase,
  todaysTransactions,
}: Props) => {
  
  return (
    <div>
      <div className="grid gap-4 lg:gap-8 md:grid-cols-3">

        {/* === Today's Revenue === */}
        <div className="relative p-6 rounded-2xl bg-white shadow dark:bg-gray-800">
          <div className="space-y-2">
            <span className="text-sm text-gray-500">Today’s Sale</span>
            <div className="text-3xl font-bold dark:text-gray-100">
              ₹{todaysRevenue.toLocaleString()}
            </div>
            {/* <span className="text-green-600 text-sm font-medium">+ increase</span> */}
          </div>
        </div>

        {/* === Monthly Revenue === */}
        <div className="relative p-6 rounded-2xl bg-white shadow dark:bg-gray-800">
          <div className="space-y-2">
            <span className="text-sm text-gray-500">Monthly Sale</span>
            <div className="text-3xl font-bold dark:text-gray-100">
              ₹{monthlyTotal.toLocaleString()}
            </div>
            {/* <span className="text-red-600 text-sm font-medium">- decrease</span> */}
          </div>
        </div>

        {/* === Today's Transactions === */}
        <div className="relative p-6 rounded-2xl bg-white shadow dark:bg-gray-800">
          <div className="space-y-2">
            <span className="text-sm text-gray-500">Today’s Customer Count</span>
            <div className="text-3xl font-bold dark:text-gray-100">
              {todaysPurchase}
            </div>
            {/* <span className="text-green-600 text-sm font-medium">+ increase</span> */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashBoardCard;
