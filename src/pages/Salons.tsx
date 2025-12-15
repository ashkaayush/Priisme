import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scissors, MapPin, Star, Clock, Search, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Salon {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  image_url: string;
  rating: number;
  review_count: number;
  price_range: string;
  is_verified: boolean;
  opening_hours: Record<string, string>;
}

interface SalonService {
  id: string;
  salon_id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  category: string;
}

const serviceCategories = ["All", "Haircut", "Color", "Makeup", "Spa", "Nails", "Grooming"];
const timeSlots = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00",
];

export default function Salons() {
  const [searchParams] = useSearchParams();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [services, setServices] = useState<SalonService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Booking state
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [selectedService, setSelectedService] = useState<SalonService | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [salonsRes, servicesRes] = await Promise.all([
      supabase.from("salons").select("*"),
      supabase.from("salon_services").select("*"),
    ]);

    if (salonsRes.data) setSalons(salonsRes.data as any);
    if (servicesRes.data) setServices(servicesRes.data as any);
    setIsLoading(false);
  };

  const getSalonServices = (salonId: string) => {
    return services.filter((s) => s.salon_id === salonId);
  };

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const handleBooking = async () => {
    if (!selectedSalon || !selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select all booking details",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book an appointment",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      // Create checkout session for the booking
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: [{
            name: `${selectedService.name} at ${selectedSalon.name}`,
            description: `${format(selectedDate, "PPP")} at ${selectedTime}`,
            price: selectedService.price,
            quantity: 1,
          }],
          type: "booking",
        },
      });

      if (error) throw error;

      // Create pending booking
      await supabase.from("bookings").insert({
        user_id: user.id,
        salon_id: selectedSalon.id,
        service_id: selectedService.id,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        booking_time: selectedTime,
        total_amount: selectedService.price,
        stripe_session_id: data.sessionId,
        status: "pending",
      });

      if (data?.url) {
        window.open(data.url, "_blank");
      }

      // Reset booking state
      setSelectedSalon(null);
      setSelectedService(null);
      setSelectedDate(undefined);
      setSelectedTime("");
      setBookingStep(1);
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const filteredSalons = salons.filter((salon) => {
    const matchesSearch = salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === "All") return matchesSearch;
    
    const salonServices = getSalonServices(salon.id);
    const hasCategory = salonServices.some((s) => 
      s.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
    
    return matchesSearch && hasCategory;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-12 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-beauty/10 border border-beauty/20 mb-6">
                <Scissors className="w-4 h-4 text-beauty" />
                <span className="text-sm font-medium">Verified Professionals</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Book <span className="text-gradient-beauty">Trusted Salons</span>
              </h1>

              <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                Discover and book verified salons, makeup artists, and stylists near you.
              </p>

              {/* Search */}
              <div className="max-w-xl mx-auto flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search salons or locations..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b border-border sticky top-16 bg-background z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {serviceCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Salons Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-video bg-secondary animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSalons.map((salon) => (
                  <SalonCard
                    key={salon.id}
                    salon={salon}
                    services={getSalonServices(salon.id)}
                    formatPrice={formatPrice}
                    onBook={() => {
                      setSelectedSalon(salon);
                      setBookingStep(1);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-beauty text-beauty-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Are You a Salon Owner?
            </h2>
            <p className="text-beauty-foreground/80 mb-6 max-w-xl mx-auto">
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

      {/* Booking Dialog */}
      <Dialog open={!!selectedSalon} onOpenChange={() => {
        setSelectedSalon(null);
        setSelectedService(null);
        setSelectedDate(undefined);
        setSelectedTime("");
        setBookingStep(1);
      }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {bookingStep === 1 && "Select Service"}
              {bookingStep === 2 && "Choose Date & Time"}
              {bookingStep === 3 && "Confirm Booking"}
            </DialogTitle>
          </DialogHeader>

          {selectedSalon && (
            <div className="space-y-4">
              {/* Step 1: Select Service */}
              {bookingStep === 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Booking at <span className="font-medium text-foreground">{selectedSalon.name}</span>
                  </p>
                  {getSalonServices(selectedSalon.id).map((service) => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service);
                        setBookingStep(2);
                      }}
                      className="w-full p-4 rounded-xl border border-border hover:border-beauty/50 transition-colors text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration_minutes} mins</span>
                          </div>
                        </div>
                        <span className="font-semibold">{formatPrice(service.price)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Date & Time */}
              {bookingStep === 2 && selectedService && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="font-medium">{selectedService.name}</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(selectedService.price)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Date</label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select Time</label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setBookingStep(1)}>
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setBookingStep(3)}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {bookingStep === 3 && selectedService && selectedDate && selectedTime && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedSalon.image_url}
                        alt={selectedSalon.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{selectedSalon.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedSalon.address}</p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-medium">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{format(selectedDate, "PPP")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{selectedService.duration_minutes} mins</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold">{formatPrice(selectedService.price)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setBookingStep(2)}>
                      Back
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      onClick={handleBooking}
                      disabled={isBooking}
                    >
                      {isBooking ? "Processing..." : "Confirm & Pay"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment powered by Stripe
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SalonCard({
  salon,
  services,
  formatPrice,
  onBook,
}: {
  salon: Salon;
  services: SalonService[];
  formatPrice: (paise: number) => string;
  onBook: () => void;
}) {
  const categories = [...new Set(services.map((s) => s.category).filter(Boolean))];

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={salon.image_url}
          alt={salon.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {salon.is_verified && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-success text-success-foreground text-xs font-medium rounded flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Verified
          </div>
        )}

        <div className="absolute top-3 right-3 px-2 py-1 bg-card/90 text-xs font-medium rounded">
          {salon.price_range}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold">{salon.name}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{salon.rating}</span>
            <span className="text-xs text-muted-foreground">({salon.review_count})</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span>{salon.address}, {salon.city}</span>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full capitalize"
            >
              {category}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Button className="w-full" onClick={onBook}>
          Book Appointment
        </Button>
      </div>
    </div>
  );
}
