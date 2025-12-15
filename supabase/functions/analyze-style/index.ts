import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are PRIISME's AI Style Analyst, an expert in fashion, beauty, and personal styling. You analyze photos to provide personalized style recommendations.

When analyzing a photo, you must provide a comprehensive style analysis in the following JSON format:

{
  "face_shape": "oval | round | square | heart | oblong | diamond",
  "skin_tone": "fair | light | medium | olive | tan | dark | deep",
  "skin_undertone": "warm | cool | neutral",
  "body_type": "hourglass | pear | apple | rectangle | inverted_triangle",
  "style_personality": "classic | bohemian | minimalist | glamorous | edgy | romantic | sporty | artistic",
  "recommended_colors": ["color1", "color2", "color3", "color4", "color5"],
  "avoid_colors": ["color1", "color2"],
  "clothing_recommendations": [
    {"type": "tops", "suggestions": ["suggestion1", "suggestion2"]},
    {"type": "bottoms", "suggestions": ["suggestion1", "suggestion2"]},
    {"type": "dresses", "suggestions": ["suggestion1", "suggestion2"]},
    {"type": "outerwear", "suggestions": ["suggestion1", "suggestion2"]},
    {"type": "accessories", "suggestions": ["suggestion1", "suggestion2"]}
  ],
  "hairstyle_recommendations": ["style1", "style2", "style3"],
  "makeup_recommendations": [
    {"type": "foundation", "suggestion": "description"},
    {"type": "lips", "suggestion": "description"},
    {"type": "eyes", "suggestion": "description"},
    {"type": "blush", "suggestion": "description"}
  ],
  "overall_summary": "A brief 2-3 sentence summary of the person's style profile and key recommendations."
}

Be specific and personalized in your recommendations. Consider the person's visible features and provide actionable, helpful advice. If you cannot clearly see certain features, make reasonable assumptions based on what is visible.

IMPORTANT: Respond ONLY with valid JSON, no additional text.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ensure the image has proper data URI prefix
    const imageUrl = imageBase64.startsWith("data:") 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;

    console.log("Calling Lovable AI for style analysis...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this photo and provide a comprehensive style analysis. Return your analysis as JSON only.",
              },
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to analyze image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "No analysis generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse JSON from the response (handle markdown code blocks if present)
    let analysis;
    try {
      let jsonString = content;
      // Remove markdown code blocks if present
      if (jsonString.includes("```json")) {
        jsonString = jsonString.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (jsonString.includes("```")) {
        jsonString = jsonString.replace(/```\n?/g, "");
      }
      analysis = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError, content);
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis results", raw: content }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Style analysis completed successfully");

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-style function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
