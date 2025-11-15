import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Users, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import MagicBento from "@/components/ui/magic-bento";

interface KnownFace {
  id: string;
  name: string;
  image_path: string;
  created_at: string;
}

interface PersonGroup {
  name: string;
  count: number;
  images: KnownFace[];
  thumbnail: string;
}

export const KnownPeopleSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<PersonGroup | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: knownFaces, isLoading } = useQuery({
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

  // Group faces by person name
  const groupedPeople = knownFaces?.reduce((acc, face) => {
    const existing = acc.find(g => g.name === face.name);
    if (existing) {
      existing.count++;
      existing.images.push(face);
    } else {
      acc.push({
        name: face.name,
        count: 1,
        images: [face],
        thumbnail: face.image_path,
      });
    }
    return acc;
  }, [] as PersonGroup[]) || [];

  const filteredPeople = groupedPeople.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePersonClick = (person: PersonGroup) => {
    setSelectedPerson(person);
    setIsDrawerOpen(true);
  };

  return (
    <>
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
        className="h-full"
      >
        <div className="h-full flex flex-col bg-card">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold text-lg">Known People</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))
            ) : filteredPeople.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No people yet.</p>
                <p className="text-xs mt-1">Add a face to get started.</p>
              </div>
            ) : (
              filteredPeople.map((person) => (
                <Button
                  key={person.name}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-auto p-3 hover:bg-muted/50"
                  onClick={() => handlePersonClick(person)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={person.thumbnail} alt={person.name} />
                    <AvatarFallback>{person.name[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{person.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {person.count} {person.count === 1 ? "image" : "images"}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
        </div>
      </MagicBento>

      {/* Person Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedPerson?.name}</SheetTitle>
            <SheetDescription>
              {selectedPerson?.count} {selectedPerson?.count === 1 ? "image" : "images"}
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            <div className="grid grid-cols-2 gap-3">
              {selectedPerson?.images.map((image) => (
                <MagicBento
                  key={image.id}
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
                  className="relative group rounded-lg overflow-hidden"
                >
                  <img
                    src={image.image_path}
                    alt={image.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg pointer-events-none" />
                </MagicBento>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};
