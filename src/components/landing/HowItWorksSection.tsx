import { UserPlus, Camera, Sparkles, ShoppingBag } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up in seconds with email or social login",
  },
  {
    number: "02",
    icon: Camera,
    title: "Upload Photo",
    description: "Share a photo securely for AI analysis",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Get AI Analysis",
    description: "Receive your personalized style profile",
  },
  {
    number: "04",
    icon: ShoppingBag,
    title: "Take Action",
    description: "Shop, book salons, or get styling advice",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How PRIISME Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to unlock your perfect style
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
}: {
  step: typeof steps[0];
  index: number;
}) {
  const Icon = step.icon;

  return (
    <div className="relative">
      {/* Connector line */}
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-10 left-1/2 w-full h-px bg-border" />
      )}

      <div className="relative bg-card rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-all duration-300">
        {/* Step number */}
        <div className="text-5xl font-bold text-muted-foreground/20 mb-4">
          {step.number}
        </div>

        {/* Icon */}
        <div className="w-12 h-12 mx-auto rounded-full bg-primary flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>

        {/* Content */}
        <h3 className="font-semibold mb-2">{step.title}</h3>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>
    </div>
  );
}
