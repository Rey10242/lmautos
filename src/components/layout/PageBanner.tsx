import { Link } from "react-router-dom";
import { useEffect } from "react";
import { SITE_URL } from "@/lib/constants";

interface PageBannerProps {
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

const PageBanner = ({ title, breadcrumbs }: PageBannerProps) => {
  // Inject BreadcrumbList JSON-LD
  useEffect(() => {
    if (!breadcrumbs || breadcrumbs.length === 0) return;

    const existingBc = document.querySelector('script[data-seo-breadcrumb]');
    if (existingBc) existingBc.remove();

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: crumb.label,
        ...(crumb.path ? { item: `${SITE_URL}${crumb.path}` } : {}),
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-breadcrumb", "true");
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      const el = document.querySelector('script[data-seo-breadcrumb]');
      if (el) el.remove();
    };
  }, [breadcrumbs]);

  return (
    <div className="relative bg-secondary py-10 sm:py-16 text-center">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary" />
      <div className="relative container">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-foreground italic" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {title}
        </h1>
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mt-3 flex items-center justify-center gap-2 text-sm text-secondary-foreground/70">
            <ol className="flex items-center gap-2 list-none p-0 m-0">
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">›</span>}
                  {crumb.path ? (
                    <Link to={crumb.path} className="hover:text-primary transition-colors underline">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-secondary-foreground" aria-current="page">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </div>
  );
};

export default PageBanner;
