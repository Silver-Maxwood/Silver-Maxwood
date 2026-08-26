import { LayoutGrid, Beef, Droplets, HeartPulse, Wallet, Truck, FileSpreadsheet } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/cows", label: "Cows", icon: Beef },
  { href: "/milk", label: "Milk & Quality", icon: Droplets },
  { href: "/breeding", label: "Breeding & Health", icon: HeartPulse },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/collection", label: "Collection Hub", icon: Truck },
  { href: "/reports", label: "Reports", icon: FileSpreadsheet },
] as const;
