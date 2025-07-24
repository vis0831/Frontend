import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard, Product } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Pagination } from '@/components/Pagination';
import { LoadingGrid } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockCategories = [
  { slug: 'electronics', name: 'Electronics', count: 25 },
  { slug: 'clothing', name: 'Clothing', count: 18 },
  { slug: 'home', name: 'Home & Garden', count: 32 },
  { slug: 'sports', name: 'Sports & Outdoors', count: 15 },
  { slug: 'books', name: 'Books', count: 12 }
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    category: "Electronics",
    rating: 4.8,
    stock: 15,
    description: "High-quality wireless headphones with noise cancellation"
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    category: "Clothing",
    rating: 4.5,
    stock: 8,
    description: "Comfortable organic cotton t-shirt"
  },
  {
    id: 3,
    name: "Smart Home Security Camera",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
    category: "Electronics",
    rating: 4.7,
    stock: 12,
    description: "AI-powered security camera with mobile alerts"
  },
  {
    id: 4,
    name: "Yoga Mat Premium",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    category: "Sports & Outdoors",
    rating: 4.6,
    stock: 20,
    description: "Non-slip premium yoga mat for professionals"
  },
  {
    id: 5,
    name: "Ceramic Plant Pot Set",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop",
    category: "Home & Garden",
    rating: 4.4,
    stock: 25,
    description: "Beautiful ceramic plant pot set for indoor plants"
  },
  {
    id: 6,
    name: "JavaScript Programming Book",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    category: "Books",
    rating: 4.9,
    stock: 30,
    description: "Comprehensive guide to modern JavaScript"
  },
  {
    id: 7,
    name: "Laptop Backpack",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    category: "Electronics",
    rating: 4.3,
    stock: 18,
    description: "Durable laptop backpack with multiple compartments"
  },
  {
    id: 8,
    name: "Running Shoes",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    category: "Sports & Outdoors",
    rating: 4.7,
    stock: 0, // Out of stock
    description: "Professional running shoes with advanced cushioning"
  }
];

interface HomePageProps {
  cartItems: Product[];
  onAddToCart: (product: Product) => void;
}

export const HomePage = ({ cartItems, onAddToCart }: HomePageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const productsPerPage = 8;

  // Simulate API call
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  // Filter products based on category and search
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      const categoryName = mockCategories.find(cat => cat.slug === selectedCategory)?.name;
      if (categoryName) {
        filtered = filtered.filter(product => product.category === categoryName);
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 fade-in">
            Discover Premium Products
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl mx-auto fade-in">
            Shop the latest trends and timeless classics with our curated collection of high-quality products.
          </p>
          <Link to="/products">
            <Button size="lg" className="btn-secondary text-lg px-8 py-3 fade-in">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground text-sm">Free shipping on orders over $50</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground text-sm">Your payment information is safe</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-muted-foreground text-sm">30-day return policy</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground text-sm">Premium quality products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <CategoryFilter
              categories={mockCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              isLoading={isLoading}
            />
            
            <div className="text-sm text-muted-foreground">
              {isLoading ? 'Loading...' : `${filteredProducts.length} products found`}
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <LoadingGrid />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No products found.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            </>
          )}

          {/* View All Products */}
          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg" className="px-8">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};