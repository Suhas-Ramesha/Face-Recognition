import React, { createContext, useContext, useState, useEffect } from 'react';
import { Person } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

type FaceRecognitionContextType = {
  knownFaces: Person[];
  detectedFace: Person | null;
  isRecognizing: boolean;
  isLocked: boolean;
  startRecognition: () => void;
  stopRecognition: () => void;
  lockRecognition: (personId: string) => void;
  unlockRecognition: () => void;
  addKnownFace: (face: Person) => void;
  refreshKnownFaces: () => Promise<void>;
  isLoading: boolean;
};

const FaceRecognitionContext = createContext<FaceRecognitionContextType | undefined>(undefined);

export const FaceRecognitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [knownFaces, setKnownFaces] = useState<Person[]>([]);
  const [detectedFace, setDetectedFace] = useState<Person | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedPersonId, setLockedPersonId] = useState<string | null>(null);

  // Fetch known faces from the database
  const fetchKnownFaces = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('known_faces')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      // Transform the data to match our Person type
      const faces: Person[] = data.map(face => ({
        id: face.id,
        name: face.name,
        image: face.image_path,
        matchPercentage: 0,
      }));

      setKnownFaces(faces);
    } catch (error) {
      console.error('Error fetching known faces:', error);
      toast({
        title: 'Error',
        description: 'Failed to load known faces',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchKnownFaces();
  }, []);

  // Simulate face recognition
  useEffect(() => {
    if (!isRecognizing || knownFaces.length === 0) {
      if (!isLocked) {
        setDetectedFace(null);
        // Reset all match percentages
        setKnownFaces((prev) =>
          prev.map((face) => ({ ...face, matchPercentage: 0 }))
        );
      }
      return;
    }

    if (isLocked) {
      return; // Don't update recognition if locked
    }

    const recognitionInterval = setInterval(() => {
      // Randomly select a face from known faces for demo
      const randomIndex = Math.floor(Math.random() * knownFaces.length);
      const selectedFace = knownFaces[randomIndex];
      
      // Generate a random match percentage (1-100 for raw values)
      const rawMatchPercentage = Math.floor(Math.random() * 100) + 1;
      
      // Apply the new rule: 100% if 30% or more, 1-2% otherwise
      const displayedPercentage = rawMatchPercentage >= 30 ? 100 : Math.floor(Math.random() * 2) + 1;
      
      const updatedFace = { ...selectedFace, matchPercentage: displayedPercentage };
      
      // Update the knownFaces array with the new match percentage
      setKnownFaces((prev) =>
        prev.map((face) => 
          face.id === updatedFace.id 
            ? updatedFace 
            : { ...face, matchPercentage: Math.floor(Math.random() * 2) + 1 }
        )
      );
      
      setDetectedFace(updatedFace);
    }, 3000);

    return () => clearInterval(recognitionInterval);
  }, [isRecognizing, knownFaces, isLocked]);

  const startRecognition = () => {
    setIsLocked(false);
    setLockedPersonId(null);
    setIsRecognizing(true);
  };

  const stopRecognition = () => {
    setIsLocked(false);
    setLockedPersonId(null);
    setIsRecognizing(false);
  };
  
  const lockRecognition = (personId: string) => {
    setIsLocked(true);
    setLockedPersonId(personId);
    // Update the knownFaces to show only the confirmed person with 100%
    setKnownFaces((prev) =>
      prev.map((face) => ({
        ...face,
        matchPercentage: face.id === personId ? 100 : 0,
      }))
    );
    // Update detected face
    const confirmedFace = knownFaces.find((face) => face.id === personId);
    if (confirmedFace) {
      setDetectedFace({ ...confirmedFace, matchPercentage: 100 });
    }
  };

  const unlockRecognition = () => {
    setIsLocked(false);
    setLockedPersonId(null);
  };
  
  const addKnownFace = (face: Person) => {
    setKnownFaces((prev) => [...prev, face]);
  };

  const refreshKnownFaces = async () => {
    await fetchKnownFaces();
  };

  return (
    <FaceRecognitionContext.Provider
      value={{
        knownFaces,
        detectedFace,
        isRecognizing,
        isLocked,
        startRecognition,
        stopRecognition,
        lockRecognition,
        unlockRecognition,
        addKnownFace,
        refreshKnownFaces,
        isLoading,
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
