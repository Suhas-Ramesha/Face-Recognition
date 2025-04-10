
import { useFaceRecognition } from "@/context/FaceRecognitionContext";
import { Users } from "lucide-react";
import { Loader2 } from "lucide-react";

const KnownFaces = () => {
  const { knownFaces, detectedFace, isLoading } = useFaceRecognition();
  
  // Sort faces by match percentage (higher first)
  const sortedFaces = [...knownFaces].sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="h-full bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center gap-2 mb-6">
        <Users className="text-blue-600" size={20} />
        <h2 className="text-lg font-semibold">Known Faces</h2>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-500">Loading faces...</span>
        </div>
      ) : sortedFaces.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-2">No faces found</p>
          <p className="text-sm text-gray-400">Upload new faces to get started</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default KnownFaces;
