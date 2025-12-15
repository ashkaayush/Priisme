import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Star, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";

// Sample products for demo
const products = [
  {
    id: 1,
    name: "Classic White Kurta",
    price: 2499,
    originalPrice: 3999,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    category: "Ethnic",
  },
  {
    id: 2,
    name: "Embroidered Anarkali",
    price: 4999,
    originalPrice: 6999,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop",
    category: "Ethnic",
  },
  {
    id: 3,
    name: "Designer Silk Saree",
    price: 8999,
    originalPrice: 12999,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
    category: "Sarees",
  },
  {
    id: 4,
    name: "Casual Denim Jacket",
    price: 1999,
    originalPrice: 2999,
    rating: 4.6,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    category: "Western",
  },
  {
    id: 5,
    name: "Printed Maxi Dress",
    price: 2299,
    originalPrice: 3499,
    rating: 4.5,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop",
    category: "Western",
  },
  {
    id: 6,
    name: "Bridal Lehenga Set",
    price: 24999,
    originalPrice: 34999,
    rating: 5.0,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1583391733975-d4d1f7198d0c?w=400&h=500&fit=crop",
    category: "Bridal",
  },
];

const categories = ["All", "Ethnic", "Western", "Sarees", "Bridal"];

export default function Fashion() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fashion/10 border border-fashion/20 mb-6">
                <ShoppingBag className="w-4 h-4 text-fashion" />
                <span className="text-sm font-medium">AI-Curated for You</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Fashion That <span className="text-gradient-fashion">Fits You</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Discover outfits perfectly matched to your style profile with virtual try-on previews.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                  className="flex-shrink-0"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="gap-2">
                Load More
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-fashion text-fashion-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Personalized Recommendations
            </h2>
            <p className="text-lg text-fashion-foreground/80 mb-8 max-w-2xl mx-auto">
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

function ProductCard({ product }: { product: typeof products[0] }) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Discount badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded">
          {discount}% OFF
        </div>

        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-8 h-8 rounded-full bg-card/90 flex items-center justify-center hover:bg-card">
            <Heart className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full bg-card/90 flex items-center justify-center hover:bg-card">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="text-xs text-muted-foreground">{product.category}</span>
        <h3 className="font-medium mt-1 mb-2">{product.name}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">₹{product.price.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground line-through">
            ₹{product.originalPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
