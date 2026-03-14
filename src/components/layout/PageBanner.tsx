import { Link } from "react-router-dom";

interface PageBannerProps {
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

const PageBanner = ({ title, breadcrumbs }: PageBannerProps) => {
  return (
    <div className="relative bg-secondary py-10 sm:py-16 text-center">
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary" />
      <div className="relative container">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground italic" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {title}
        </h1>
        {breadcrumbs && (
          <nav className="mt-3 flex items-center justify-center gap-2 text-sm text-secondary-foreground/70">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>›</span>}
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-primary transition-colors underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-secondary-foreground">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};

export default PageBanner;
