import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useFaceRecognition } from "@/context/FaceRecognitionContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addKnownFace, getRegisteredPeople } from "@/lib/faceRecognition";

const FaceUploader = () => {
  const { toast } = useToast();
  const { refreshKnownFaces } = useFaceRecognition();
  const [name, setName] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingPeople, setExistingPeople] = useState<string[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [isNewPerson, setIsNewPerson] = useState(true);

  useEffect(() => {
    // Fetch existing people when component mounts
    const fetchPeople = async () => {
      const people = await getRegisteredPeople();
      setExistingPeople(people);
    };
    fetchPeople();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(selectedFiles);
      // Create previews
      const urls: string[] = [];
      Array.from(selectedFiles).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            urls.push(e.target.result as string);
            setPreviewUrls([...urls]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files || (!name.trim() && isNewPerson) || (!selectedPerson && !isNewPerson)) {
      toast({
        title: "Error",
        description: "Please provide both a name and at least one image",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const personId = isNewPerson ? name.trim() : selectedPerson;

      // Upload each file to Supabase Storage and add to face recognition
      for (const file of Array.from(files)) {
        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${personId}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('faces')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('faces')
          .getPublicUrl(filePath);

        // Add to face recognition system
        const recognitionResult = await addKnownFace(file, personId);
        if (recognitionResult.status === 'error') {
          throw new Error(recognitionResult.message);
        }

        // Store the face information in the database
        const { error: dbError } = await supabase
          .from('known_faces')
          .insert({
            name: personId,
            image_path: publicUrl,
          });

        if (dbError) {
          throw dbError;
        }
      }

      // Reset form
      setName("");
      setFiles(null);
      setPreviewUrls([]);
      setSelectedPerson("");
      
      // Refresh lists
      refreshKnownFaces();
      const updatedPeople = await getRegisteredPeople();
      setExistingPeople(updatedPeople);

      toast({
        title: "Success",
        description: `Successfully added ${files.length} image(s) for ${personId}!`,
      });
    } catch (error) {
      console.error("Error uploading faces:", error);
      toast({
        title: "Error",
        description: "Failed to upload faces. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h2 className="text-lg font-semibold mb-4">Add Face Images</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <Button
            type="button"
            variant={isNewPerson ? "default" : "outline"}
            onClick={() => setIsNewPerson(true)}
          >
            New Person
          </Button>
          <Button
            type="button"
            variant={!isNewPerson ? "default" : "outline"}
            onClick={() => setIsNewPerson(false)}
          >
            Existing Person
          </Button>
        </div>

        {isNewPerson ? (
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter person's name"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="person">Select Person</Label>
            <Select value={selectedPerson} onValueChange={setSelectedPerson}>
              <SelectTrigger>
                <SelectValue placeholder="Select a person" />
              </SelectTrigger>
              <SelectContent>
                {existingPeople.map((person) => (
                  <SelectItem key={person} value={person}>
                    {person}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="face-images">Face Images</Label>
          <div className="mt-1 space-y-2">
            <Input
              id="face-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="flex-1"
            />
            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                    <img 
                      src={url} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isUploading} className="w-full">
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Images
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default FaceUploader;
