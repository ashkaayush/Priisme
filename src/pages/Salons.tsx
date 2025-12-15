import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scissors, MapPin, Star, Clock, Search, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Sample salons for demo
const salons = [
  {
    id: 1,
    name: "Glamour Studio",
    rating: 4.9,
    reviews: 245,
    address: "Koramangala, Bangalore",
    distance: "2.3 km",
    services: ["Haircut", "Makeup", "Bridal"],
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    priceRange: "₹₹₹",
    openNow: true,
  },
  {
    id: 2,
    name: "The Hair Bar",
    rating: 4.7,
    reviews: 189,
    address: "Indiranagar, Bangalore",
    distance: "3.1 km",
    services: ["Haircut", "Color", "Styling"],
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=300&fit=crop",
    priceRange: "₹₹",
    openNow: true,
  },
  {
    id: 3,
    name: "Radiance Spa & Salon",
    rating: 4.8,
    reviews: 312,
    address: "HSR Layout, Bangalore",
    distance: "4.5 km",
    services: ["Spa", "Facial", "Massage"],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
    priceRange: "₹₹₹₹",
    openNow: false,
  },
  {
    id: 4,
    name: "Style Studio",
    rating: 4.6,
    reviews: 156,
    address: "JP Nagar, Bangalore",
    distance: "5.2 km",
    services: ["Haircut", "Beard", "Grooming"],
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop",
    priceRange: "₹₹",
    openNow: true,
  },
  {
    id: 5,
    name: "Luxe Beauty Lounge",
    rating: 4.9,
    reviews: 278,
    address: "Whitefield, Bangalore",
    distance: "8.3 km",
    services: ["Makeup", "Nails", "Bridal"],
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
    priceRange: "₹₹₹₹",
    openNow: true,
  },
  {
    id: 6,
    name: "Urban Cuts",
    rating: 4.5,
    reviews: 134,
    address: "Electronic City, Bangalore",
    distance: "12 km",
    services: ["Haircut", "Color", "Treatment"],
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=300&fit=crop",
    priceRange: "₹₹",
    openNow: true,
  },
];

const serviceFilters = ["All", "Haircut", "Makeup", "Bridal", "Spa", "Nails"];

export default function Salons() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-beauty/10 border border-beauty/20 mb-6">
                <Scissors className="w-4 h-4 text-beauty" />
                <span className="text-sm font-medium">Verified Professionals</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Book <span className="text-gradient-beauty">Trusted Salons</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Discover and book verified salons, makeup artists, and stylists near you.
              </p>

              {/* Search */}
              <div className="max-w-xl mx-auto flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search salons, services, or locations..."
                    className="pl-10"
                  />
                </div>
                <Button>Search</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {serviceFilters.map((filter) => (
                <Button
                  key={filter}
                  variant={filter === "All" ? "default" : "outline"}
                  size="sm"
                  className="flex-shrink-0"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Salons Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salons.map((salon) => (
                <SalonCard key={salon.id} salon={salon} />
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
        <section className="py-24 bg-beauty text-beauty-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Are You a Salon Owner?
            </h2>
            <p className="text-lg text-beauty-foreground/80 mb-8 max-w-2xl mx-auto">
              Join PRIISME and reach thousands of customers looking for quality beauty services.
            </p>
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <Link to="/auth?mode=signup">
                Partner With Us
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

function SalonCard({ salon }: { salon: typeof salons[0] }) {
  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={salon.image}
          alt={salon.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Status badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded ${
          salon.openNow 
            ? "bg-success text-success-foreground" 
            : "bg-muted text-muted-foreground"
        }`}>
          {salon.openNow ? "Open Now" : "Closed"}
        </div>

        <div className="absolute top-3 right-3 px-2 py-1 bg-card/90 text-xs font-medium rounded">
          {salon.priceRange}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold">{salon.name}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{salon.rating}</span>
            <span className="text-xs text-muted-foreground">({salon.reviews})</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span>{salon.address}</span>
          <span>•</span>
          <span>{salon.distance}</span>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {salon.services.map((service) => (
            <span
              key={service}
              className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
            >
              {service}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Button className="w-full" variant="outline">
          Book Appointment
        </Button>
      </div>
    </div>
  );
}
