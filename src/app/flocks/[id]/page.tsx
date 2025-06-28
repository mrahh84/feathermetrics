"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function FlockDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const flockId = params?.id;
  const [flock, setFlock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!flockId) return;
    setLoading(true);
    fetch(`http://localhost:8000/api/flocks/${flockId}/`)
      .then((res) => res.json())
      .then(setFlock)
      .catch(() => setError("Failed to load flock"))
      .finally(() => setLoading(false));
  }, [flockId]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!flock) return <div className="p-8">Flock not found.</div>;

  return (
    <div className="p-8 space-y-6">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Flocks", href: "/flocks" }, { label: flock?.name || "Flock" }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">{flock.name}</h1>
          <div className="text-gray-600">Breed: {flock.breed}</div>
          <div className="text-gray-600">Initial Count: {flock.initial_count}</div>
          <div className="text-gray-600">Acquired: {flock.acquisition_date}</div>
        </div>
        <Button variant="outline" onClick={() => router.push("/flocks")}>Back to Flocks</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="secondary" onClick={() => router.push(`/flocks/${flockId}/egg-logs`)}>🥚 Egg Logs</Button>
        <Button variant="secondary" onClick={() => router.push(`/flocks/${flockId}/mortality-logs`)}>💀 Mortality Logs</Button>
        <Button variant="secondary" onClick={() => router.push(`/flocks/${flockId}/feed-logs`)}>🪶 Feed Logs</Button>
        <Button variant="secondary" onClick={() => router.push(`/flocks/${flockId}/sales`)}><span className="mr-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 8v8m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>Sales</Button>
        <Button variant="secondary" onClick={() => router.push(`/flocks/${flockId}/expenses`)}><span className="mr-1"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 8v8m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>Expenses</Button>
      </div>
    </div>
  );
} 