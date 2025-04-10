
import { useFaceRecognition } from "@/context/FaceRecognitionContext";
import { Users } from "lucide-react";

const KnownFaces = () => {
  const { knownFaces, detectedFace } = useFaceRecognition();
  
  // Sort faces by match percentage (higher first)
  const sortedFaces = [...knownFaces].sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="h-full bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center gap-2 mb-6">
        <Users className="text-blue-600" size={20} />
        <h2 className="text-lg font-semibold">Known Faces</h2>
      </div>
      
      <div className="space-y-3">
        {sortedFaces.map((person) => (
          <div 
            key={person.id}
            className={`face-card ${person.id === detectedFace?.id ? 'face-card-active' : ''}`}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={person.image} 
                alt={person.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{person.name}</span>
                <span className="text-sm text-gray-500">{person.matchPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="match-percentage" 
                  style={{ width: `${person.matchPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnownFaces;
