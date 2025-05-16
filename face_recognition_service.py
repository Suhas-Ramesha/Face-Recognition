import os
from typing import List, Dict
from pathlib import Path
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import numpy as np
from supabase import create_client, Client
from dotenv import load_dotenv
import json

load_dotenv()

# Add debug prints
print("SUPABASE_URL:", os.getenv("SUPABASE_URL"))
print("SUPABASE_KEY:", os.getenv("SUPABASE_KEY"))

class FaceRecognitionService:
    def __init__(self):
        self.processor = AutoImageProcessor.from_pretrained("lokeshk/Face-Recognition-NM")
        self.model = AutoModelForImageClassification.from_pretrained("lokeshk/Face-Recognition-NM")
        
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_KEY")
        self.supabase: Client = create_client(supabase_url, supabase_key)
        
        # Ensure the model is in evaluation mode
        self.model.eval()
        
    def process_image(self, image: Image.Image) -> torch.Tensor:
        """Process an image and return its embeddings."""
        inputs = self.processor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = self.model(**inputs)
        return outputs.logits.squeeze()
    
    async def recognize_face(self, image_path: str) -> Dict:
        """Recognize a face from an image path."""
        try:
            image = Image.open(image_path)
            current_embedding = self.process_image(image)
            
            # Get known faces from Supabase
            response = self.supabase.table("face_embeddings").select("*").execute()
            known_embeddings = response.data
            
            if not known_embeddings:
                return {"status": "recognized", "person_id": None, "confidence": 0.0}
            
            # Group embeddings by person_id
            person_embeddings = {}
            for entry in known_embeddings:
                if entry["person_id"] not in person_embeddings:
                    person_embeddings[entry["person_id"]] = []
                # Convert the stored embedding back to tensor
                stored_embedding = torch.tensor(entry["embedding"])
                person_embeddings[entry["person_id"]].append(stored_embedding)
            
            # Compare with average embeddings for each person
            max_similarity = -1
            best_match = None
            
            for person_id, embeddings in person_embeddings.items():
                # Calculate average embedding for this person
                avg_embedding = torch.stack(embeddings).mean(dim=0)
                similarity = torch.cosine_similarity(current_embedding, avg_embedding, dim=0)
                
                if similarity > max_similarity:
                    max_similarity = similarity
                    best_match = person_id
            
            # Return the best match without unknown status
            return {
                "status": "recognized",
                "person_id": best_match,
                "confidence": float(max_similarity)
            }
            
        except Exception as e:
            print(f"Recognition error: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    async def add_known_face(self, image_path: str, person_id: str) -> Dict:
        """Add a known face to the database."""
        try:
            image = Image.open(image_path)
            embeddings = self.process_image(image)
            
            # Convert embeddings to a list and store as JSON
            embeddings_list = embeddings.tolist()
            
            # Store embeddings in Supabase
            data = {
                "person_id": person_id,
                "embedding": embeddings_list
            }
            
            response = self.supabase.table("face_embeddings").insert(data).execute()
            
            return {"status": "success", "person_id": person_id}
        except Exception as e:
            print(f"Add face error: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    async def get_all_people(self) -> List[str]:
        """Get list of all registered people."""
        try:
            response = self.supabase.table("face_embeddings").select("person_id").execute()
            unique_people = list(set(entry["person_id"] for entry in response.data))
            return unique_people
        except Exception as e:
            print(f"Get people error: {str(e)}")
            return []

# Initialize the service
face_recognition_service = FaceRecognitionService() 