const COOKIE_NAME = '_lmautos_attribution';
const COOKIE_DAYS = 90;

export interface AttributionData {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  fbclid: string | null;
  first_touch_timestamp: string;
  first_touch_page: string;
  first_touch_referrer: string;
}

const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
] as const;

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function detectSourceFromReferrer(referrer: string): { source: string; medium: string } | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes('google')) return { source: 'google', medium: 'organic' };
    if (host.includes('bing')) return { source: 'bing', medium: 'organic' };
    if (host.includes('yahoo')) return { source: 'yahoo', medium: 'organic' };
    if (host.includes('facebook') || host.includes('fb.com')) return { source: 'facebook', medium: 'social' };
    if (host.includes('instagram')) return { source: 'instagram', medium: 'social' };
    if (host.includes('twitter') || host.includes('x.com')) return { source: 'twitter', medium: 'social' };
    if (host.includes('tiktok')) return { source: 'tiktok', medium: 'social' };
    if (host.includes('linkedin')) return { source: 'linkedin', medium: 'social' };
    if (host.includes('youtube')) return { source: 'youtube', medium: 'social' };
    if (host.includes('whatsapp')) return { source: 'whatsapp', medium: 'social' };
    return { source: host, medium: 'referral' };
  } catch {
    return null;
  }
}

export function captureAndPersistUtm(): void {
  if (getCookie(COOKIE_NAME)) return;

  const params = new URLSearchParams(window.location.search);
  const data: AttributionData = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    gclid: null,
    fbclid: null,
    first_touch_timestamp: new Date().toISOString(),
    first_touch_page: window.location.pathname + window.location.search,
    first_touch_referrer: document.referrer,
  };

  for (const key of UTM_PARAMS) {
    data[key] = params.get(key) || null;
  }

  // If gclid present but no source, set google/cpc
  if (data.gclid && !data.utm_source) {
    data.utm_source = 'google';
    data.utm_medium = 'cpc';
  }

  // If fbclid present but no source, set facebook/cpc
  if (data.fbclid && !data.utm_source) {
    data.utm_source = 'facebook';
    data.utm_medium = 'cpc';
  }

  // If still no source, detect from referrer
  if (!data.utm_source) {
    const detected = detectSourceFromReferrer(document.referrer);
    if (detected) {
      data.utm_source = detected.source;
      data.utm_medium = detected.medium;
    } else {
      data.utm_source = '(direct)';
      data.utm_medium = '(none)';
    }
  }

  setCookie(COOKIE_NAME, JSON.stringify(data), COOKIE_DAYS);
}

export function getAttribution(): AttributionData | null {
  const raw = getCookie(COOKIE_NAME);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AttributionData;
  } catch {
    return null;
  }
}

export function getAttributionForLead(): Record<string, string | null> {
  const attr = getAttribution();
  if (!attr) {
    return {
      attribution_source: '(direct)',
      attribution_medium: '(none)',
      attribution_campaign: null,
      attribution_term: null,
      attribution_content: null,
      attribution_gclid: null,
      attribution_fbclid: null,
      attribution_landing_page: null,
      attribution_referrer: null,
    };
  }
  return {
    attribution_source: attr.utm_source,
    attribution_medium: attr.utm_medium,
    attribution_campaign: attr.utm_campaign,
    attribution_term: attr.utm_term,
    attribution_content: attr.utm_content,
    attribution_gclid: attr.gclid,
    attribution_fbclid: attr.fbclid,
    attribution_landing_page: attr.first_touch_page,
    attribution_referrer: attr.first_touch_referrer,
  };
}
