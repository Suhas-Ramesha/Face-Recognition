# 🧠 Face Recognition System

## Problem Statement  
In a world increasingly driven by automation and digital access, secure and contactless identification has become a necessity. Traditional methods of authentication like passwords and ID cards are prone to misuse and inefficiency.

Facial recognition technology offers a powerful alternative by leveraging unique facial features for identity verification. Our project solves this by delivering a **real-time, AI-powered face recognition system** that is scalable, secure, and easy to integrate into modern web or mobile applications.

---

## 🔗 Demo  
[Live Demo](https://your-live-demo-link.com) *(Replace with actual link)*

---

## 💡 Solution  
This project delivers a full-stack application that:  
✅ Detects and recognizes faces in real-time using AI models  
✅ Enables secure login, attendance, and access control workflows  
✅ Stores and compares facial embeddings using Supabase  
✅ Features a clean and interactive frontend for seamless user experience

---

## 🔥 Features  
📸 Face Enrollment with image upload  
🔍 Face Recognition with confidence scores  
🧠 AI-based Embedding Extraction (Hugging Face & PyTorch)  
🗃️ Supabase Database for scalable backend storage  
🌐 REST API via FastAPI for backend communication  
💻 React + Tailwind CSS frontend  
🚀 Dockerized and deployed via Render & Netlify

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/face-recognition-system.git
cd face-recognition-system
```

### 2️⃣ Backend Setup
Make sure you have Python 3.9 installed:

```bash
Copy
Edit
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Create a .env file for Supabase credentials:
```Copy
Edit
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_anon_key
```

### 3️⃣ Run Backend Server
```bash
Copy
Edit
uvicorn main:app --reload
```

### 4️⃣ Frontend Setup
```bash
Copy
Edit
cd frontend
npm install
npm run dev
```

## 🐳 Deployment
Backend (Render)
Dockerized FastAPI backend

Deploy to Render:-

Frontend (Netlify)
React + Vite frontend

Deploy to Netlify

## 🗃️ Example API Endpoints
POST /api/add-known-face → Register a new face

POST /api/recognize → Identify face from uploaded image

## 📂 Example Data Format
```json
Copy
Edit
{
  "image": "base64-encoded-image"
}
```

For embedding storage:

```json
Copy
Edit
{
  "person_id": "john_doe",
  "embedding": [0.123, 0.456, ..., 0.789]
}
```

## 🤝 Contributing
Feel free to fork the repo, create a new branch, and submit a Pull Request! Contributions are welcome.

## 📬 Contact
For questions or collaboration, contact:
📧 your.email@example.com
🔗 GitHub: Suhas-Ramesha

## 🚀 Enhancing Security, One Face at a Time!
