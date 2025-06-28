"use client";
import { useEffect, useState } from "react";
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

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [flocks, setFlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [filterFlock, setFilterFlock] = useState<string>("");

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/expenses/`);
      const data = await res.json();
      setExpenses(data);
    } catch (e) {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const fetchFlocks = async () => {
    const res = await fetch("http://localhost:8000/api/flocks/");
    const data = await res.json();
    setFlocks(data);
  };

  useEffect(() => {
    fetchExpenses();
    fetchFlocks();
  }, []);

  const form = useForm({
    defaultValues: {
      flock: "",
      date: "",
      category: "Feed",
      amount: 0,
      description: "",
    },
  });

  const openAddModal = () => {
    setEditingExpense(null);
    form.reset({ flock: "", date: "", category: "Feed", amount: 0, description: "" });
    setModalOpen(true);
  };

  const openEditModal = (expense: any) => {
    setEditingExpense(expense);
    form.reset({
      flock: expense.flock,
      date: expense.date,
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/api/expenses/${id}/`, { method: "DELETE" });
    fetchExpenses();
  };

  const onSubmit = async (values: any) => {
    if (editingExpense) {
      await fetch(`http://localhost:8000/api/expenses/${editingExpense.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } else {
      await fetch(`http://localhost:8000/api/expenses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    }
    setModalOpen(false);
    fetchExpenses();
  };

  const filteredExpenses = filterFlock ? expenses.filter((e: any) => String(e.flock) === filterFlock) : expenses;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Expenses</h1>
        <Button onClick={openAddModal}>Add Expense</Button>
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
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense: any) => (
              <TableRow key={expense.id}>
                <TableCell>{flocks.find((f: any) => f.id === expense.flock)?.name || expense.flock}</TableCell>
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