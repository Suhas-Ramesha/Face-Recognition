
import { useRef, useEffect } from "react";
import { useFaceRecognition } from "@/context/FaceRecognitionContext";
import { Camera, CameraOff } from "lucide-react";

const CameraComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isRecognizing, detectedFace } = useFaceRecognition();
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    if (isRecognizing) {
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera: ", err);
        }
      };
      
      startCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecognizing]);
  
  useEffect(() => {
    const drawFaceFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas || !detectedFace) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      // Clear previous drawings
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a rectangle around the face
      context.beginPath();
      context.lineWidth = 3;
      context.strokeStyle = detectedFace.matchPercentage > 45 ? '#32CD32' : '#FF0000';
      
      const x = canvas.width * 0.2; // Starting from 20% of the canvas width
      const y = canvas.height * 0.2; // Starting from 20% of the canvas height
      const width = canvas.width * 0.6; // Width is 60% of the canvas width
      const height = canvas.height * 0.6; // Height is 60% of the canvas height
      
      context.rect(x, y, width, height);
      context.stroke();
    };
    
    if (isRecognizing && detectedFace) {
      drawFaceFrame();
    } else if (canvasRef.current) {
      // Clear canvas when not recognizing
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [isRecognizing, detectedFace]);

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden bg-gray-100">
      {isRecognizing ? (
        <>
          <div className="absolute top-3 left-3 z-10 bg-black/60 text-white px-3 py-1 rounded-full flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">Live</span>
          </div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute inset-0 h-full w-full"
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <CameraOff size={48} className="text-gray-400 mb-3" />
          <p className="text-gray-500">Camera is turned off</p>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
