import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, Database } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600" />
            <h1 className="text-3xl font-bold text-white">Face Recognition</h1>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Personal Face Recognition
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Research Project
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              A personal project exploring face embeddings and real-time recognition. 
              Built to learn, experiment, and understand computer vision.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-6 flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/app")}
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Open App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 border-slate-700 hover:bg-slate-800"
            >
              Sign In
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
              <Database className="h-10 w-10 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Personal Dataset
              </h3>
              <p className="text-sm text-slate-400">
                Upload and manage your own face images with full control over your data
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
              <Zap className="h-10 w-10 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Live Recognition
              </h3>
              <p className="text-sm text-slate-400">
                Real-time face detection with confidence scores and match history
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
              <Shield className="h-10 w-10 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Privacy First
              </h3>
              <p className="text-sm text-slate-400">
                All data stored securely in your own Supabase instance
              </p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="pt-12 max-w-2xl mx-auto">
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-lg p-6 border border-slate-800">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3">
                Privacy & Transparency
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                This is a personal research project. All images and face embeddings stay 
                in your own Supabase database. You have full control and can delete 
                everything at any time. No pricing, no plans — just learning and exploring.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
