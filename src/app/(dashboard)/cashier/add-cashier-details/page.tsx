'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Cashier {
  _id?: string;
  cashierName: string;
  userName: string;
  mobile: string;
  aadhaar: string;
  storeLocation: string;
  address: string;
  email: string;
  password: string;
}

interface FormErrors {
  cashierName?: string;
  mobile?: string;
  aadhaar?: string;
  storeLocation?: string;
  address?: string;
  email?: string;
}

export default function AddCashierPage() {
  const [formData, setFormData] = useState<Omit<Cashier, '_id' | 'userName' | 'password'>>({
    cashierName: '',
    mobile: '',
    aadhaar: '',
    storeLocation: '',
    address: '',
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() })); // Trim input
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate Cashier Name
    if (!formData.cashierName.trim()) {
      newErrors.cashierName = 'Cashier name is required';
    }

    // Validate Mobile (10 digits)
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must be a 10-digit number';
    }

    // Validate Aadhaar (12 digits)
    if (!formData.aadhaar.trim()) {
      newErrors.aadhaar = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(formData.aadhaar)) {
      newErrors.aadhaar = 'Aadhaar must be a 12-digit number';
    }

    // Validate Store Location
    if (!formData.storeLocation.trim()) {
      newErrors.storeLocation = 'Store location is required';
    }

    // Validate Address
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Validate Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCashier = async () => {
    if (!validateForm()) {
      return; // Stop submission if client-side validation fails
    }

    try {
      const response = await fetch('/api/cashier/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Cashier added. Username: ${result.userName}, Password: ${result.password}`);
        router.push('cashier/add-cashier');
      } else {
        // Map server-side duplicate errors to specific fields
        const newErrors: FormErrors = {};
        if (result.details) {
          result.details.forEach((error: string) => {
            if (error.includes('Mobile number already exists')) newErrors.mobile = error;
            if (error.includes('Aadhaar number already exists')) newErrors.aadhaar = error;
            if (error.includes('Email already exists')) newErrors.email = error;
          });
        } else {
          newErrors.mobile = result.error || 'Failed to add cashier';
        }
        setErrors(newErrors);
        toast.error(result.details?.join(', ') || result.error || 'Failed to add cashier');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error adding cashier:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Cashier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cashierName" className="text-right">Cashier Name</Label>
              <div className="col-span-3">
                <Input
                  id="cashierName"
                  name="cashierName"
                  value={formData.cashierName}
                  onChange={handleInputChange}
                  className="w-full"
                />
                {errors.cashierName && <p className="text-red-500 text-sm mt-1">{errors.cashierName}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobile" className="text-right">Mobile</Label>
              <div className="col-span-3">
                <Input
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full"
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="aadhaar" className="text-right">Aadhaar</Label>
              <div className="col-span-3">
                <Input
                  id="aadhaar"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleInputChange}
                  className="w-full"
                />
                {errors.aadhaar && <p className="text-red-500 text-sm mt-1">{errors.aadhaar}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="storeLocation" className="text-right">Store Location</Label>
              <div className="col-span-3">
                <Input
                  id="storeLocation"
                  name="storeLocation"
                  value={formData.storeLocation}
                  onChange={handleInputChange}
                  className="w-full"
                />
                {errors.storeLocation && <p className="text-red-500 text-sm mt-1">{errors.storeLocation}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">Address</Label>
              <div className="col-span-3">
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push('add-cashier')}>Cancel</Button>
            <Button onClick={handleAddCashier}>Add Cashier</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}