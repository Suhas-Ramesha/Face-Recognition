-- Clear existing data first
DELETE FROM public.face_embeddings;
DELETE FROM public.known_faces;

-- Insert face_embeddings data with correct project references
INSERT INTO public.face_embeddings (id, person_id, embedding, created_at) VALUES
('4ad0eb85-c0e8-491d-badf-ed86ce48fd6b', 'Suhas', '[0.5789495706558228, -0.9414669275283813]', '2025-05-09 12:08:03.906193+00'),
('cd0b7479-7ff1-4679-a85b-813dc83111de', 'Varun', '[0.524979829788208, -0.7128669619560242]', '2025-05-14 18:32:42.802802+00'),
('28763a2f-9407-418d-803b-5f86d342f44d', 'Varun', '[0.524979829788208, -0.7128669619560242]', '2025-05-14 18:36:17.303758+00'),
('153a6f06-3bae-44ed-96ed-044002b5dc5e', 'Bharat', '[0.2899307608604431, -0.5687193870544434]', '2025-05-14 18:40:39.217639+00'),
('3ea0b22a-6bf8-4fa4-b7be-76b46c56186a', 'Bharat', '[0.2899307608604431, -0.5687193870544434]', '2025-05-14 18:48:27.52609+00'),
('80d67b5c-a133-4f64-84ef-e7e6e9306575', 'Varun', '[0.524979829788208, -0.7128669619560242]', '2025-05-14 18:49:09.470495+00'),
('c79dc61c-63ea-4e4a-9cb0-429cb9a6e1dd', 'Likith', '[0.564366340637207, -0.5410852432250977]', '2025-05-16 03:54:32.032308+00'),
('e14bea00-223c-419c-bcc8-15aa08a8537b', 'Revanna', '[0.3033272624015808, -0.28448158502578735]', '2025-05-16 05:19:14.132171+00'),
('be648c2d-ef32-4d19-8ef0-cf0d2b7d6966', 'Revanna', '[0.3033272624015808, -0.28448158502578735]', '2025-05-16 05:32:11.888027+00'),
('4c9bffd0-3f98-469f-b6ab-938bfb256126', 'Revanna', '[0.3033272624015808, -0.28448158502578735]', '2025-05-16 05:35:46.753012+00');

-- Insert known_faces data with correct project references
INSERT INTO public.known_faces (id, name, image_path, created_at) VALUES
('ca188e1c-00b0-4b4a-b630-c116913b0984', 'Dhananjay', 'https://lnebxrslcmdozitccwxx.supabase.co/storage/v1/object/public/faces/1744281560336.jpg', '2025-04-10 10:39:21.031727+00'),
('2e8b3a06-a2b6-4a99-a976-04fc0645f73c', 'Suhas', 'https://lnebxrslcmdozitccwxx.supabase.co/storage/v1/object/public/faces/Suhas/1746792475623_xct98.jpg', '2025-05-09 12:08:04.079174+00'),
('a1ef5db7-6e6a-4fe6-9e55-ee232df20b33', 'Bharat', 'https://lnebxrslcmdozitccwxx.supabase.co/storage/v1/object/public/faces/Bharat/1747248498642_0x9x.jpg', '2025-05-14 18:48:27.779649+00'),
('c03272db-cdbb-4a71-9f83-d5df32573f40', 'Varun', 'https://lnebxrslcmdozitccwxx.supabase.co/storage/v1/object/public/faces/Varun/1747248548177_fnt3o.jpeg', '2025-05-14 18:49:09.585395+00'),
('ce28d475-440f-4abe-86ab-9de3b77828cd', 'Revanna', 'https://lnebxrslcmdozitccwxx.supabase.co/storage/v1/object/public/faces/Revanna/1747377467119_mkjqfa.JPG', '2025-05-16 06:37:57.946487+00');
