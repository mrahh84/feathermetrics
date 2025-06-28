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

export default function MortalityLogsPage() {
  const router = useRouter();
  const params = useParams();
  const flockId = params?.id;
  const [mortalityLogs, setMortalityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);
  const [flockName, setFlockName] = useState<string>("");

  const fetchMortalityLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/flocks/${flockId}/mortality_logs/`);
      const data = await res.json();
      setMortalityLogs(data);
    } catch (e) {
      setError("Failed to load mortality logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (flockId) {
      fetch(`http://localhost:8000/api/flocks/${flockId}/`).then(res => res.json()).then(data => setFlockName(data.name)).catch(() => setFlockName("Flock"));
      fetchMortalityLogs();
    }
  }, [flockId]);

  const form = useForm({
    defaultValues: {
      date: "",
      count: 0,
      reason: "",
    },
  });

  const openAddModal = () => {
    setEditingLog(null);
    form.reset({ date: "", count: 0, reason: "" });
    setModalOpen(true);
  };

  const openEditModal = (log: any) => {
    setEditingLog(log);
    form.reset({ date: log.date, count: log.count, reason: log.reason });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/api/flocks/${flockId}/mortality_logs/${id}/`, { method: "DELETE" });
    fetchMortalityLogs();
  };

  const onSubmit = async (values: any) => {
    if (editingLog) {
      await fetch(`http://localhost:8000/api/flocks/${flockId}/mortality_logs/${editingLog.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } else {
      await fetch(`http://localhost:8000/api/flocks/${flockId}/mortality_logs/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    }
    setModalOpen(false);
    fetchMortalityLogs();
  };

  return (
    <div className="p-8">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Flocks", href: "/flocks" }, { label: flockName || "Flock", href: `/flocks/${flockId}` }, { label: "Mortality Logs" }]} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mortality Logs</h1>
        <Button onClick={openAddModal}>Add Mortality Log</Button>
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
              <TableHead>Count</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mortalityLogs.map((log: any) => (
              <TableRow key={log.id}>
                <TableCell>{log.date}</TableCell>
                <TableCell>{log.count}</TableCell>
                <TableCell>{log.reason}</TableCell>
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
            <DialogTitle>{editingLog ? "Edit Mortality Log" : "Add Mortality Log"}</DialogTitle>
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
              <FormField name="count" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Count</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="reason" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full">{editingLog ? "Save Changes" : "Add Mortality Log"}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 