
-- Create storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read vehicle images
CREATE POLICY "Public read vehicle images" ON storage.objects FOR SELECT USING (bucket_id = 'vehicle-images');

-- Allow authenticated users to upload vehicle images
CREATE POLICY "Auth users upload vehicle images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vehicle-images');

-- Allow authenticated users to update their vehicle images
CREATE POLICY "Auth users update vehicle images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'vehicle-images');

-- Allow authenticated users to delete vehicle images
CREATE POLICY "Auth users delete vehicle images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'vehicle-images');
