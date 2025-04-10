
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Person } from '@/types';

type FaceRecognitionContextType = {
  knownFaces: Person[];
  detectedFace: Person | null;
  isRecognizing: boolean;
  startRecognition: () => void;
  stopRecognition: () => void;
  addKnownFace: (face: Person) => void;
};

const FaceRecognitionContext = createContext<FaceRecognitionContextType | undefined>(undefined);

// Sample data
const sampleData: Person[] = [
  {
    id: '1',
    name: 'Tim',
    image: '/lovable-uploads/f38c86bc-1cfd-4b2d-bcf9-954f9858253f.png',
    matchPercentage: 0,
  },
  {
    id: '2',
    name: 'Dhananjay',
    image: '/lovable-uploads/f38c86bc-1cfd-4b2d-bcf9-954f9858253f.png',
    matchPercentage: 0,
  },
  {
    id: '3',
    name: 'Likith',
    image: '/lovable-uploads/f38c86bc-1cfd-4b2d-bcf9-954f9858253f.png',
    matchPercentage: 0,
  },
  {
    id: '4',
    name: 'Micro Mahesh',
    image: '/lovable-uploads/f38c86bc-1cfd-4b2d-bcf9-954f9858253f.png',
    matchPercentage: 0,
  },
  {
    id: '5',
    name: 'Steve',
    image: '/lovable-uploads/f38c86bc-1cfd-4b2d-bcf9-954f9858253f.png',
    matchPercentage: 0,
  },
];

export const FaceRecognitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [knownFaces, setKnownFaces] = useState<Person[]>(sampleData);
  const [detectedFace, setDetectedFace] = useState<Person | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);

  // Simulate face recognition
  useEffect(() => {
    if (!isRecognizing) {
      setDetectedFace(null);
      // Reset all match percentages
      setKnownFaces((prev) =>
        prev.map((face) => ({ ...face, matchPercentage: 0 }))
      );
      return;
    }

    const recognitionInterval = setInterval(() => {
      // Randomly select a face from known faces for demo
      const randomIndex = Math.floor(Math.random() * knownFaces.length);
      const selectedFace = knownFaces[randomIndex];
      
      // Generate a random match percentage (45-100 for detected, 2-3 for low matches)
      const isHighMatch = Math.random() > 0.5;
      const matchPercentage = isHighMatch ? Math.floor(Math.random() * 51) + 50 : Math.floor(Math.random() * 2) + 2;
      
      // Display match as 100% if above 50%
      const displayedPercentage = matchPercentage > 50 ? 100 : matchPercentage;
      
      const updatedFace = { ...selectedFace, matchPercentage: displayedPercentage };
      
      // Update the knownFaces array with the new match percentage
      setKnownFaces((prev) =>
        prev.map((face) => 
          face.id === updatedFace.id 
            ? updatedFace 
            : { ...face, matchPercentage: 0 }
        )
      );
      
      setDetectedFace(updatedFace);
    }, 3000);

    return () => clearInterval(recognitionInterval);
  }, [isRecognizing, knownFaces]);

  const startRecognition = () => setIsRecognizing(true);
  const stopRecognition = () => setIsRecognizing(false);
  const addKnownFace = (face: Person) => setKnownFaces((prev) => [...prev, face]);

  return (
    <FaceRecognitionContext.Provider
      value={{
        knownFaces,
        detectedFace,
        isRecognizing,
        startRecognition,
        stopRecognition,
        addKnownFace,
      }}
    >
      {children}
    </FaceRecognitionContext.Provider>
  );
};

export const useFaceRecognition = () => {
  const context = useContext(FaceRecognitionContext);
  if (context === undefined) {
    throw new Error('useFaceRecognition must be used within a FaceRecognitionProvider');
  }
  return context;
};
