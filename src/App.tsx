import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage, CartItem } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ProfilePage } from "./pages/user/ProfilePage";
import { OrderHistoryPage } from "./pages/user/OrderHistoryPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { Product } from "./components/ProductCard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleProceedToCheckout = () => {
    // In a real app, this would integrate with payment processing
    setIsCheckoutComplete(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setIsCheckoutComplete(false);
    // Navigate back to home
    window.location.href = '/';
  };

  const handleSearch = (query: string) => {
    // In a real app, this would filter products based on search query
    console.log('Searching for:', query);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const orderTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.08 + (cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 50 ? 0 : 9.99);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar cartItemCount={cartItemCount} onSearch={handleSearch} />
              <main className="flex-1">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <HomePage 
                        cartItems={cartItems}
                        onAddToCart={handleAddToCart}
                      />
                    } 
                  />
                  <Route 
                    path="/product/:id" 
                    element={
                      <ProductDetailPage 
                        onAddToCart={handleAddToCart}
                      />
                    } 
                  />
                  <Route 
                    path="/cart" 
                    element={
                      isCheckoutComplete ? (
                        <CheckoutPage 
                          cartItems={cartItems}
                          orderTotal={orderTotal}
                          onOrderComplete={handleOrderComplete}
                        />
                      ) : (
                        <CartPage 
                          cartItems={cartItems}
                          onUpdateQuantity={handleUpdateQuantity}
                          onRemoveItem={handleRemoveItem}
                          onProceedToCheckout={handleProceedToCheckout}
                        />
                      )
                    } 
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <OrderHistoryPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
