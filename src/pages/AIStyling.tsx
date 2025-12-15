import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, ArrowRight, CheckCircle, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Face shape analysis",
  "Skin tone detection",
  "Body proportions",
  "Personal color palette",
  "Style personality",
  "Hair recommendations",
];

export default function AIStyling() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-24 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ai/10 border border-ai/20 mb-8">
                <Sparkles className="w-4 h-4 text-ai" />
                <span className="text-sm font-medium">Powered by Advanced AI</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                AI Style <span className="text-gradient-ai">Analysis</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Upload your photo and let our AI analyze your unique features to create a personalized style profile just for you.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-ai hover:bg-ai/90" asChild>
                  <Link to="/auth?mode=signup">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What we analyze */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  What Our AI Analyzes
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Using advanced computer vision and machine learning, we analyze multiple aspects of your appearance to provide accurate, personalized recommendations.
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-ai flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl bg-card border border-border p-8 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-ai/10 flex items-center justify-center mb-6">
                    <Camera className="w-12 h-12 text-ai" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Upload Your Photo</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Your photos are processed securely and never shared
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>End-to-end encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to unlock your personalized style profile
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Upload Photo",
                  description: "Take or upload a clear photo of yourself",
                },
                {
                  step: "2",
                  title: "AI Analysis",
                  description: "Our AI analyzes your unique features",
                },
                {
                  step: "3",
                  title: "Get Results",
                  description: "Receive your personalized style profile",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-ai text-ai-foreground flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-ai text-ai-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Discover Your Style?
            </h2>
            <p className="text-lg text-ai-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their look with AI-powered styling.
            </p>
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <Link to="/auth?mode=signup">
                Get Started Free
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
