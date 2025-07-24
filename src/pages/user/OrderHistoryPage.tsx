import { useState, useEffect } from 'react';
import { Package, Calendar, DollarSign, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { userAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  created_at: string;
  items: OrderItem[];
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'bg-yellow-500',
    text: 'Pending',
    description: 'Order received and being processed'
  },
  processing: {
    icon: Package,
    color: 'bg-blue-500',
    text: 'Processing',
    description: 'Order is being prepared'
  },
  shipped: {
    icon: Truck,
    color: 'bg-purple-500',
    text: 'Shipped',
    description: 'Order is on its way'
  },
  delivered: {
    icon: CheckCircle,
    color: 'bg-green-500',
    text: 'Delivered',
    description: 'Order has been delivered'
  },
  cancelled: {
    icon: XCircle,
    color: 'bg-red-500',
    text: 'Cancelled',
    description: 'Order has been cancelled'
  }
};

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await userAPI.getOrders();
        setOrders(ordersData as Order[]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load order history.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Order History</h1>
          <p className="text-muted-foreground">Track and manage your past orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your order history here!
            </p>
            <a
              href="/"
              className="btn-primary inline-flex items-center px-6 py-3 rounded-lg text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={order.id} className="card-elevated p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${statusInfo.color} rounded-full flex items-center justify-center`}>
                        <StatusIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Order {order.id}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end mt-4 sm:mt-0">
                      <Badge className={`${statusInfo.color} text-white mb-2`}>
                        {statusInfo.text}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-lg font-bold text-foreground">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Description */}
                  <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Items ({order.items.length})</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border">
                    {order.status === 'delivered' && (
                      <button className="text-sm text-secondary hover:underline">
                        Rate & Review
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button className="text-sm text-secondary hover:underline">
                        Track Package
                      </button>
                    )}
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button className="text-sm text-destructive hover:underline">
                        Cancel Order
                      </button>
                    )}
                    <button className="text-sm text-secondary hover:underline">
                      View Details
                    </button>
                    <button className="text-sm text-secondary hover:underline">
                      Download Invoice
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};