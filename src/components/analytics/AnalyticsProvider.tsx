import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { initDataLayer, captureAndPersistUtm, trackPageView } from '@/lib/analytics';

interface AnalyticsProviderProps {
  children: ReactNode;
}

const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  useEffect(() => {
    initDataLayer();
    captureAndPersistUtm();
  }, []);

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
