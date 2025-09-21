'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { fetchProducts } from '@/lib/product';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardDescription,
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  SearchIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  PackageIcon,
  SortAscIcon,
  SortDescIcon,
  LeafIcon,
  TrendingUpIcon
} from 'lucide-react';

// Mock products data - In production, this would come from your API
const mockProducts = [
  {
    id: 'eco-classic-001',
    name: 'Eco-Hydrate Classic',
    description: 'Our signature eco-friendly water bottle made from 100% recycled materials',
    price: 29.99,
    originalPrice: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    stock: 25,
    category: 'classic',
    rating: 4.8,
    reviews: 124,
    isNew: false,
    isBestseller: true,
    features: ['BPA-Free', 'Leak-Proof', '500ml Capacity']
  },
  {
    id: 'eco-pro-002',
    name: 'Eco-Hydrate Pro',
    description: 'Premium water bottle with temperature control and smart tracking',
    price: 39.99,
    originalPrice: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop',
    stock: 18,
    category: 'premium',
    rating: 4.9,
    reviews: 89,
    isNew: true,
    isBestseller: false,
    features: ['Temperature Display', 'Smart Tracking', '750ml Capacity']
  },
  {
    id: 'eco-sport-003',
    name: 'Eco-Hydrate Sport',
    description: 'Designed for athletes with ergonomic grip and quick-flow cap',
    price: 34.99,
    originalPrice: 44.99,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    stock: 32,
    category: 'sport',
    rating: 4.7,
    reviews: 156,
    isNew: false,
    isBestseller: true,
    features: ['Ergonomic Design', 'Quick-Flow Cap', '600ml Capacity']
  },
  {
    id: 'eco-mini-004',
    name: 'Eco-Hydrate Mini',
    description: 'Compact size perfect for kids and on-the-go hydration',
    price: 24.99,
    originalPrice: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    stock: 45,
    category: 'compact',
    rating: 4.6,
    reviews: 78,
    isNew: false,
    isBestseller: false,
    features: ['Compact Size', 'Kid-Friendly', '350ml Capacity']
  },
  {
    id: 'eco-xl-005',
    name: 'Eco-Hydrate XL',
    description: 'Extra large capacity for extended outdoor adventures',
    price: 44.99,
    originalPrice: 54.99,
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0200ba2fe65?w=400&h=400&fit=crop',
    stock: 12,
    category: 'outdoor',
    rating: 4.9,
    reviews: 203,
    isNew: true,
    isBestseller: true,
    features: ['1L Capacity', 'Insulated', 'Adventure Ready']
  },
  {
    id: 'eco-glass-006',
    name: 'Eco-Hydrate Glass',
    description: 'Premium borosilicate glass bottle with protective sleeve',
    price: 49.99,
    originalPrice: 59.99,
    imageUrl: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&h=400&fit=crop',
    stock: 8,
    category: 'premium',
    rating: 4.8,
    reviews: 67,
    isNew: true,
    isBestseller: false,
    features: ['Borosilicate Glass', 'Protective Sleeve', '500ml Capacity']
  }
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // In production, fetch real products from API
    // fetchProducts().then(setProducts);
    
    // Show welcome toast on first visit
    const hasShownWelcome = sessionStorage.getItem('products-welcome-shown');
    if (!hasShownWelcome) {
      toast.success('Welcome to our product catalog!', {
        description: 'Discover our range of eco-friendly water bottles',
        duration: 3000,
      });
      sessionStorage.setItem('products-welcome-shown', 'true');
    }
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'name':
        default:
          comparison = a.name.localeCompare(b.name);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchQuery, selectedCategory, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'classic', label: 'Classic' },
    { value: 'premium', label: 'Premium' },
    { value: 'sport', label: 'Sport' },
    { value: 'compact', label: 'Compact' },
    { value: 'outdoor', label: 'Outdoor' }
  ];

  const handleAddToCart = (product: any) => {
    toast.success('Added to cart!', {
      description: `${product.name} has been added to your cart`,
      action: {
        label: 'View Cart',
        onClick: () => {
          toast.info('Cart functionality coming soon!');
        },
      },
    });
  };

  const handleAddToWishlist = (product: any) => {
    toast.success('Added to wishlist!', {
      description: `${product.name} has been saved to your wishlist`,
      action: {
        label: 'View Wishlist',
        onClick: () => {
          router.push('/dashboard');
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <LeafIcon className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Eco-Hydrate Collection</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our range of sustainable water bottles designed for every lifestyle. 
              Made from recycled materials and built to last.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAscIcon className="h-4 w-4" /> : <SortDescIcon className="h-4 w-4" />}
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">View:</Label>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <GridIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none border-l"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <PackageIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </span>
          </div>
          {filteredProducts.length === 0 && searchQuery && (
            <Badge variant="outline">No results found</Badge>
          )}
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <PackageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                toast.info('Filters cleared');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {paginatedProducts.map((product) => (
              <Card 
                key={product.id} 
                className={cn(
                  "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                  viewMode === 'list' && "flex flex-row"
                )}
              >
                <div className={cn(
                  "relative",
                  viewMode === 'list' ? "w-48 flex-shrink-0" : "w-full"
                )}>
                  <div className={cn(
                    "relative bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center",
                    viewMode === 'list' ? "h-full" : "h-48"
                  )}>
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={viewMode === 'list' ? 120 : 200}
                      height={viewMode === 'list' ? 120 : 200}
                      className="object-contain transition-transform group-hover:scale-105"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <Badge className="bg-blue-500 hover:bg-blue-600">
                          New
                        </Badge>
                      )}
                      {product.isBestseller && (
                        <Badge className="bg-orange-500 hover:bg-orange-600">
                          <TrendingUpIcon className="h-3 w-3 mr-1" />
                          Bestseller
                        </Badge>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                      onClick={() => handleAddToWishlist(product)}
                    >
                      <HeartIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1">
                  <CardHeader className={cn(viewMode === 'list' && "pb-2")}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <StarIcon 
                                key={i} 
                                className={cn(
                                  "h-3 w-3",
                                  i < Math.floor(product.rating) 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-gray-300"
                                )} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {product.rating} ({product.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className={cn("space-y-4", viewMode === 'list' && "py-2")}>
                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">${product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Badge 
                          variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}
                          className="text-xs mb-4"
                        >
                          {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className={cn("gap-2", viewMode === 'list' && "pt-2")}>
                    <Button 
                      className="flex-1"
                      disabled={product.stock === 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCartIcon className="h-3 w-3 mr-1.5" />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/products/${product.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                        toast.info(`Page ${currentPage - 1}`);
                      }
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                        toast.info(`Viewing page ${page}`);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                        toast.info(`Page ${currentPage + 1}`);
                      }
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
