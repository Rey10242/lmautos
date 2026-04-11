import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { initDataLayer, captureAndPersistUtm, trackPageView } from '@/lib/analytics';

interface AnalyticsProviderProps {
  children: ReactNode;
  gtmId?: string;
}

const AnalyticsProvider = ({ children, gtmId }: AnalyticsProviderProps) => {
  useEffect(() => {
    initDataLayer();
    captureAndPersistUtm();

    if (gtmId) {
      // GTM inline script
      const script = document.createElement('script');
      script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;
      document.head.insertBefore(script, document.head.firstChild);

      // GTM noscript iframe
      const noscript = document.createElement('noscript');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      noscript.appendChild(iframe);
      document.body.insertBefore(noscript, document.body.firstChild);
    }
  }, [gtmId]);

  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      trackPageView(location.pathname);
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <>{children}</>;
};

export default AnalyticsProvider;
