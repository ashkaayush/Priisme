import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shirt, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fashion/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ai/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-beauty/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-ai" />
            <span className="text-sm font-medium">India's First AI-Powered Style Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Your Style,{" "}
            <span className="text-gradient">Redefined</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            AI-powered styling, personalized fashion recommendations, and trusted salon bookings—all designed around you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" className="w-full sm:w-auto gap-2" asChild>
              <Link to="/auth?mode=signup">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link to="/ai-styling">Try AI Styling</Link>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="AI Style Analysis"
              description="Get personalized recommendations based on your unique features"
              gradient="text-gradient-ai"
            />
            <FeatureCard
              icon={<Shirt className="w-6 h-6" />}
              title="Smart Fashion"
              description="Shop outfits that truly match your style and body type"
              gradient="text-gradient-fashion"
            />
            <FeatureCard
              icon={<Scissors className="w-6 h-6" />}
              title="Salon Booking"
              description="Book verified beauty professionals near you"
              gradient="text-gradient-beauty"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300 group">
      <div className={`mb-4 ${gradient}`}>{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
