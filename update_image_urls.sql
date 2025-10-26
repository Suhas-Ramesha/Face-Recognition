-- Update image URLs to use the new Supabase project
UPDATE public.known_faces 
SET image_path = REPLACE(image_path, 'https://uncxnsgublnhhjoaviyc.supabase.co', 'https://lnebxrslcmdozitccwxx.supabase.co')
WHERE image_path LIKE '%uncxnsgublnhhjoaviyc.supabase.co%';
