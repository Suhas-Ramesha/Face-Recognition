-- Add user_id columns to track ownership
ALTER TABLE known_faces 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE face_embeddings
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX idx_known_faces_user_id ON known_faces(user_id);
CREATE INDEX idx_face_embeddings_user_id ON face_embeddings(user_id);

-- Add RLS policies for known_faces
CREATE POLICY "Users can view their own faces"
ON known_faces
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own faces"
ON known_faces
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own faces"
ON known_faces
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own faces"
ON known_faces
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Add RLS policies for face_embeddings
CREATE POLICY "Users can view their own embeddings"
ON face_embeddings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own embeddings"
ON face_embeddings
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own embeddings"
ON face_embeddings
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own embeddings"
ON face_embeddings
FOR DELETE
TO authenticated
USING (user_id = auth.uid());