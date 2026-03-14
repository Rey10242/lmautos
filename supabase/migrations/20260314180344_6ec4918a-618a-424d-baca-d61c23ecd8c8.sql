ALTER TABLE public.vehicles ADD COLUMN slug text UNIQUE;

-- Generate slugs for existing vehicles
UPDATE public.vehicles SET slug = 
  lower(
    regexp_replace(
      regexp_replace(
        concat(marca, '-', modelo, '-', coalesce(version, ''), '-', year::text),
        '[^a-zA-Z0-9\-]', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  ) || '-' || left(id::text, 8);

-- Make slug not null after populating
ALTER TABLE public.vehicles ALTER COLUMN slug SET NOT NULL;

-- Create index for slug lookups
CREATE INDEX idx_vehicles_slug ON public.vehicles(slug);