# Face Recognition AI System

A modern, real-time face recognition web application powered by advanced AI technology. This application allows users to register faces and perform real-time face recognition through a webcam interface.

🌐 **Live Demo**: [https://face-recognition-psi-tan.vercel.app/](https://face-recognition-psi-tan.vercel.app/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [How It Works](#how-it-works)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Real-time Face Recognition**: Live face detection and recognition using webcam
- **Face Registration**: Upload and register multiple faces with person IDs
- **Known Faces Management**: View and manage all registered faces in the database
- **Match Percentage Display**: Real-time confidence scores for recognized faces
- **Lock/Unlock Recognition**: Lock recognition results for confirmed matches
- **Modern UI**: Beautiful, responsive interface built with shadcn/ui and Tailwind CSS
- **Secure**: Advanced security protocols ensuring safe and reliable face recognition

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI primitives
- **TanStack Query** - Data fetching and state management
- **Supabase** - Backend-as-a-Service for database

### Backend
- **FastAPI** - Modern Python web framework
- **Hugging Face Transformers** - Face recognition model (`lokeshk/Face-Recognition-NM`)
- **PyTorch** - Deep learning framework
- **Pillow (PIL)** - Image processing
- **NumPy** - Numerical computing
- **Supabase Python Client** - Database client

### Infrastructure
- **Supabase** - PostgreSQL database and storage
- **Vercel** - Frontend deployment
- **Render/Railway** - Backend deployment (optional)

## 📁 Project Structure

```
Face-Recognition/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── Camera.tsx            # Webcam component for live recognition
│   │   ├── FaceUploader.tsx      # Component for uploading/registering faces
│   │   ├── KnownFaces.tsx        # Display known faces list
│   │   ├── Hero.tsx              # Landing page hero section
│   │   ├── Navbar.tsx            # Navigation bar
│   │   └── Footer.tsx            # Footer component
│   ├── context/                  # React Context providers
│   │   └── FaceRecognitionContext.tsx  # Global state management
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── integrations/             # Third-party integrations
│   │   └── supabase/             # Supabase client and types
│   ├── lib/                      # Utility libraries
│   │   ├── faceRecognition.ts    # Face recognition API client
│   │   └── utils.ts              # Helper functions
│   ├── pages/                    # Page components
│   │   ├── Index.tsx             # Home/landing page
│   │   ├── Recognition.tsx       # Main recognition page
│   │   └── NotFound.tsx          # 404 page
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
│
├── backend/                      # Backend API server
│   ├── main.py                   # FastAPI application entry point
│   ├── face_recognition_service.py  # Face recognition service logic
│   ├── requirements.txt          # Python dependencies
│   ├── render.yaml               # Render deployment config
│   └── README.md                 # Backend documentation
│
├── public/                       # Static assets
│   ├── favicon.ico
│   └── robots.txt
│
├── supabase/                     # Supabase configuration
│   └── config.toml               # Supabase local config
│
├── *.sql                         # Database migration/seed files
├── package.json                  # Frontend dependencies
├── vite.config.ts                # Vite configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm (or bun)
- **Python** 3.9+ and pip
- **Supabase Account** - For database and storage
- **Git** - For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd Face-Recognition
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   # or create a virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Environment Variables

1. **Frontend Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Backend Environment Variables**
   
   Create a `.env` file in the `backend/` directory:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_service_role_key
   ```

3. **Supabase Setup**
   - Create a new Supabase project
   - Create the following tables:
     - `known_faces`: Stores registered face information
       ```sql
       CREATE TABLE known_faces (
         id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
         name VARCHAR(255) NOT NULL,
         image_path TEXT NOT NULL,
         created_at TIMESTAMP DEFAULT NOW()
       );
       ```
     - `face_embeddings`: Stores face embeddings for recognition
       ```sql
       CREATE TABLE face_embeddings (
         id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
         person_id VARCHAR(255) NOT NULL,
         embedding JSONB NOT NULL,
         created_at TIMESTAMP DEFAULT NOW()
       );
       ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   python main.py
   # or with uvicorn
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

3. **Open your browser**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## 🔧 How It Works

1. **Face Registration**:
   - User uploads an image with a person ID/name
   - Backend processes the image using Hugging Face transformers model
   - Face embeddings are extracted and stored in Supabase
   - Face metadata is saved to the `known_faces` table

2. **Face Recognition**:
   - Webcam captures live video feed
   - Frames are periodically sent to the backend API
   - Backend extracts embeddings from the captured frame
   - Embeddings are compared with stored embeddings using cosine similarity
   - Best match is returned with confidence score
   - Frontend displays the recognized person with match percentage

3. **Matching Algorithm**:
   - Uses cosine similarity to compare face embeddings
   - Average embeddings calculated for each person (multiple images supported)
   - Highest similarity score determines the match
   - Confidence threshold can be adjusted (currently 30% raw similarity = 100% match)

## 📡 API Endpoints

### POST `/api/recognize`
Recognize a face from an uploaded image.

**Request**:
- `file` (FormData): Image file to recognize

**Response**:
```json
{
  "status": "recognized",
  "person_id": "john_doe",
  "confidence": 0.95
}
```

### POST `/api/add-known-face`
Register a new face to the database.

**Request**:
- `file` (FormData): Image file of the face
- `person_id` (Form): Unique identifier for the person

**Response**:
```json
{
  "status": "success",
  "person_id": "john_doe"
}
```

### GET `/api/people`
Get list of all registered people.

**Response**:
```json
["john_doe", "jane_smith", "bob_wilson"]
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

The frontend is currently deployed at: [https://face-recognition-psi-tan.vercel.app/](https://face-recognition-psi-tan.vercel.app/)

### Backend Deployment

The backend can be deployed on various platforms:

**Render/Railway**:
- Use the `render.yaml` configuration file
- Set environment variables in the platform dashboard
- Deploy using the platform's CLI or web interface

**Docker** (optional):
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🎯 Usage

1. **Register a Face**:
   - Navigate to the Recognition page
   - Use the Face Uploader component
   - Enter a person ID/name
   - Upload one or more images of the person
   - The face will be registered in the database

2. **Start Recognition**:
   - Click "Start Recognition" button
   - Allow webcam access when prompted
   - The system will detect and recognize faces in real-time
   - Match percentages will be displayed for known faces

3. **Lock Recognition**:
   - When a face is recognized, you can lock the recognition
   - This prevents further recognition updates
   - Use the unlock button to resume recognition

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for the face recognition model
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [FastAPI](https://fastapi.tiangolo.com/) for the robust API framework

---

Made with ❤️ using React, FastAPI 
