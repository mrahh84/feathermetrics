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

export default function ExpensesPage() {
  const router = useRouter();
  const params = useParams();
  const flockId = params?.id;
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [flockName, setFlockName] = useState<string>("");

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/flocks/${flockId}/expenses/`);
      const data = await res.json();
      setExpenses(data);
    } catch (e) {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (flockId) {
      fetch(`http://localhost:8000/api/flocks/${flockId}/`).then(res => res.json()).then(data => setFlockName(data.name)).catch(() => setFlockName("Flock"));
      fetchExpenses();
    }
  }, [flockId]);

  const form = useForm({
    defaultValues: {
      date: "",
      category: "Feed",
      amount: 0,
      description: "",
    },
  });

  const openAddModal = () => {
    setEditingExpense(null);
    form.reset({ date: "", category: "Feed", amount: 0, description: "" });
    setModalOpen(true);
  };

  const openEditModal = (expense: any) => {
    setEditingExpense(expense);
    form.reset({ date: expense.date, category: expense.category, amount: expense.amount, description: expense.description });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/api/flocks/${flockId}/expenses/${id}/`, { method: "DELETE" });
    fetchExpenses();
  };

  const onSubmit = async (values: any) => {
    if (editingExpense) {
      await fetch(`http://localhost:8000/api/flocks/${flockId}/expenses/${editingExpense.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } else {
      await fetch(`http://localhost:8000/api/flocks/${flockId}/expenses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    }
    setModalOpen(false);
    fetchExpenses();
  };

  return (
    <div className="p-8">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Flocks", href: "/flocks" }, { label: flockName || "Flock", href: `/flocks/${flockId}` }, { label: "Expenses" }]} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Button onClick={openAddModal}>Add Expense</Button>
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
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense: any) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => openEditModal(expense)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDelete(expense.id)}>
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
            <DialogTitle>{editingExpense ? "Edit Expense" : "Add Expense"}</DialogTitle>
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
              <FormField name="category" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="amount" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full">{editingExpense ? "Save Changes" : "Add Expense"}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 