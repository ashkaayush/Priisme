import { 
  User, 
  Palette, 
  Shirt, 
  Scissors as ScissorsIcon, 
  Sparkles,
  CheckCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StyleAnalysis {
  face_shape: string;
  skin_tone: string;
  skin_undertone: string;
  body_type: string;
  style_personality: string;
  recommended_colors: string[];
  avoid_colors: string[];
  clothing_recommendations: Array<{
    type: string;
    suggestions: string[];
  }>;
  hairstyle_recommendations: string[];
  makeup_recommendations: Array<{
    type: string;
    suggestion: string;
  }>;
  overall_summary: string;
}

interface StyleResultsProps {
  analysis: StyleAnalysis;
}

export function StyleResults({ analysis }: StyleResultsProps) {
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-ai/20 bg-ai/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-ai" />
            Your Style Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{analysis.overall_summary}</p>
        </CardContent>
      </Card>

      {/* Key Attributes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AttributeCard
          icon={<User className="w-5 h-5" />}
          label="Face Shape"
          value={analysis.face_shape}
        />
        <AttributeCard
          icon={<Palette className="w-5 h-5" />}
          label="Skin Tone"
          value={`${analysis.skin_tone} (${analysis.skin_undertone})`}
        />
        <AttributeCard
          icon={<Shirt className="w-5 h-5" />}
          label="Body Type"
          value={analysis.body_type}
        />
        <AttributeCard
          icon={<Sparkles className="w-5 h-5" />}
          label="Style Personality"
          value={analysis.style_personality}
        />
      </div>

      {/* Color Palette */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5" />
            Your Color Palette
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Recommended Colors
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.recommended_colors.map((color, i) => (
                <Badge key={i} variant="secondary" className="capitalize">
                  {color}
                </Badge>
              ))}
            </div>
          </div>
          {analysis.avoid_colors.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 text-muted-foreground">
                Colors to Avoid
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.avoid_colors.map((color, i) => (
                  <Badge key={i} variant="outline" className="capitalize text-muted-foreground">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clothing Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shirt className="w-5 h-5" />
            Clothing Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.clothing_recommendations.map((rec, i) => (
              <div key={i} className="p-4 rounded-lg bg-secondary/50">
                <h4 className="font-medium capitalize mb-2">{rec.type}</h4>
                <ul className="space-y-1">
                  {rec.suggestions.map((suggestion, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-ai mt-1">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hairstyle Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ScissorsIcon className="w-5 h-5" />
            Hairstyle Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analysis.hairstyle_recommendations.map((style, i) => (
              <Badge key={i} variant="secondary" className="py-2 px-4">
                {style}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Makeup Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5" />
            Makeup Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.makeup_recommendations.map((rec, i) => (
              <div key={i} className="p-4 rounded-lg bg-secondary/50">
                <h4 className="font-medium capitalize mb-1">{rec.type}</h4>
                <p className="text-sm text-muted-foreground">{rec.suggestion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AttributeCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border text-center">
      <div className="w-10 h-10 mx-auto rounded-full bg-secondary flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-medium capitalize text-sm">{value}</p>
    </div>
  );
}
