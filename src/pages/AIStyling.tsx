import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PhotoUpload } from "@/components/ai-styling/PhotoUpload";
import { StyleResults } from "@/components/ai-styling/StyleResults";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowRight, Lock, RefreshCw } from "lucide-react";

export default function AIStyling() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [previousAnalyses, setPreviousAnalyses] = useState<any[]>([]);

  // Fetch previous analyses
  useEffect(() => {
    if (user) {
      fetchPreviousAnalyses();
    }
  }, [user]);

  const fetchPreviousAnalyses = async () => {
    const { data, error } = await supabase
      .from("style_analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setPreviousAnalyses(data);
      // Set the most recent analysis if available
      if (data.length > 0 && !analysis) {
        setAnalysis(data[0].full_analysis);
      }
    }
  };

  const handlePhotoSelect = async (base64: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use AI Style Analysis",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-style", {
        body: { imageBase64: base64 },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const analysisResult = data.analysis;
      setAnalysis(analysisResult);

      // Save to database
      const { error: saveError } = await supabase.from("style_analyses").insert({
        user_id: user.id,
        photo_url: "stored_locally", // We don't store the actual photo for privacy
        face_shape: analysisResult.face_shape,
        skin_tone: analysisResult.skin_tone,
        skin_undertone: analysisResult.skin_undertone,
        body_type: analysisResult.body_type,
        recommended_colors: analysisResult.recommended_colors,
        avoid_colors: analysisResult.avoid_colors,
        style_personality: analysisResult.style_personality,
        clothing_recommendations: analysisResult.clothing_recommendations,
        hairstyle_recommendations: analysisResult.hairstyle_recommendations,
        makeup_recommendations: analysisResult.makeup_recommendations,
        full_analysis: analysisResult,
      });

      if (saveError) {
        console.error("Failed to save analysis:", saveError);
      } else {
        fetchPreviousAnalyses();
      }

      toast({
        title: "Analysis Complete!",
        description: "Your personalized style profile is ready.",
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Please try again with a different photo.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startNewAnalysis = () => {
    setAnalysis(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ai"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-12 bg-gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ai/10 border border-ai/20 mb-6">
                <Sparkles className="w-4 h-4 text-ai" />
                <span className="text-sm font-medium">AI-Powered Analysis</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {analysis ? "Your Style Profile" : "Discover Your Style"}
              </h1>

              <p className="text-muted-foreground max-w-xl mx-auto">
                {analysis
                  ? "Based on AI analysis of your photo"
                  : "Upload a photo and let our AI create your personalized style profile"}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {!user ? (
              // Not logged in
              <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-ai/10 flex items-center justify-center mb-6">
                  <Lock className="w-10 h-10 text-ai" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
                <p className="text-muted-foreground mb-8">
                  Create a free account to access AI Style Analysis and save your results.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/auth?mode=signup">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </div>
              </div>
            ) : analysis ? (
              // Show results
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-end mb-6">
                  <Button variant="outline" onClick={startNewAnalysis} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    New Analysis
                  </Button>
                </div>
                <StyleResults analysis={analysis} />
              </div>
            ) : (
              // Upload photo
              <div className="max-w-2xl mx-auto">
                <PhotoUpload
                  onPhotoSelect={handlePhotoSelect}
                  isAnalyzing={isAnalyzing}
                />
                
                <div className="mt-8 p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Your Privacy Matters</p>
                      <p className="text-sm text-muted-foreground">
                        Your photos are processed securely and never stored on our servers. 
                        Only the analysis results are saved to your profile.
                      </p>
                    </div>
                  </div>
                </div>

                {previousAnalyses.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-medium mb-4">Previous Analyses</h3>
                    <div className="space-y-3">
                      {previousAnalyses.slice(0, 3).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setAnalysis(item.full_analysis)}
                          className="w-full p-4 rounded-xl bg-card border border-border hover:border-ai/50 transition-colors text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium capitalize">{item.style_personality} Style</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(item.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
