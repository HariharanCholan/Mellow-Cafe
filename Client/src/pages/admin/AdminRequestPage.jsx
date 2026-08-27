import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import API_BASE_URL from '@/config/api';

const AdminRequestPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', reason: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Request failed', description: data.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: data.message });
      navigate('/login');
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <Card className="w-full max-w-md shadow-lg border border-stone-200/80 bg-white">
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl font-bold font-serif text-stone-900">Admin Access Request</CardTitle>
          <p className="text-sm text-stone-500 mt-1">Fill the form and we will review your request.</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Name</Label>
              <Input id="name" required onChange={handleChange} className="border-stone-200 bg-stone-50/50" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Email</Label>
              <Input id="email" type="email" required onChange={handleChange} className="border-stone-200 bg-stone-50/50" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reason" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Reason (optional)</Label>
              <Input id="reason" onChange={handleChange} className="border-stone-200 bg-stone-50/50" />
            </div>
            <Button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-2 rounded-md transition-colors">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRequestPage;
