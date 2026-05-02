-- Create public bucket for consignment photos
INSERT INTO storage.buckets (id, name, public) VALUES ('consignment-photos', 'consignment-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone (anon + authenticated) can upload to consignment-photos
CREATE POLICY "Anyone can upload consignment photos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'consignment-photos');

-- Public read access
CREATE POLICY "Consignment photos are publicly readable"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'consignment-photos');

-- Admins can delete
CREATE POLICY "Admins can delete consignment photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'consignment-photos' AND is_admin());