"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, AlertTriangle, Clock, Ban } from "lucide-react";
import clsx from "clsx";
import type { Alert } from "@/lib/alerts";

const ICONS = { breeding: Clock, withdrawal: Ban, feed: AlertTriangle };

export function AlertsBell({ alerts }: { alerts: Alert[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const danger = alerts.filter((a) => a.severity === "danger").length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications (${alerts.length})`}
        className="relative flex items-center justify-center h-9 w-9 rounded-full border border-silver-200 bg-white hover:bg-silver-100 transition-colors"
      >
        <Bell size={17} className="text-forest-800" />
        {alerts.length > 0 && (
          <span
            className={clsx(
              "absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-semibold text-white",
              danger > 0 ? "bg-alert-red" : "bg-alert-amber"
            )}
          >
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto card z-50 py-2">
          <p className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-silver-600">
            Alerts &amp; reminders
          </p>
          {alerts.length === 0 ? (
            <p className="px-4 py-6 text-sm text-silver-600 text-center">All clear on the farm today.</p>
          ) : (
            <ul>
              {alerts.map((a) => {
                const Icon = ICONS[a.type];
                return (
                  <li key={a.id} className="px-4 py-2.5 flex items-start gap-2.5 hover:bg-silver-100">
                    <Icon
                      size={16}
                      className={clsx(
                        "mt-0.5 shrink-0",
                        a.severity === "danger" && "text-alert-red",
                        a.severity === "warning" && "text-alert-amber",
                        a.severity === "info" && "text-pasture-600"
                      )}
                    />
                    <span className="text-sm text-forest-900 leading-snug">{a.message}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
