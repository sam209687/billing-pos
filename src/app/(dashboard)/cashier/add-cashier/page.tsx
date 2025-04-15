'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

import { toast } from "sonner"
import { error } from 'console';

interface Cashier {
  _id: string;
  cashierName: string;
  userName: string;
  mobile: string;
  aadhaar: string;
  storeLocation: string;
  address: string;
  email: string;
}

const fetchCashiers = async (): Promise<Cashier[]> => {
  const response = await fetch('/api/cashier');
  if (!response.ok) throw new Error('Failed to fetch cashiers');
  return response.json();
};

const deleteCashier = async (id: string) => {
  const response = await fetch(`/api/cashier/${id}`, { method: 'DELETE' });
  return response.json();
};

export default function ManageCashierPage() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const router = useRouter();
 

  useEffect(() => {
    loadCashiers();
  }, []);

  const loadCashiers = async () => {
    try {
      const data = await fetchCashiers();
      setCashiers(data);
    } catch (error) {
        toast.error("Error loading cashiers")
    //   toast({
    //     title: "Error",
    //     description: "Failed to load cashiers",
    //   });
      console.error('Error loading cashiers:', error);
    }
  };

  const handleDeleteCashier = async (id: string) => {
    const result = await deleteCashier(id);
    if (result.success) {
        toast.success("Cashier deleted successfully")
    //   toast({
    //     title: "Success",
    //     description: "Cashier deleted successfully",
    //   });
      loadCashiers();
    } else {
        toast.error("Failed to delete cashier", result.error)
    //   toast({
    //     title: "Error",
    //     description: result.error || "Failed to delete cashier",
    //   });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Manage Cashiers</CardTitle>
            <Button onClick={() => router.push('/cashier/add-cashier-details')}>Add Cashier</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cashier Name</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Aadhaar</TableHead>
                <TableHead>Store Location</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashiers.map((cashier) => (
                <TableRow key={cashier._id}>
                  <TableCell>{cashier.cashierName}</TableCell>
                  <TableCell>{cashier.userName}</TableCell>
                  <TableCell>{cashier.mobile}</TableCell>
                  <TableCell>{cashier.aadhaar}</TableCell>
                  <TableCell>{cashier.storeLocation}</TableCell>
                  <TableCell>{cashier.email}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCashier(cashier._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}