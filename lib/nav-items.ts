import { LayoutGrid, Beef, Droplets, HeartPulse, Syringe, Wallet, Truck, FileSpreadsheet, Baby, ShoppingBag } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/cows", label: "Cows", icon: Beef },
  { href: "/calves", label: "Calves", icon: Baby },
  { href: "/milk", label: "Milk & Quality", icon: Droplets },
  { href: "/breeding", label: "Breeding & Health", icon: HeartPulse },
  { href: "/treatment", label: "Treatment & Vaccines", icon: Syringe },
  { href: "/feed", label: "Feed Sales", icon: ShoppingBag },
  { href: "/finance", label: "Finance", icon: Wallet },
  { href: "/collection", label: "Collection Hub", icon: Truck },
  { href: "/reports", label: "Reports", icon: FileSpreadsheet },
] as const;

