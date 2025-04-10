
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FaceRecognitionProvider } from "./context/FaceRecognitionContext";
import Index from "./pages/Index";
import Recognition from "./pages/Recognition";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FaceRecognitionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recognition" element={<Recognition />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FaceRecognitionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
