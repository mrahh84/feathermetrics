"use client";
import { useEffect, useState, useRef } from "react";
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
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Repeat, Edit, Trash2, Eye, UserPlus, Search } from "lucide-react";

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [flocks, setFlocks] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [filterFlock, setFilterFlock] = useState<string>("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", address: "" });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [quickViewCustomer, setQuickViewCustomer] = useState<any>(null);
  const [lastUsed, setLastUsed] = useState<any>({});
  const formRef = useRef<HTMLFormElement>(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/sales/`);
      const data = await res.json();
      setSales(data);
    } catch (e) {
      setError("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  const fetchFlocks = async () => {
    const res = await fetch("http://localhost:8000/api/flocks/");
    const data = await res.json();
    setFlocks(data);
  };

  const fetchCustomers = async () => {
    const res = await fetch("http://localhost:8000/api/customers/");
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    fetchSales();
    fetchFlocks();
    fetchCustomers();
  }, []);

  const form = useForm({
    defaultValues: {
      flock: "",
      customer: "",
      date: "",
      item: "Eggs",
      quantity: 0,
      unit_price: 0,
      total_price: 0,
    },
  });

  const openAddModal = () => {
    setEditingSale(null);
    form.reset({ flock: "", customer: "", date: "", item: "Eggs", quantity: 0, unit_price: 0, total_price: 0 });
    setModalOpen(true);
  };

  const openEditModal = (sale: any) => {
    setEditingSale(sale);
    form.reset({
      flock: sale.flock,
      customer: sale.customer,
      date: sale.date,
      item: sale.item,
      quantity: sale.quantity,
      unit_price: sale.unit_price,
      total_price: sale.total_price,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/api/sales/${id}/`, { method: "DELETE" });
    fetchSales();
  };

  const onSubmit = async (values: any) => {
    if (editingSale) {
      await fetch(`http://localhost:8000/api/sales/${editingSale.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } else {
      await fetch(`http://localhost:8000/api/sales/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    }
    setModalOpen(false);
    fetchSales();
  };

  const filteredSales = sales.filter((sale: any) => {
    const matchesSearch =
      sale.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      sale.item.toLowerCase().includes(search.toLowerCase()) ||
      sale.flock?.toString().includes(search) ||
      sale.date.includes(search);
    const matchesFlock = !filterFlock || String(sale.flock) === filterFlock;
    return matchesSearch && matchesFlock;
  });

  // Smart suggestions: sort customers/items by frequency (not implemented, placeholder)
  const sortedCustomers = customers; // TODO: sort by frequency
  const sortedItems = ["Eggs", "Chicken", "Live Birds", "Processed Meat"];

  // Auto-calc total price
  const watchQuantity = form.watch("quantity");
  const watchUnitPrice = form.watch("unit_price");
  useEffect(() => {
    if (form.getValues("quantity") && form.getValues("unit_price")) {
      form.setValue("total_price", Number(form.getValues("quantity")) * Number(form.getValues("unit_price")));
    }
  }, [watchQuantity, watchUnitPrice]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (modalOpen && e.key === "Enter" && document.activeElement?.tagName !== "TEXTAREA") {
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen]);

  // Bulk delete
  const handleBulkDelete = async () => {
    await Promise.all(selectedRows.map(id => fetch(`http://localhost:8000/api/sales/${id}/`, { method: "DELETE" })));
    setSelectedRows([]);
    fetchSales();
    toast({ title: "Deleted", description: "Selected sales deleted." });
  };

  // Repeat sale
  const handleRepeat = (sale: any) => {
    openAddModal();
    setTimeout(() => {
      form.reset({ ...sale, date: new Date().toISOString().split('T')[0], id: undefined });
    }, 100);
  };

  // Inline edit (for quantity, unit price, payment status)
  const handleInlineEdit = async (id: string, field: string, value: any) => {
    const sale = sales.find((s: any) => s.id === id);
    if (!sale) return;
    const updated = { ...sale, [field]: value };
    await fetch(`http://localhost:8000/api/sales/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    fetchSales();
    toast({ title: "Updated", description: `Sale ${field} updated.` });
  };

  // Customer quick view
  const handleCustomerQuickView = (customer: any) => setQuickViewCustomer(customer);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Sales</h1>
        <Button onClick={openAddModal}>Add Sale</Button>
      </div>
      <div className="mb-4">
        <label className="mr-2">Filter by Flock:</label>
        <select value={filterFlock} onChange={e => setFilterFlock(e.target.value)} className="border rounded px-2 py-1">
          <option value="">All</option>
          {flocks.map((f: any) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flock</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price ($)</TableHead>
              <TableHead>Total Price ($)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale: any) => (
              <TableRow key={sale.id}>
                <TableCell>{flocks.find((f: any) => f.id === sale.flock)?.name || sale.flock}</TableCell>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.customer_name || customers.find((c: any) => c.id === sale.customer)?.name || "Walk-in"}</TableCell>
                <TableCell>{sale.item}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>{sale.unit_price ? `$${sale.unit_price.toFixed(2)}` : '-'}</TableCell>
                <TableCell>{sale.total_price ? `$${sale.total_price.toFixed(2)}` : '-'}</TableCell>
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
              <FormField name="flock" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Flock</FormLabel>
                  <FormControl>
                    <select {...field} className="border rounded px-2 py-1 w-full">
                      <option value="">Select flock...</option>
                      {flocks.map((f: any) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="customer" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <select {...field} className="border rounded px-2 py-1 w-full">
                      <option value="">Walk-in</option>
                      {customers.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
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
              <FormField name="unit_price" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="total_price" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Price ($)</FormLabel>
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