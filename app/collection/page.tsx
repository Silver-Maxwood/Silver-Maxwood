import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/StatusBadge";
import { AddFarmerForm, LogDeliveryForm } from "@/components/CollectionForms";
import { getFarmers, getDeliveries } from "@/lib/queries";
import { formatKSh, formatLitres, formatDate } from "@/lib/utils/format";
import { MarkDeliveryPaidButton } from "@/components/MarkDeliveryPaidButton";

export default async function CollectionPage() {
  const [farmers, deliveries] = await Promise.all([getFarmers(), getDeliveries(14)]);
  const farmerMap = new Map(farmers.map((f) => [f.id, f]));

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

          <div className="lg:col-span-2 space-y-6">
            <div className="card overflow-x-auto">
              <div className="px-4 py-3 border-b border-silver-200">
                <h3 className="font-display text-lg text-forest-900">Delivery log</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Farmer</th>
                    <th className="px-4 py-3 font-medium">Qty (L)</th>
                    <th className="px-4 py-3 font-medium">Quality</th>
                    <th className="px-4 py-3 font-medium">Deductions</th>
                    <th className="px-4 py-3 font-medium">Net payable</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.slice(0, 40).map((d) => (
                    <tr key={d.id} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60">
                      <td className="px-4 py-3 text-silver-600">{formatDate(d.date)}</td>
                      <td className="px-4 py-3 font-medium text-forest-900">{farmerMap.get(d.farmer_id)?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-silver-600">{d.quantity}</td>
                      <td className="px-4 py-3"><StatusBadge status={d.quality_status} /></td>
                      <td className="px-4 py-3 text-silver-600">{formatKSh(d.deductions)}</td>
                      <td className="px-4 py-3 font-medium text-forest-900">{formatKSh(d.net_payable)}</td>
                      <td className="px-4 py-3 flex items-center">
                        <StatusBadge status={d.payment_status} />
                        {d.payment_status === "PENDING" && <MarkDeliveryPaidButton deliveryId={d.id} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card overflow-x-auto">
              <div className="px-4 py-3 border-b border-silver-200">
                <h3 className="font-display text-lg text-forest-900">Registered farmers</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200">
                    <th className="px-4 py-3 font-medium">Reg. no</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Payout method</th>
                    <th className="px-4 py-3 font-medium">Price / L</th>
                  </tr>
                </thead>
                <tbody>
                  {farmers.map((f) => (
                    <tr key={f.id} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60">
                      <td className="px-4 py-3 font-medium text-forest-900">{f.reg_no}</td>
                      <td className="px-4 py-3 text-silver-600">{f.name}</td>
                      <td className="px-4 py-3 text-silver-600">{f.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-silver-600">{f.bank_or_mobile_money ?? "—"}</td>
                      <td className="px-4 py-3 text-silver-600">{formatKSh(f.price_per_litre)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
