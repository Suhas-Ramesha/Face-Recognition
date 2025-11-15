import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, Video, VideoOff, Zap, User, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MagicBento from "@/components/ui/magic-bento";

interface RecognitionResult {
  person_id: string;
  confidence: number;
  timestamp: number;
}

interface TopMatch {
  name: string;
  confidence: number;
}

interface KnownFace {
  id: string;
  name: string;
  image_path: string;
  created_at: string;
}

const compareImages = async (capturedImageData: ImageData, knownImageUrl: string): Promise<number> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        // Resize both images to a common size for comparison (64x64 for performance)
        const compareSize = 64;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(0);
          return;
        }
        
        // Resize known image
        canvas.width = compareSize;
        canvas.height = compareSize;
        ctx.drawImage(img, 0, 0, compareSize, compareSize);
        const knownImageData = ctx.getImageData(0, 0, compareSize, compareSize);
        
        // Resize captured image
        const capturedCanvas = document.createElement("canvas");
        const capturedCtx = capturedCanvas.getContext("2d", { willReadFrequently: true });
        if (!capturedCtx) {
          resolve(0);
          return;
        }
        
        capturedCanvas.width = compareSize;
        capturedCanvas.height = compareSize;
        
        // Create a temporary canvas to resize the captured image
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) {
          resolve(0);
          return;
        }
        
        tempCanvas.width = capturedImageData.width;
        tempCanvas.height = capturedImageData.height;
        tempCtx.putImageData(capturedImageData, 0, 0);
        capturedCtx.drawImage(tempCanvas, 0, 0, compareSize, compareSize);
        const resizedCapturedData = capturedCtx.getImageData(0, 0, compareSize, compareSize);
        
        // Simple pixel-based comparison
        let diff = 0;
        const pixelCount = compareSize * compareSize;
        
        for (let i = 0; i < resizedCapturedData.data.length; i += 4) {
          const rDiff = Math.abs(resizedCapturedData.data[i] - knownImageData.data[i]);
          const gDiff = Math.abs(resizedCapturedData.data[i + 1] - knownImageData.data[i + 1]);
          const bDiff = Math.abs(resizedCapturedData.data[i + 2] - knownImageData.data[i + 2]);
          diff += (rDiff + gDiff + bDiff) / 3;
        }
        
        // Convert difference to similarity (0-100)
        // Normalize: average difference per pixel, then convert to percentage
        const avgDiff = diff / pixelCount;
        const similarity = Math.max(0, Math.min(100, 100 - (avgDiff / 255) * 100));
        resolve(similarity);
      } catch (error) {
        console.error("Error comparing images:", error);
        resolve(0);
      }
    };
    img.onerror = (e) => {
      console.error("Error loading image:", knownImageUrl, e);
      resolve(0);
    };
    img.src = knownImageUrl;
  });
};

export const LiveRecognitionPanel = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [autoScan, setAutoScan] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<RecognitionResult | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecognitionResult[]>([]);
  const [topCandidates, setTopCandidates] = useState<TopMatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMatchVisible, setIsMatchVisible] = useState(false);
  const { toast } = useToast();

  // Fetch known faces from Supabase (using same key as KnownPeopleSidebar for consistency)
  const { data: knownFaces, isLoading: isLoadingFaces } = useQuery({
    queryKey: ["knownFaces"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("known_faces")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as KnownFace[];
    },
  });

  // Update top candidates when known faces change
  useEffect(() => {
    if (knownFaces && knownFaces.length > 0) {
      // Group by name and show unique people
      const uniquePeople = knownFaces.reduce((acc, face) => {
        if (!acc.find(p => p.name === face.name)) {
          acc.push({ name: face.name, confidence: 0 });
        }
        return acc;
      }, [] as TopMatch[]);
      
      // If we have recent matches, update with actual confidence scores
      if (recentMatches.length > 0) {
        const updatedCandidates = uniquePeople.map(person => {
          const match = recentMatches.find(m => m.person_id === person.name);
          return {
            name: person.name,
            confidence: match ? match.confidence : 0
          };
        }).sort((a, b) => b.confidence - a.confidence).slice(0, 5);
        setTopCandidates(updatedCandidates);
      } else {
        setTopCandidates(uniquePeople.slice(0, 5));
      }
    } else {
      setTopCandidates([]);
    }
  }, [knownFaces, recentMatches]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setAutoScan(false);
    }
  };

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !knownFaces || knownFaces.length === 0) {
      if (!knownFaces || knownFaces.length === 0) {
        toast({
          title: "No known faces",
          description: "Please upload some face images first.",
          variant: "destructive",
        });
      }
      return;
    }

    setIsProcessing(true);
    
    try {
      // Capture frame from video
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      const capturedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Compare with all known faces
      const comparisons = await Promise.all(
        knownFaces.map(async (face) => {
          const similarity = await compareImages(capturedImageData, face.image_path);
          return {
            name: face.name,
            confidence: Math.round(similarity),
            faceId: face.id,
          };
        })
      );

      // Group by person name and get best match per person
      const bestMatches = comparisons.reduce((acc, comp) => {
        const existing = acc.find(m => m.name === comp.name);
        if (!existing || comp.confidence > existing.confidence) {
          if (existing) {
            const index = acc.indexOf(existing);
            acc[index] = comp;
          } else {
            acc.push(comp);
          }
        }
        return acc;
      }, [] as typeof comparisons);

      // Sort by confidence and get top match
      bestMatches.sort((a, b) => b.confidence - a.confidence);
      
      const topMatch = bestMatches[0];
      
      if (topMatch && topMatch.confidence > 30) {
        const result: RecognitionResult = {
          person_id: topMatch.name,
          confidence: topMatch.confidence,
      timestamp: Date.now(),
    };
    
        setCurrentMatch(result);
        setIsMatchVisible(true);
        setRecentMatches(prev => [result, ...prev.slice(0, 9)]);
        
        // Update top candidates with actual confidence scores
        const updatedCandidates = bestMatches
          .slice(0, 5)
          .map(m => ({ name: m.name, confidence: m.confidence }));
        setTopCandidates(updatedCandidates);
      } else {
        setCurrentMatch(null);
        setIsMatchVisible(false);
        toast({
          title: "No match found",
          description: "Could not match the face with any known person.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error capturing frame:", error);
      toast({
        title: "Recognition error",
        description: "Failed to process the captured frame.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [knownFaces, toast]);

  // Auto-scan effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (autoScan && isStreaming && !isProcessing) {
      intervalId = setInterval(() => {
        captureFrame();
      }, 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoScan, isStreaming, isProcessing, captureFrame]);

  // Handle fade-out when streaming stops
  useEffect(() => {
    if (!isStreaming && currentMatch) {
      setIsMatchVisible(false);
      // Clear the match after fade-out animation completes (500ms)
      const timeoutId = setTimeout(() => {
        setCurrentMatch(null);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isStreaming, currentMatch]);

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-4">
        <MagicBento
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="132, 0, 255"
          disabled={isStreaming}
        >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Live Recognition
            </CardTitle>
            <CardDescription>
              Real-time face detection and matching
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Webcam Preview */}
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <VideoOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Camera off</p>
                  </div>
                </div>
              )}
              {currentMatch && (
                <div 
                  className={`absolute top-3 left-3 right-3 transition-opacity duration-500 ${
                    isMatchVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{currentMatch.person_id}</span>
                      <Badge variant={currentMatch.confidence > 80 ? "default" : "secondary"}>
                        {currentMatch.confidence}%
                      </Badge>
                    </div>
                    <Progress value={currentMatch.confidence} className="h-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={isStreaming ? stopWebcam : startWebcam}
                variant={isStreaming ? "destructive" : "default"}
                className="flex-1"
              >
                {isStreaming ? (
                  <>
                    <VideoOff className="h-4 w-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button
                onClick={captureFrame}
                disabled={!isStreaming || isProcessing}
                variant="secondary"
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                {isProcessing ? "Processing..." : "Capture"}
              </Button>
            </div>

            {/* Auto-scan Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="auto-scan" className="cursor-pointer">
                  Auto-scan (1s interval)
                </Label>
              </div>
              <Switch
                id="auto-scan"
                checked={autoScan}
                onCheckedChange={setAutoScan}
                disabled={!isStreaming}
              />
            </div>
          </CardContent>
        </Card>
        </MagicBento>

        {/* Top Candidates */}
        <MagicBento
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="132, 0, 255"
          disabled={isStreaming}
        >
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingFaces ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Loading known faces...
              </div>
            ) : topCandidates.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No known faces. Upload some images to get started.
              </div>
            ) : (
            <div className="space-y-3">
              {topCandidates.map((candidate, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{candidate.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {candidate.confidence}%
                      </span>
                    </div>
                    <Progress value={candidate.confidence} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
        </MagicBento>

        {/* Recent Scans */}
        {recentMatches.length > 0 && (
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="132, 0, 255"
            disabled={isStreaming}
          >
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentMatches.slice(0, 5).map((match, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-muted/50"
                  >
                    <span>{match.person_id}</span>
                    <Badge variant="outline" className="text-xs">
                      {match.confidence}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </MagicBento>
        )}
      </div>
    </ScrollArea>
  );
};
