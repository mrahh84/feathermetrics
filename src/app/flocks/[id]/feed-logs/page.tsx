"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function FeedLogsPage() {
  const router = useRouter();
  const params = useParams();
  const flockId = params?.id;
  const [feedLogs, setFeedLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);
  const [flockName, setFlockName] = useState<string>("");

  const fetchFeedLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/flocks/${flockId}/feed_logs/`);
      const data = await res.json();
      setFeedLogs(data);
    } catch (e) {
      setError("Failed to load feed logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (flockId) {
      fetch(`http://localhost:8000/api/flocks/${flockId}/`).then(res => res.json()).then(data => setFlockName(data.name)).catch(() => setFlockName("Flock"));
      fetchFeedLogs();
    }
  }, [flockId]);

  const form = useForm({
    defaultValues: {
      date: "",
      quantity_kg: 0,
      cost: 0,
    },
  });

  const openAddModal = () => {
    setEditingLog(null);
    form.reset({ date: "", quantity_kg: 0, cost: 0 });
    setModalOpen(true);
  };

  const openEditModal = (log: any) => {
    setEditingLog(log);
    form.reset({ date: log.date, quantity_kg: log.quantity_kg, cost: log.cost });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/api/flocks/${flockId}/feed_logs/${id}/`, { method: "DELETE" });
    fetchFeedLogs();
  };

  const onSubmit = async (values: any) => {
    if (editingLog) {
      await fetch(`http://localhost:8000/api/flocks/${flockId}/feed_logs/${editingLog.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } else {
      await fetch(`http://localhost:8000/api/flocks/${flockId}/feed_logs/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    }
    setModalOpen(false);
    fetchFeedLogs();
  };

  return (
    <div className="p-8">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Flocks", href: "/flocks" }, { label: flockName || "Flock", href: `/flocks/${flockId}` }, { label: "Feed Logs" }]} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Feed Logs</h1>
        <Button onClick={openAddModal}>Add Feed Log</Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Quantity (kg)</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedLogs.map((log: any) => (
              <TableRow key={log.id}>
                <TableCell>{log.date}</TableCell>
                <TableCell>{log.quantity_kg}</TableCell>
                <TableCell>{log.cost}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => openEditModal(log)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDelete(log.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLog ? "Edit Feed Log" : "Add Feed Log"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField name="date" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="quantity_kg" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="cost" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full">{editingLog ? "Save Changes" : "Add Feed Log"}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 