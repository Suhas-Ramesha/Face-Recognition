import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, Database } from "lucide-react";
import Aurora from "@/components/ui/aurora";
import ClickSpark from "@/components/ui/click-spark";
import SpotlightCard from "@/components/ui/spotlight-card";
import Footer from "@/components/ui/footer";
import StaggeredMenu from "@/components/ui/staggered-menu";

const Index = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Recognition', ariaLabel: 'Go to recognition page', link: '/app' },
    { label: 'More Info', ariaLabel: 'Scroll to footer', link: '#footer' }
  ];

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com/Suhas-Ramesha' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/in/suhas-ramesha/' }
  ];

  return (
    <div className="min-h-screen relative bg-slate-950 overflow-hidden">
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#fff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#B19EEF', '#5227FF']}
        logoUrl="/logo.png"
        accentColor="#7cff67"
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora 
          colorStops={['#5227FF', '#7cff67', '#5227FF']}
          amplitude={1.0}
          blend={0.5}
        />
      </div>
      
      {/* Content */}
      <ClickSpark 
        sparkColor="#7cff67"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={8}
        duration={400}
        easing="ease-out"
        extraScale={1.2}
      >
        <div className="relative z-10 min-h-screen">
          {/* Hero Section */}
          <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="inline-flex items-center gap-4 mb-8">
            <img src="/logo.png" alt="Face Recognition Logo" className="w-20 h-20 object-contain" />
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
            <SpotlightCard 
              spotlightColor="rgba(34, 211, 238, 0.3)"
              className="bg-slate-900/50 backdrop-blur-sm border-slate-800"
            >
              <Database className="h-10 w-10 text-cyan-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Personal Dataset
              </h3>
              <p className="text-sm text-slate-400">
                Upload and manage your own face images with full control over your data
              </p>
            </SpotlightCard>

            <SpotlightCard 
              spotlightColor="rgba(124, 255, 103, 0.3)"
              className="bg-slate-900/50 backdrop-blur-sm border-slate-800"
            >
              <Zap className="h-10 w-10 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Live Recognition
              </h3>
              <p className="text-sm text-slate-400">
                Real-time face detection with confidence scores and match history
              </p>
            </SpotlightCard>

            <SpotlightCard 
              spotlightColor="rgba(59, 130, 246, 0.3)"
              className="bg-slate-900/50 backdrop-blur-sm border-slate-800"
            >
              <Shield className="h-10 w-10 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Privacy First
              </h3>
              <p className="text-sm text-slate-400">
                All data stored securely in your own Supabase instance
              </p>
            </SpotlightCard>
          </div>

          {/* Privacy Note */}
          <div className="pt-12 max-w-2xl mx-auto">
            <SpotlightCard 
              spotlightColor="rgba(124, 255, 103, 0.25)"
              className="bg-slate-900/30 backdrop-blur-sm border-slate-800"
            >
              <h3 className="text-sm font-semibold text-cyan-400 mb-3">
                Privacy & Transparency
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                This is a personal research project. All images and face embeddings stay 
                in your own Supabase database. You have full control and can delete 
                everything at any time. No pricing, no plans — just learning and exploring.
              </p>
            </SpotlightCard>
          </div>
        </div>
        </div>
        </div>
      </ClickSpark>
      <Footer />
    </div>
  );
};

export default Index;
