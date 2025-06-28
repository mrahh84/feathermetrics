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
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function FlocksPage() {
  const [flocks, setFlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFlock, setEditingFlock] = useState<any | null>(null);

  const fetchFlocks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/flocks/");
      const data = await res.json();
      setFlocks(data);
    } catch (e) {
      setError("Failed to load flocks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlocks();
  }, []);

  const form = useForm({
    defaultValues: {
      name: "",
      breed: "",
      initial_count: 0,
      acquisition_date: "",
    },
  });

  const openAddModal = () => {
    setEditingFlock(null);
    form.reset({ name: "", breed: "", initial_count: 0, acquisition_date: "" });
    setModalOpen(true);
  };

  const openEditModal = (flock: any) => {
    setEditingFlock(flock);
    form.reset({
      name: flock.name,
      breed: flock.breed,
      initial_count: flock.initial_count,
      acquisition_date: flock.acquisition_date,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/api/flocks/${id}/`, { method: "DELETE" });
    fetchFlocks();
  };

  const onSubmit = async (values: any) => {
    if (editingFlock) {
      await fetch(`http://localhost:8000/api/flocks/${editingFlock.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } else {
      await fetch("http://localhost:8000/api/flocks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    }
    setModalOpen(false);
    fetchFlocks();
  };

  return (
    <div className="p-8">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Flocks" }]} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Flocks</h1>
        <Button onClick={openAddModal}>Add Flock</Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Breed</TableHead>
              <TableHead>Initial Count</TableHead>
              <TableHead>Acquisition Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flocks.map((flock: any) => (
              <TableRow key={flock.id}>
                <TableCell>{flock.name}</TableCell>
                <TableCell>{flock.breed}</TableCell>
                <TableCell>{flock.initial_count}</TableCell>
                <TableCell>{flock.acquisition_date}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => openEditModal(flock)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDelete(flock.id)}>
                    Delete
                  </Button>
                  <Button size="sm" className="ml-2" variant="default" onClick={() => window.location.href = `/flocks/${flock.id}`}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFlock ? "Edit Flock" : "Add Flock"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="breed" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="initial_count" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Count</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="acquisition_date" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Acquisition Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full">{editingFlock ? "Save Changes" : "Add Flock"}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 