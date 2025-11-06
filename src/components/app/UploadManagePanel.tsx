import { useState, useCallback } from "react";
import { Upload, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export const UploadManagePanel = () => {
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [newPersonName, setNewPersonName] = useState("");
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingPeople } = useQuery({
    queryKey: ["existingPeople"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("known_faces")
        .select("name")
        .order("name");
      
      if (error) throw error;
      
      // Get unique names
      const uniqueNames = [...new Set(data.map(face => face.name))];
      return uniqueNames;
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith("image/")
    );
    
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        file,
        progress: 0,
        status: "pending" as const,
      }));
      setUploadFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        file,
        progress: 0,
        status: "pending" as const,
      }));
      setUploadFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleUpload = async () => {
    const personName = mode === "new" ? newPersonName : selectedPerson;
    
    if (!personName) {
      toast({
        title: "Person name required",
        description: "Please select an existing person or enter a new name.",
        variant: "destructive",
      });
      return;
    }

    if (uploadFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select images to upload.",
        variant: "destructive",
      });
      return;
    }

    for (let i = 0; i < uploadFiles.length; i++) {
      const uploadFile = uploadFiles[i];
      
      setUploadFiles(prev => 
        prev.map((f, idx) => 
          idx === i ? { ...f, status: "uploading" } : f
        )
      );

      try {
        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadFiles(prev => 
            prev.map((f, idx) => 
              idx === i ? { ...f, progress } : f
            )
          );
        }

        // TODO: Actual upload to Supabase Storage and database insert
        // const filePath = `${userId}/${Date.now()}_${uploadFile.file.name}`;
        // await supabase.storage.from('faces').upload(filePath, uploadFile.file);
        // await supabase.from('known_faces').insert({ name: personName, image_path: filePath });

        setUploadFiles(prev => 
          prev.map((f, idx) => 
            idx === i ? { ...f, status: "success", progress: 100 } : f
          )
        );
      } catch (error) {
        setUploadFiles(prev => 
          prev.map((f, idx) => 
            idx === i ? { ...f, status: "error", error: (error as Error).message } : f
          )
        );
      }
    }

    queryClient.invalidateQueries({ queryKey: ["knownFaces"] });
    queryClient.invalidateQueries({ queryKey: ["existingPeople"] });
    
    toast({
      title: "Upload complete",
      description: `Successfully uploaded ${uploadFiles.length} images for ${personName}.`,
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload & Manage</CardTitle>
            <CardDescription>
              Add new face images or manage existing ones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Person Selection */}
            <div className="space-y-4">
              <Label>Select Person</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as "existing" | "new")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <Label htmlFor="existing" className="cursor-pointer">Existing person</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new" className="cursor-pointer">Create new</Label>
                </div>
              </RadioGroup>

              {mode === "existing" ? (
                <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a person..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {existingPeople?.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter person name..."
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Use a unique, consistent name for best results
                  </p>
                </div>
              )}
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
              `}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-2">
                Drag & drop images here
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                or click to browse
              </p>
              <Button variant="secondary" asChild>
                <label className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Select Files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </Button>
            </div>

            {/* Upload Queue */}
            {uploadFiles.length > 0 && (
              <div className="space-y-3">
                <Label>Upload Queue ({uploadFiles.length} files)</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {uploadFiles.map((uploadFile, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1">{uploadFile.file.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {uploadFile.status}
                        </span>
                      </div>
                      {uploadFile.status === "uploading" && (
                        <Progress value={uploadFile.progress} className="h-1" />
                      )}
                    </div>
                  ))}
                </div>
                <Button onClick={handleUpload} className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Upload All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};
