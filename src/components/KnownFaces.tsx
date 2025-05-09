import { useFaceRecognition } from "@/context/FaceRecognitionContext";
import { Users, Check, X } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const KnownFaces = () => {
  const { knownFaces, detectedFace, isLoading, lockRecognition, unlockRecognition, isLocked } = useFaceRecognition();
  const { toast } = useToast();
  
  // Sort faces by match percentage (higher first)
  const sortedFaces = [...knownFaces].sort((a, b) => b.matchPercentage - a.matchPercentage);

  const handleConfirm = (personId: string) => {
    lockRecognition(personId);
    toast({
      title: "Recognition Confirmed",
      description: "Face successfully recognized and locked!",
      variant: "default",
    });
  };

  const handleReject = () => {
    unlockRecognition();
    toast({
      title: "Recognition Rejected",
      description: "Recognition has been reset. Please try again.",
      variant: "destructive",
    });
  };

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
              className={`face-card ${person.id === detectedFace?.id ? 'face-card-active' : ''} flex items-center p-3 rounded-lg border ${person.matchPercentage >= 100 ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <img 
                  src={person.image} 
                  alt={person.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{person.name}</span>
                  <span className={`text-sm ${person.matchPercentage >= 100 ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                    {person.matchPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${person.matchPercentage >= 100 ? 'bg-green-500' : 'bg-blue-500'} h-2 rounded-full`} 
                    style={{ width: `${person.matchPercentage}%` }}
                  ></div>
                </div>
              </div>
              {person.id === detectedFace?.id && !isLocked && (
                <div className="flex items-center gap-2 ml-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => handleConfirm(person.id)}
                  >
                    <Check size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={handleReject}
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnownFaces;
