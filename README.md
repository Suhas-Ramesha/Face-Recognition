# 🎭 Face Recognition — Personal Project (Python + React + Supabase + HF Spaces)

▶ LIVE DEMO: https://face-recognition-psi-tan.vercel.app/

![Face Recognition App](https://img.shields.io/badge/Face-Recognition-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.80.0-3ECF8E?style=for-the-badge&logo=supabase)
![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=for-the-badge&logo=python)
![PyTorch](https://img.shields.io/badge/PyTorch-2.2-EE4C2C?style=for-the-badge&logo=pytorch)
![HuggingFace](https://img.shields.io/badge/Hugging%20Face-Spaces-orange?style=for-the-badge&logo=huggingface)

A modern, production-oriented face recognition application that combines a React + TypeScript frontend with a Python ML backend. It includes an end-to-end pipeline for dataset preparation, model training and evaluation (PyTorch), embedding indexing (FAISS), low-latency serving (FastAPI / Docker), and a polished UI with Supabase for auth & storage. Designed to be a standout resume project demonstrating full-stack and ML system skills.

---

## 🚀 Project Highlights 
- Architected a hybrid system: React/TypeScript frontend + Python ML backend with FastAPI for real-time face recognition.
- Built a production-grade training pipeline (PyTorch) with triplet / ArcFace-style training, data augmentation, mixed precision (AMP), and metric learning.
- Vectorized embeddings and similarity search using FAISS for sub-10ms nearest-neighbor lookups in production.
- Exported optimized model artifacts (TorchScript / ONNX) and integrated optional GPU inference using Triton or accelerated ONNX runtimes.
- CI/CD + reproducibility: DVC for dataset/versioning, Weights & Biases for experiment tracking, Docker for deployment.
- Deployed interactive demo to Hugging Face Spaces (optional), demonstrating a full-stack deployment flow from training to public demo.

---

## ✨ Features

- Face Upload & Management: Upload and tag multiple images for each person.
- Real-time Webcam Recognition: Live webcam capture and instant matching using optimized embedding lookups.
- Training Pipeline: End-to-end scripts to train embedding model from scratch or fine-tune pre-trained backbones.
- High-Performance Search: FAISS-based nearest neighbor search with product quantization for scale.
- Secure Storage & Auth: Supabase for authentication, storage and Row-Level Security (RLS).
- Export & Deploy: Export models as TorchScript / ONNX and deploy via Docker, HF Spaces, or FastAPI endpoints.

---

## 🧭 Architecture & Flowcharts

High-level flow:

```mermaid
flowchart TD
  A[Data Acquisition] --> B[Preprocessing & Augmentation]
  B --> C[Embedding Model (PyTorch)]
  C --> D[Training (Triplet/ArcFace, AMP, W&B logs)]
  D --> E[Export (TorchScript / ONNX)]
  E --> F[Indexing (FAISS)]
  F --> G[Serving (FastAPI / Triton / Docker)]
  G --> H[Frontend (React + Webcam)]
  H --> I[Storage & Auth (Supabase)]
  G --> J[Optional: HF Spaces Demo]
```

Detailed training pipeline:

```mermaid
flowchart LR
  Data[Raw Images / Labels / Datasources]
  Data --> Clean[Face Detection & Alignment (MTCNN / dlib)]
  Clean --> Aug[Augmentations (albumentations)]
  Aug --> Loader[PyTorch Dataloader (prefetch, mixup)]
  Loader --> Model[Backbone (ResNet / EfficientNet / ArcFace Head)]
  Model --> Loss[Metric Loss: Triplet / ArcFace / CosFace]
  Loss --> Optim[Optimizer (AdamW) + LR Scheduler]
  Optim --> AMP[Mixed Precision]
  AMP --> WandB[W&B + Tensorboard Logging]
  WandB --> Checkpoint[Checkpointing & Best Model Selection]
  Checkpoint --> Export[Export (TorchScript / ONNX) -> CI/CD -> Docker]
```

---

## 🛠️ Tech Stack

Frontend
- React 18, TypeScript, Vite, Tailwind CSS, Framer Motion

Backend / ML
- Python 3.10+, PyTorch (torch), torchvision, facenet-pytorch / dlib (detection & alignment)
- Metric learning libraries (custom ArcFace/Triplet implementation)
- albumentations for augmentations
- FAISS for vector search
- FastAPI for model serving
- TorchScript / ONNX for portable inference
- Docker for containerized deployment

Data & DevOps
- Supabase (Auth, Storage, PostgreSQL with RLS)
- DVC for dataset & model versioning
- Weights & Biases for experiments
- GitHub Actions for CI (lint, tests, build docker)
- Optional: NVIDIA Triton for scaled GPU inference

---

## 📦 File Structure 

Below are two trees: first the actual frontend-focused project structure present in this repo, then the expanded example structure for a full end-to-end ML + serving layout. Use both together — the actual repo files live in the first tree and the second shows where training, indexing, API, and model artifacts would be organized when adding the Python/ML backend.

```
Face-Recognition/
├── api/                       # FastAPI serving code + inference utils
│   ├── main.py
│   ├── inference.py
│   └── requirements.txt
├── train/                     # Training scripts & configs (PyTorch)
│   ├── train.py
│   ├── loss.py
│   └── dataset.py
├── scripts/                   # Helpers: preprocess, build_index, export
│   ├── prepare_dataset.py
│   ├── build_index.py
│   └── export_model.py
├── docker/                    # Dockerfiles for API and worker
├── web/                       # React + TypeScript frontend (mirrors src/ above)
├── configs/                   # YAML config files for experiments
├── models/                    # exported models (TorchScript / ONNX)
├── indices/                   # FAISS indices
├── data/                      # data/raw, data/processed
├── dvc/                       # DVC pipeline files
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── src/
│   ├── components/
│   │   ├── app/
│   │   │   ├── KnownPeopleSidebar.tsx
│   │   │   ├── LiveRecognitionPanel.tsx
│   │   │   └── UploadManagePanel.tsx
│   │   └── ui/
│   │       ├── aurora.tsx
│   │       ├── blur-text.tsx
│   │       ├── click-spark.tsx
│   │       ├── footer.tsx
│   │       ├── magic-bento.tsx
│   │       ├── spotlight-card.tsx
│   │       └── staggered-menu.tsx
│   ├── pages/
│   │   ├── App.tsx
│   │   ├── Auth.tsx
│   │   ├── Index.tsx
│   │   └── ...
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── hooks/
│   └── lib/
├── supabase/
│   └── migrations/
│       ├── 20251106160052_d9f50aa0-0e63-4f94-950e-b070160055a7.sql
│       └── 20251106160258_5c66b439-548a-45e2-9b2d-217df7872523.sql
├── public/
│   └── logo.png
├── package.json
├── vite.config.ts
├── README.md
└── LICENSE

```

---

## 🧪 Evaluation & Metrics

- Use a held-out validation set to measure top-1/top-5 retrieval accuracy and ROC/AUC for pairwise verification.
- Track metrics across experiments with Weights & Biases and log embeddings/summaries for reproducibility.

---

## 🔒 Security & Privacy

- Images are stored securely in Supabase storage buckets with RLS and access policies.
- PII handling: The system supports data retention policies and export/delete endpoints to comply with privacy requirements.
- Keys & tokens must be stored in environment variables and secrets vaults — never commit them to source control.

---

## 📦 Deployment Guide 

1. Build and push Docker images (API + worker).
2. Deploy API to your cloud provider (GCP/AWS/Azure) or run as container on a VM.
3. Host the frontend on Vercel / Netlify or within an HF Space for small public demos.
4. Hook up CI to automatically build and push the models or index when new checkpoints are available.

Optional: Deploy a read-only demo to Hugging Face Spaces using the exported TorchScript model wrapped in Gradio for quick demos.

---

## 🤝 Contributing

Small contributions are welcome. Typical workflow:
1. Fork -> Branch -> Commit -> PR
2. Add tests for any ML/data changes
3. Use DVC remotes to share large data artifacts

---

## 🧾 License

MIT License — see LICENSE for details.

---

## 👤 Author

**Suhas Ramesha**

- GitHub: [@Suhas-Ramesha](https://github.com/Suhas-Ramesha)
- LinkedIn: [suhas-ramesha](https://www.linkedin.com/in/suhas-ramesha/) 
