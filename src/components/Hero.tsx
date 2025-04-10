
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-black px-4">
      <div className="text-blue-600 text-5xl mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
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
      <h1 className="text-center text-4xl md:text-5xl font-bold mb-3 text-white">
        Face Recognition
        <span className="block text-blue-600">AI System</span>
      </h1>
      <p className="text-center text-gray-400 max-w-md mb-10">
        Experience the future of security with our advanced facial recognition
        system. Powered by cutting-edge AI technology.
      </p>
      <Link to="/recognition" className="gradient-button">
        Start Recognition <span className="ml-1">→</span>
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
        <FeatureCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
          title="Secure Access"
          description="Advanced security protocols ensuring safe and reliable face recognition."
        />
        <FeatureCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
          }
          title="Real-time Processing"
          description="Instant face detection and recognition with minimal latency."
        />
        <FeatureCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          title="Easy Integration"
          description="Seamlessly integrates with existing security systems."
        />
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-800">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export default Hero;
