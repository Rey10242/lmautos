// Edge Function: Fetch Google Place reviews with in-memory cache (24h)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLACE_ID = "ChIJ11WYVgkv9o4RkzCpeJYG3jY";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

let cache: CacheEntry | null = null;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!apiKey) {
      throw new Error("GOOGLE_PLACES_API_KEY is not configured");
    }

    // Serve from cache if fresh
    if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
      return new Response(JSON.stringify({ ...cache.data as object, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Places API (New) - GET place details with reviews
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=es&regionCode=co`;
    const response = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews,googleMapsUri",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Places API error [${response.status}]: ${errText}`);
    }

    const data = await response.json();

    const result = {
      name: data.displayName?.text ?? "LM Autos",
      rating: data.rating ?? 0,
      totalRatings: data.userRatingCount ?? 0,
      googleMapsUri: data.googleMapsUri ?? "",
      reviews: (data.reviews ?? []).map((r: Record<string, unknown>) => ({
        author: (r.authorAttribution as Record<string, string>)?.displayName ?? "Anónimo",
        photo: (r.authorAttribution as Record<string, string>)?.photoUri ?? "",
        rating: r.rating ?? 5,
        text: (r.text as Record<string, string>)?.text ?? (r.originalText as Record<string, string>)?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
        publishTime: r.publishTime ?? "",
      })),
    };

    cache = { data: result, timestamp: Date.now() };

    return new Response(JSON.stringify({ ...result, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("google-reviews error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
