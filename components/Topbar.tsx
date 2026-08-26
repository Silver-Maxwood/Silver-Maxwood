import { getAlerts } from "@/lib/alerts";
import { AlertsBell } from "@/components/AlertsBell";
import { isSupabaseConfigured } from "@/lib/queries";

export async function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const alerts = await getAlerts();

  return (
    <header className="sticky top-0 z-30 bg-silver-100/90 backdrop-blur border-b border-silver-200">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div>
          <h1 className="font-display text-xl lg:text-2xl text-forest-900">{title}</h1>
          {subtitle && <p className="text-sm text-silver-600 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {!isSupabaseConfigured && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gold-100 text-gold-500 border border-gold-500/30 px-3 py-1 text-xs font-medium">
              Preview data — connect Supabase
            </span>
          )}
          <AlertsBell alerts={alerts} />
        </div>
      </div>
    </header>
  );
}
