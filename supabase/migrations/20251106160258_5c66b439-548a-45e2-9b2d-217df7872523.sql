-- Create storage bucket for face images
INSERT INTO storage.buckets (id, name, public)
VALUES ('faces', 'faces', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for faces bucket
CREATE POLICY "Users can view all face images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'faces');

CREATE POLICY "Users can upload their own face images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'faces' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own face images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'faces' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'faces' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own face images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'faces' AND
  (storage.foldername(name))[1] = auth.uid()::text
);