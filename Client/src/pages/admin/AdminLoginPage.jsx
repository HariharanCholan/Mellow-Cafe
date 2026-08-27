import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import API_BASE_URL from '@/config/api';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: authLogin } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Login Failed', description: data.message, variant: 'destructive' });
        return;
      }
      authLogin(data.user, data.token);
      if (data.user.role && ['admin', 'staff', 'worker', 'super_admin'].includes(data.user.role)) {
        navigate('/admin/dashboard');
      } else {
        toast({ title: 'Access Denied', description: "You don't have admin access yet.", variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <Card className="w-full max-w-md shadow-lg border border-stone-200/80 bg-white">
        <div className="p-4 pb-0 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-xs font-medium text-stone-500 hover:text-amber-800 transition-colors"
          >
            &larr; Back to Login
          </button>
        </div>
        <CardHeader className="text-center pt-4">
          <CardTitle className="text-2xl font-bold font-serif text-stone-900">Admin Portal Login</CardTitle>
          <p className="text-sm text-stone-500 mt-1">Enter admin credentials to access the dashboard</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Email</Label>
              <Input id="email" type="email" required onChange={handleChange} className="border-stone-200 bg-stone-50/50" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Password</Label>
              <Input id="password" type="password" required onChange={handleChange} className="border-stone-200 bg-stone-50/50" />
            </div>
            <Button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-2 rounded-md transition-colors">
              Login as Admin
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
