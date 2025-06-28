'use client';
import {
  Feather,
  Home,
  DollarSign,
  ShoppingCart,
  BookOpen,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from '@/components/ui/sidebar';

export function SidebarNav() {
  const params = useParams();
  const router = useRouter();
  const flockId = params?.id;
  const [flocks, setFlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/flocks/")
      .then((res) => res.json())
      .then(setFlocks)
      .finally(() => setLoading(false));
  }, []);

  const selectedFlock = flocks.find((f: any) => String(f.id) === String(flockId));

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
             <Feather className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-primary">FeatherMetrics</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" passHref legacyBehavior>
              <SidebarMenuButton isActive tooltip="Dashboard">
                <Home />
                Dashboard
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/flocks" passHref legacyBehavior>
              <SidebarMenuButton tooltip="Flocks">
                <Feather />
                Flocks
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/sales" passHref legacyBehavior>
              <SidebarMenuButton tooltip="Sales">
                <DollarSign />
                Sales
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/expenses" passHref legacyBehavior>
              <SidebarMenuButton tooltip="Expenses">
                <ShoppingCart />
                Expenses
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/customers" passHref legacyBehavior>
              <SidebarMenuButton tooltip="Customers">
                <UserIcon />
                Customers
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="px-4 py-2">
              <label className="block text-xs mb-1">Switch Flock</label>
              <select
                className="w-full border rounded px-2 py-1 text-sm"
                value={flockId || ""}
                onChange={e => router.push(`/flocks/${e.target.value}`)}
                disabled={loading || flocks.length === 0}
              >
                <option value="">Select flock...</option>
                {flocks.map((f: any) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </SidebarMenuItem>
          {selectedFlock && (
            <>
              <SidebarMenuItem>
                <div className="px-4 py-2 font-semibold text-primary">{selectedFlock.name}</div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href={`/flocks/${flockId}`} passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Flock Dashboard">
                    🏠 Flock Dashboard
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href={`/flocks/${flockId}/egg-logs`} passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Egg Logs">
                    🥚 Egg Logs
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href={`/flocks/${flockId}/mortality-logs`} passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Mortality Logs">
                    💀 Mortality Logs
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href={`/flocks/${flockId}/feed-logs`} passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Feed Logs">
                    🪶 Feed Logs
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href={`/flocks/${flockId}/sales`} passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Sales">
                    <DollarSign /> Sales
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href={`/flocks/${flockId}/expenses`} passHref legacyBehavior>
                  <SidebarMenuButton tooltip="Expenses">
                    <ShoppingCart /> Expenses
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button variant="ghost" className="w-full text-left px-4" onClick={() => router.push("/flocks")}>← Back to Flocks</Button>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
