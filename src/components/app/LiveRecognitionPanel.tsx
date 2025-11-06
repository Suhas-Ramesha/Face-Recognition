import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, Video, VideoOff, Zap, User, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RecognitionResult {
  person_id: string;
  confidence: number;
  timestamp: number;
}

interface TopMatch {
  name: string;
  confidence: number;
}

export const LiveRecognitionPanel = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [autoScan, setAutoScan] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<RecognitionResult | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecognitionResult[]>([]);
  const [topCandidates, setTopCandidates] = useState<TopMatch[]>([
    { name: "John Doe", confidence: 87 },
    { name: "Jane Smith", confidence: 72 },
    { name: "Bob Wilson", confidence: 45 },
  ]);

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
    }
  };

  const captureFrame = useCallback(() => {
    // TODO: Capture frame and send to recognition edge function
    console.log("Capturing frame...");
    
    // Simulate recognition result
    const mockResult: RecognitionResult = {
      person_id: "John Doe",
      confidence: Math.floor(Math.random() * 30) + 70,
      timestamp: Date.now(),
    };
    
    setCurrentMatch(mockResult);
    setRecentMatches(prev => [mockResult, ...prev.slice(0, 9)]);
  }, []);

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-4">
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
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <VideoOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Camera off</p>
                  </div>
                </div>
              )}
              {currentMatch && (
                <div className="absolute top-3 left-3 right-3">
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
                disabled={!isStreaming}
                variant="secondary"
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture
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

        {/* Top Candidates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Recent Scans */}
        {recentMatches.length > 0 && (
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
        )}
      </div>
    </ScrollArea>
  );
};
