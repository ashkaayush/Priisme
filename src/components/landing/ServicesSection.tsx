import { Link } from "react-router-dom";
import { ArrowRight, Camera, ShoppingBag, Calendar, Star, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "ai-styling",
    title: "AI Styling",
    description: "Upload your photo and let our AI analyze your features to provide personalized style recommendations.",
    icon: Camera,
    href: "/ai-styling",
    gradient: "from-ai to-ai/50",
    features: [
      { icon: Zap, text: "Face shape analysis" },
      { icon: Star, text: "Skin tone matching" },
      { icon: Users, text: "Body proportions" },
    ],
  },
  {
    id: "fashion",
    title: "Fashion Shopping",
    description: "Discover AI-curated outfits that match your style profile with virtual try-on previews.",
    icon: ShoppingBag,
    href: "/fashion",
    gradient: "from-fashion to-fashion/50",
    features: [
      { icon: Zap, text: "Personalized picks" },
      { icon: Star, text: "Virtual try-on" },
      { icon: Users, text: "Style matching" },
    ],
  },
  {
    id: "salons",
    title: "Salon & Beauty",
    description: "Book verified salons, makeup artists, and stylists near you with ratings and reviews.",
    icon: Calendar,
    href: "/salons",
    gradient: "from-beauty to-beauty/50",
    features: [
      { icon: Zap, text: "Verified professionals" },
      { icon: Star, text: "Real reviews" },
      { icon: Users, text: "Easy booking" },
    ],
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            One Platform, Complete Style
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to discover, express, and enhance your personal style
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: typeof services[0];
  index: number;
}) {
  const Icon = service.icon;

  return (
    <div
      className="group relative bg-card rounded-2xl border border-border p-8 hover:shadow-xl transition-all duration-500 overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Gradient background on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6`}>
          <Icon className="w-7 h-7 text-primary-foreground" />
        </div>

        <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
        <p className="text-muted-foreground mb-6">{service.description}</p>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {service.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <feature.icon className="w-4 h-4 text-muted-foreground" />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
          <Link to={service.href} className="gap-2">
            Explore
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
