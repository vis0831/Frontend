import { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, TrendingUp, Package, Clock, Truck, CheckCircle } from 'lucide-react';
import { adminAPI } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

interface DashboardData {
  total_users: number;
  total_orders: number;
  total_revenue: number;
  orders_by_status: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

export const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardData = await adminAPI.getDashboard();
        setData(dashboardData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const statusIcons = {
    pending: Clock,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of your e-commerce platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{data.total_users.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{data.total_orders.toLocaleString()}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-secondary" />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">${data.total_revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-secondary" />
            </div>
          </div>

          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth</p>
                <p className="text-2xl font-bold text-success">+12.5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold mb-6">Orders by Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(data.orders_by_status).map(([status, count]) => {
              const Icon = statusIcons[status as keyof typeof statusIcons] || Package;
              return (
                <div key={status} className="text-center p-4 bg-muted/30 rounded-lg">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-secondary" />
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-sm text-muted-foreground capitalize">{status}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};