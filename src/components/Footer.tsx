
import { cn } from "@/lib/utils";
import { Heart, Github, Linkedin } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("py-6 px-4 border-t", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Face Recognition System. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <p className="text-sm text-gray-500 flex items-center">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1 fill-red-500" /> by Suhas Ramesha
            </p>
          </div>
          <div className="flex gap-6">
            <a 
              href="https://www.linkedin.com/in/suhas-ramesha-2795a92a4/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <Linkedin size={16} />
              <span>LinkedIn</span>
            </a>
            <a 
              href="https://github.com/Suhas-Ramesha" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
