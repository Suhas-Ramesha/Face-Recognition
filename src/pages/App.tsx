import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { KnownPeopleSidebar } from "@/components/app/KnownPeopleSidebar";
import { UploadManagePanel } from "@/components/app/UploadManagePanel";
import { LiveRecognitionPanel } from "@/components/app/LiveRecognitionPanel";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const AppPage = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600" />
          <h1 className="text-lg font-semibold">Face Recognition — Personal Project</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left: Known People Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <KnownPeopleSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Center: Upload & Manage */}
          <ResizablePanel defaultSize={45} minSize={30}>
            <UploadManagePanel />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right: Live Recognition */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <LiveRecognitionPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default AppPage;
