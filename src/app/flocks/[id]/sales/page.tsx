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

export default function SalesPage() {
  const router = useRouter();
  const params = useParams();
  const flockId = params?.id;
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [flockName, setFlockName] = useState<string>("");

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/flocks/${flockId}/sales/`);
      const data = await res.json();
      setSales(data);
    } catch (e) {
      setError("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (flockId) {
      fetch(`http://localhost:8000/api/flocks/${flockId}/`).then(res => res.json()).then(data => setFlockName(data.name)).catch(() => setFlockName("Flock"));
      fetchSales();
    }
  }, [flockId]);

  const form = useForm({
    defaultValues: {
      date: "",
      item: "Eggs",
      quantity: 0,
      price: 0,
    },
  });

  const openAddModal = () => {
    setEditingSale(null);
    form.reset({ date: "", item: "Eggs", quantity: 0, price: 0 });
    setModalOpen(true);
  };

  const openEditModal = (sale: any) => {
    setEditingSale(sale);
    form.reset({ date: sale.date, item: sale.item, quantity: sale.quantity, price: sale.price });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/api/flocks/${flockId}/sales/${id}/`, { method: "DELETE" });
    fetchSales();
  };

  const onSubmit = async (values: any) => {
    if (editingSale) {
      await fetch(`http://localhost:8000/api/flocks/${flockId}/sales/${editingSale.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } else {
      await fetch(`http://localhost:8000/api/flocks/${flockId}/sales/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    }
    setModalOpen(false);
    fetchSales();
  };

  return (
    <div className="p-8">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Flocks", href: "/flocks" }, { label: flockName || "Flock", href: `/flocks/${flockId}` }, { label: "Sales" }]} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        <Button onClick={openAddModal}>Add Sale</Button>
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
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale: any) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.item}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>{sale.price}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => openEditModal(sale)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDelete(sale.id)}>
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
            <DialogTitle>{editingSale ? "Edit Sale" : "Add Sale"}</DialogTitle>
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
              <FormField name="item" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="quantity" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="price" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full">{editingSale ? "Save Changes" : "Add Sale"}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 