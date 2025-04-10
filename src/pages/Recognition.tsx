
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CameraComponent from "@/components/Camera";
import KnownFaces from "@/components/KnownFaces";
import { useFaceRecognition } from "@/context/FaceRecognitionContext";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff } from "lucide-react";

const Recognition = () => {
  const { isRecognizing, startRecognition, stopRecognition } = useFaceRecognition();

  const toggleRecognition = () => {
    if (isRecognizing) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Face Recognition</h1>
            <Button 
              onClick={toggleRecognition}
              variant={isRecognizing ? "destructive" : "default"}
              className="gap-2"
            >
              {isRecognizing ? (
                <>
                  <CameraOff size={16} /> Stop Recognition
                </>
              ) : (
                <>
                  <Camera size={16} /> Start Recognition
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[480px]">
              <CameraComponent />
            </div>
            <div className="h-[480px]">
              <KnownFaces />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recognition;
