import { cn } from "@/lib/utils";
import { Heart, Github, Linkedin } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("py-8 px-4 bg-gray-50 border-t", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Face Recognition System. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600 flex items-center">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1 fill-red-500 animate-pulse" /> by Suhas Ramesha
            </p>
          </div>
          <div className="flex gap-6">
            <a 
              href="https://www.linkedin.com/in/suhas-ramesha-2795a92a4/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group"
            >
              <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow-md transition-shadow">
                <Linkedin size={18} className="text-blue-600" />
              </div>
              <span className="font-medium">LinkedIn</span>
            </a>
            <a 
              href="https://github.com/Suhas-Ramesha" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 group"
            >
              <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow-md transition-shadow">
                <Github size={18} className="text-gray-900" />
              </div>
              <span className="font-medium">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
