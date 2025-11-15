import { Github, Linkedin } from "lucide-react";
import BlurText from "./blur-text";

const Footer = () => {
  return (
    <footer id="footer" className="w-full border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm mt-auto flex-shrink-0">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <BlurText
            text="Made by Suhas-Ramesha & Team"
            delay={50}
            className="text-sm text-slate-400"
            animateBy="words"
            direction="bottom"
            threshold={0.1}
          />
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Suhas-Ramesha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/suhas-ramesha/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

