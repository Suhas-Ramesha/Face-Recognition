const FACE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface RecognitionResult {
  status: 'recognized' | 'unknown' | 'error';
  person_id?: string;
  confidence?: number;
  message?: string;
}

export const recognizeFace = async (imageFile: File): Promise<RecognitionResult> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    const response = await fetch(`${FACE_API_URL}/recognize`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Recognition request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Face recognition error:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const addKnownFace = async (imageFile: File, personId: string): Promise<RecognitionResult> => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('person_id', personId);

  try {
    const response = await fetch(`${FACE_API_URL}/add-known-face`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to add known face');
    }

    return await response.json();
  } catch (error) {
    console.error('Add known face error:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const addMultipleKnownFaces = async (imageFiles: File[], personId: string): Promise<RecognitionResult[]> => {
  const results: RecognitionResult[] = [];
  
  for (const imageFile of imageFiles) {
    const result = await addKnownFace(imageFile, personId);
    results.push(result);
  }
  
  return results;
};

export const getRegisteredPeople = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${FACE_API_URL}/people`);
    if (!response.ok) {
      throw new Error('Failed to fetch registered people');
    }
    return await response.json();
  } catch (error) {
    console.error('Get registered people error:', error);
    return [];
  }
}; 