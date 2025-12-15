import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ArrowRight, Star, Heart, ShoppingCart, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  sizes: string[];
  colors: string[];
  rating: number;
  review_count: number;
  category: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Fashion() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from("products").select(`*, category:categories(name, slug)`),
      supabase.from("categories").select("*"),
    ]);

    if (productsRes.data) {
      setProducts(productsRes.data as any);
    }
    if (categoriesRes.data) {
      setCategories(categoriesRes.data);
    }
    setIsLoading(false);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category?.slug === selectedCategory);

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const handleAddToCart = async (product: Product) => {
    const defaultSize = product.sizes?.[0] || undefined;
    const defaultColor = product.colors?.[0] || undefined;
    await addToCart(product.id, 1, defaultSize, defaultColor);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-12 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fashion/10 border border-fashion/20 mb-6">
                <ShoppingBag className="w-4 h-4 text-fashion" />
                <span className="text-sm font-medium">AI-Curated for You</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Fashion That <span className="text-gradient-fashion">Fits You</span>
              </h1>

              <p className="text-muted-foreground max-w-xl mx-auto">
                Discover outfits perfectly matched to your style profile
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b border-border sticky top-16 bg-background z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-secondary animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No products found in this category</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-fashion text-fashion-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Get Personalized Recommendations
            </h2>
            <p className="text-fashion-foreground/80 mb-6 max-w-xl mx-auto">
              Complete your style profile to see outfits curated just for you.
            </p>
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <Link to="/ai-styling">
                Start Style Analysis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
  formatPrice,
}: {
  product: Product;
  onAddToCart: () => void;
  formatPrice: (paise: number) => string;
}) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {discount > 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded">
            {discount}% OFF
          </div>
        )}

        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-8 h-8 rounded-full bg-card/90 flex items-center justify-center hover:bg-card">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button className="w-full gap-2" onClick={onAddToCart}>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="text-xs text-muted-foreground">{product.category?.name}</span>
        <h3 className="font-medium mt-1 mb-2">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({product.review_count} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.original_price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {(product.sizes as string[]).slice(0, 4).map((size) => (
              <Badge key={size} variant="outline" className="text-xs">
                {size}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
