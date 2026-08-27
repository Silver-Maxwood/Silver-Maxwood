import { Topbar } from "@/components/Topbar";
import { AddFarmerForm, LogDeliveryForm } from "@/components/CollectionForms";
import { getFarmers, getDeliveries } from "@/lib/queries";
import { formatKSh, formatLitres } from "@/lib/utils/format";
import { CollectionTables } from "@/components/CollectionTables";

export default async function CollectionPage() {
  const [farmers, deliveries] = await Promise.all([getFarmers(), getDeliveries(14)]);

  const today = new Date().toISOString().slice(0, 10);
  const todaysDeliveries = deliveries.filter((d) => d.date === today);
  const todaysLitres = todaysDeliveries.filter((d) => d.quality_status === "ACCEPTED").reduce((s, d) => s + Number(d.quantity), 0);
  const totalPayable = deliveries.filter((d) => d.payment_status === "PENDING").reduce((s, d) => s + Number(d.net_payable), 0);

  return (
    <>
      <Topbar title="Collection Hub" subtitle={`${farmers.length} registered farmers`} />

      <div className="px-4 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-silver-600 mb-2">Today's collection</p>
            <p className="font-display text-2xl text-forest-900">{formatLitres(todaysLitres)}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-silver-600 mb-2">Deliveries today</p>
            <p className="font-display text-2xl text-forest-900">{todaysDeliveries.length}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-silver-600 mb-2">Pending payout</p>
            <p className="font-display text-2xl text-forest-900">{formatKSh(totalPayable)}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <LogDeliveryForm farmers={farmers} />
            <AddFarmerForm />
          </div>

          <CollectionTables deliveries={deliveries} farmers={farmers} />
        </div>
      </div>
    </>
  );
}
