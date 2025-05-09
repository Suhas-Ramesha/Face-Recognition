# Face Recognition Backend

This is the Python backend service for face recognition using the Hugging Face model.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r ../requirements.txt
```

3. Create a `.env` file with your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

4. Run the server:
```bash
python main.py
```

The server will start on http://localhost:8000

## API Endpoints

- POST `/api/recognize`: Recognize a face in an uploaded image
- POST `/api/add-known-face`: Add a known face to the database

## Database Schema

Create the following table in your Supabase database:

```sql
create table face_embeddings (
  id uuid default uuid_generate_v4() primary key,
  person_id text not null,
  embedding float[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
``` 