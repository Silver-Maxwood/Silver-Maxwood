import { Topbar } from "@/components/Topbar";
import { getFeedSales } from "@/lib/queries";
import { FeedSalesTables } from "@/components/FeedSalesTables";
import { FeedSalesForms } from "@/components/FeedSalesForms";

export default async function FeedPage() {
  const feedSales = await getFeedSales();
  
  const pendingSales = feedSales.filter(s => s.payment_status === "PENDING");
  const pendingAmount = pendingSales.reduce((acc, s) => acc + Number(s.total_amount), 0);

  return (
    <>
      <Topbar title="Feed Sales" subtitle={`${pendingSales.length} pending payments`} />
      <div className="px-4 lg:px-8 py-6 space-y-6">
        {pendingAmount > 0 && (
          <div className="card p-5 bg-alert-yellow/10 border-alert-yellow/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-forest-900">Total Pending Collection</p>
              <p className="text-2xl font-display text-forest-900">KSh {pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <p className="text-sm text-silver-600">
              Ensure you mark sales as paid once payment is received.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <FeedSalesTables sales={feedSales} />
          </div>
          <div className="lg:col-span-1">
            <FeedSalesForms />
          </div>
        </div>
      </div>
    </>
  );
}
