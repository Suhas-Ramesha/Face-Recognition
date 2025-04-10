
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useFaceRecognition } from "@/context/FaceRecognitionContext";

const FaceUploader = () => {
  const { toast } = useToast();
  const { refreshKnownFaces } = useFaceRecognition();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !name.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a name and an image",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

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

      // Store the face information in the database
      const { error: dbError } = await supabase
        .from('known_faces')
        .insert({
          name: name.trim(),
          image_path: publicUrl,
        });

      if (dbError) {
        throw dbError;
      }

      // Reset form
      setName("");
      setFile(null);
      setPreviewUrl(null);
      
      // Refresh the list of known faces
      refreshKnownFaces();

      toast({
        title: "Success",
        description: "Face uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading face:", error);
      toast({
        title: "Error",
        description: "Failed to upload face. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h2 className="text-lg font-semibold mb-4">Add New Face</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter person's name"
          />
        </div>

        <div>
          <Label htmlFor="face-image">Face Image</Label>
          <div className="mt-1 flex items-center gap-4">
            <Input
              id="face-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="flex-1"
            />
            {previewUrl && (
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
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
              Upload Face
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default FaceUploader;
