import { useEffect, useState } from "react";
import { Star, Quote, MapPin, ExternalLink } from "lucide-react";
import FadeInSection from "@/components/shared/FadeInSection";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  author: string;
  photo: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
}

interface ReviewsData {
  name: string;
  rating: number;
  totalRatings: number;
  googleMapsUri: string;
  reviews: Review[];
}

const GoogleReviewsSection = () => {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data: result, error: fnError } = await supabase.functions.invoke("google-reviews");
        if (fnError) throw fnError;
        if (result?.error) throw new Error(result.error);
        setData(result);
      } catch (err) {
        console.error("Failed to load Google reviews:", err);
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <FadeInSection>
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              Reseñas de Google
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mt-2">
              Lo que dicen nuestros <span className="text-primary">clientes</span>
            </h2>

            {data && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(data.rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-foreground font-bold text-lg">
                  {data.rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground text-sm">
                  ({data.totalRatings} reseñas)
                </span>
              </div>
            )}
          </div>
        </FadeInSection>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {loading &&
            [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}

          {!loading && error && (
            <div className="col-span-full text-center text-muted-foreground">
              No fue posible cargar las reseñas en este momento.
            </div>
          )}

          {!loading &&
            !error &&
            data?.reviews?.slice(0, 3).map((r, i) => (
              <FadeInSection key={i} delay={i * 100}>
                <div className="bg-card border border-border rounded-xl p-6 relative h-full flex flex-col">
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`h-4 w-4 ${
                          j < r.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-4 line-clamp-6">
                    "{r.text}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    {r.photo ? (
                      <img
                        src={r.photo}
                        alt={r.author}
                        loading="lazy"
                        className="w-10 h-10 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {initials(r.author)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {r.author}
                      </p>
                      <p className="text-xs text-muted-foreground">{r.relativeTime}</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
        </div>

        {/* CTA: see all reviews on Google */}
        {data?.googleMapsUri && (
          <FadeInSection>
            <div className="text-center mb-12">
              <a
                href={data.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                Ver todas las reseñas en Google
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </FadeInSection>
        )}

        {/* Map embed */}
        <FadeInSection>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-foreground font-semibold">
                <MapPin className="h-5 w-5 text-primary" />
                Sector La Ermita, Cra 19A #29c-11, Pie de la Popa, Cartagena
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg aspect-[16/9] bg-muted">
              <iframe
                title="Ubicación LM Autos en Cartagena"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.456!2d-75.5365!3d10.4095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef62f0956985bd7%3A0x36de069678a93093!2sLM%20Autos!5e0!3m2!1ses!2sco!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default GoogleReviewsSection;
