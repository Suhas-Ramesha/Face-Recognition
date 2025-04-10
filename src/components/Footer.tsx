
import { cn } from "@/lib/utils";

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
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
              Terms of Service
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
