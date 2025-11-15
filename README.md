# 🎭 Face Recognition — Personal Project

A modern, full-stack face recognition application built with React, TypeScript, and Supabase. Upload face images, manage known people, and perform real-time face recognition using your webcam.

![Face Recognition App](https://img.shields.io/badge/Face-Recognition-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.80.0-3ECF8E?style=for-the-badge&logo=supabase)

## ✨ Features

### 🎯 Core Functionality
- **Face Upload & Management**: Upload multiple face images and organize them by person
- **Real-time Recognition**: Live webcam face recognition with instant matching
- **Auto-scan Mode**: Automatic face scanning at configurable intervals
- **Top Matches Display**: View confidence scores and top candidates in real-time
- **Recent Scans History**: Track and review recent recognition results

### 🎨 UI/UX Features
- **Modern Design**: Beautiful dark theme with gradient animations
- **Interactive Animations**: 
  - Aurora background effects (WebGL-powered)
  - Click spark animations
  - Spotlight card effects
  - Magic Bento grid animations
  - Staggered menu navigation
  - Blur text animations
- **Responsive Layout**: Three-panel resizable interface
- **Smooth Transitions**: Framer Motion powered animations
- **Accessibility**: Full keyboard navigation and screen reader support

### 🔐 Security & Privacy
- **User Authentication**: Secure sign-in/sign-up with Supabase Auth
- **Row Level Security (RLS)**: Users can only access their own data
- **Secure Storage**: Images stored in Supabase Storage with proper access controls
- **Privacy First**: All data stored in your own Supabase instance

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Styling
- **shadcn/ui** - Component library
- **Framer Motion 12.23.24** - Animations
- **React Router 6.30.1** - Routing
- **TanStack Query 5.83.0** - Data fetching and caching

### Backend & Services
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Storage (for face images)
  - Row Level Security (RLS)

### Additional Libraries
- **ogl 1.0.11** - WebGL for Aurora animations
- **lucide-react** - Icon library
- **react-resizable-panels** - Resizable panel layout

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **Supabase Account** - [Sign up](https://supabase.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Suhas-Ramesha/Face-Detec.git
cd Face-Detec
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [Supabase](https://supabase.com/)
2. Go to **SQL Editor** and run the migration files from `supabase/migrations/`:
   - `20251106160052_d9f50aa0-0e63-4f94-950e-b070160055a7.sql` - Creates tables and RLS policies
   - `20251106160258_5c66b439-548a-45e2-9b2d-217df7872523.sql` - Creates storage bucket

3. Create a Storage Bucket:
   - Go to **Storage** in Supabase dashboard
   - Create a bucket named `faces`
   - Set it to **Public** (or configure RLS policies as needed)

4. Get your Supabase credentials:
   - Go to **Project Settings** > **API**
   - Copy your **Project URL** and **anon/public key**

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 📖 Usage

### Getting Started

1. **Sign Up / Sign In**
   - Navigate to the app
   - Create an account or sign in with existing credentials

2. **Upload Face Images**
   - Go to the **Upload & Manage** panel
   - Select "Create new" or choose an existing person
   - Drag & drop images or click to browse
   - Click "Upload All" to save images

3. **Start Face Recognition**
   - Go to the **Live Recognition** panel
   - Click "Start" to activate your webcam
   - Allow camera permissions when prompted
   - The app will automatically match faces in real-time

4. **View Results**
   - **Top Matches**: See confidence scores for known people
   - **Recent Scans**: Review your recognition history
   - **Auto-scan**: Enable automatic scanning every 1 second

### Features Guide

#### Known People Sidebar
- View all uploaded people
- Search by name
- Click on a person to view all their images
- See image count per person

#### Upload & Manage Panel
- Upload multiple images at once
- Organize by person name
- Track upload progress
- View upload status

#### Live Recognition Panel
- Real-time webcam feed
- Manual capture button
- Auto-scan toggle
- Confidence score display
- Match notifications

## 📁 Project Structure

```
Face-Detec/
├── src/
│   ├── components/
│   │   ├── app/              # Application-specific components
│   │   │   ├── KnownPeopleSidebar.tsx
│   │   │   ├── LiveRecognitionPanel.tsx
│   │   │   └── UploadManagePanel.tsx
│   │   └── ui/               # Reusable UI components
│   │       ├── aurora.tsx           # WebGL background animation
│   │       ├── blur-text.tsx        # Text blur animation
│   │       ├── click-spark.tsx      # Click spark effects
│   │       ├── footer.tsx           # Footer component
│   │       ├── magic-bento.tsx      # Interactive card animations
│   │       ├── spotlight-card.tsx    # Spotlight hover effects
│   │       └── staggered-menu.tsx   # Navigation menu
│   ├── pages/                # Page components
│   │   ├── App.tsx           # Main recognition page
│   │   ├── Auth.tsx          # Authentication page
│   │   ├── Index.tsx          # Landing page
│   │   └── ...
│   ├── integrations/
│   │   └── supabase/         # Supabase configuration
│   │       ├── client.ts
│   │       └── types.ts
│   ├── hooks/                # Custom React hooks
│   └── lib/                   # Utility functions
├── supabase/
│   └── migrations/            # Database migrations
├── public/
│   └── logo.png              # Project logo
├── package.json
├── vite.config.ts
└── README.md
```

## 🎨 Customization

### Changing Colors

The app uses a purple/blue color scheme. To customize:

1. **Aurora Background**: Edit `src/pages/Index.tsx` - `colorStops` prop
2. **Magic Bento Glow**: Edit `glowColor` prop in MagicBento components
3. **Theme Colors**: Modify `tailwind.config.js` or use CSS variables

### Adding New Features

1. **New Recognition Algorithm**: Modify `compareImages` function in `LiveRecognitionPanel.tsx`
2. **Additional Animations**: Add new components in `src/components/ui/`
3. **Database Schema**: Add migrations in `supabase/migrations/`

## 🐛 Troubleshooting

### Camera Not Working
- Ensure you've granted camera permissions in your browser
- Check if another application is using the camera
- Try refreshing the page

### Images Not Uploading
- Verify Supabase Storage bucket is created and configured
- Check RLS policies allow uploads
- Ensure you're authenticated

### Recognition Not Working
- Make sure you've uploaded at least one face image
- Check that images are properly loaded
- Verify webcam is capturing frames

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Suhas Ramesha**

- GitHub: [@Suhas-Ramesha](https://github.com/Suhas-Ramesha)
- LinkedIn: [suhas-ramesha](https://www.linkedin.com/in/suhas-ramesha/)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing backend platform
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [React](https://react.dev/) team for the incredible framework

## 📊 Project Status

✅ **Active Development** - This project is actively maintained and updated.

## 🔮 Future Enhancements

- [ ] Advanced face recognition using ML models (TensorFlow.js, Face-API.js)
- [ ] Face detection bounding boxes
- [ ] Multiple face detection in a single image
- [ ] Face similarity search
- [ ] Export/import face data
- [ ] Batch processing
- [ ] Mobile app support
- [ ] Real-time collaboration features

---

⭐ If you find this project helpful, please consider giving it a star!

Made with ❤️ by Suhas-Ramesha & Team
