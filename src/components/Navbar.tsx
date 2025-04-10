
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  return (
    <nav className={cn("flex items-center justify-between p-4 bg-white shadow-sm", className)}>
      <Link to="/" className="flex items-center gap-2">
        <div className="text-blue-600 text-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 7h.01" />
            <path d="M17 7h.01" />
            <path d="M7 17h.01" />
            <path d="M17 17h.01" />
          </svg>
        </div>
        <span className="font-semibold text-lg">Face Recognition System</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-600 hover:text-accent transition-colors">
          Home
        </Link>
        <Link to="/recognition" className="text-gray-600 hover:text-accent transition-colors">
          Recognition
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
