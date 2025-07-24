import { useState } from 'react';
import { CheckCircle, Package, Truck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from './CartPage';

interface CheckoutPageProps {
  cartItems: CartItem[];
  orderTotal: number;
  onOrderComplete: () => void;
}

export const CheckoutPage = ({ cartItems, orderTotal, onOrderComplete }: CheckoutPageProps) => {
  const [orderNumber] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase());
  const [currentDate] = useState(() => new Date().toLocaleDateString());

  const handleContinueShopping = () => {
    onOrderComplete();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thank you for your purchase. Your order has been successfully placed and is being processed.
          </p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Order Info */}
          <div className="card-elevated p-6">
            <h3 className="text-xl font-semibold mb-4">Order Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-medium">#{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium">{currentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-semibold text-lg">${orderTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span className="font-medium">Credit Card (**** 4567)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="card-elevated p-6">
            <h3 className="text-xl font-semibold mb-4">Delivery Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-secondary mt-1" />
                <div>
                  <p className="font-medium">Processing</p>
                  <p className="text-sm text-muted-foreground">Your order is being prepared</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium text-muted-foreground">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground">3-5 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card-elevated p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="card-elevated p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>You'll receive an email confirmation shortly</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>We'll notify you when your order ships</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Track your package using the tracking number we'll provide</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Button
            onClick={handleContinueShopping}
            size="lg"
            className="btn-primary px-8"
          >
            Continue Shopping
          </Button>
          <div>
            <Button variant="outline" className="mx-2">
              Print Receipt
            </Button>
            <Button variant="outline" className="mx-2">
              Track Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};