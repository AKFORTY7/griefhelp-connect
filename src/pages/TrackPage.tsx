
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, Phone, User, MapPin, Clock } from "lucide-react";
import { GrievanceData } from "@/components/dashboard/GrievanceCard";

// Mock data for a single grievance
const mockGrievance: GrievanceData = {
  id: "GR-723491",
  name: "John Doe",
  phone: "+1 123-456-7890",
  location: "123 Main St, Springfield",
  type: "health",
  description: "Medical emergency after building collapse. Need immediate assistance with injuries.",
  status: "progress",
  createdAt: new Date().toISOString(),
  image: "https://images.unsplash.com/photo-1541971875076-8f970d573be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZW1lcmdlbmN5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
};

const TrackPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get("id") || "");
  const [grievance, setGrievance] = useState<GrievanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Check if we have an ID in the URL and load that grievance
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setTrackingId(id);
      handleTrack(id);
    }
  }, [searchParams]);
  
  const handleTrack = async (id: string) => {
    setLoading(true);
    
    try {
      // Here would be Supabase logic to fetch the grievance
      // For now, we're simulating an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, just show the mock data if ID starts with "GR-"
      if (id.startsWith("GR-")) {
        setGrievance({...mockGrievance, id});
      } else {
        toast({
          variant: "destructive",
          title: "Grievance not found",
          description: "Please check the tracking ID and try again",
        });
        setGrievance(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Tracking failed",
        description: "There was an error tracking your grievance. Please try again.",
      });
      setGrievance(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId) {
      setSearchParams({ id: trackingId });
      handleTrack(trackingId);
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-status-pending/10 text-status-pending";
      case "progress":
        return "bg-status-progress/10 text-status-progress";
      case "resolved":
        return "bg-status-resolved/10 text-status-resolved";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
    }
  };
  
  const getTypeClass = (type: string) => {
    switch (type) {
      case "health":
        return "bg-emergency-health/10 text-emergency-health";
      case "food":
        return "bg-emergency-food/10 text-emergency-food";
      case "shelter":
        return "bg-emergency-shelter/10 text-emergency-shelter";
      case "blood":
        return "bg-emergency-blood/10 text-emergency-blood";
    }
  };
  
  const getTypeText = (type: string) => {
    switch (type) {
      case "health":
        return "Health Emergency";
      case "food":
        return "Food Relief";
      case "shelter":
        return "Shelter Needs";
      case "blood":
        return "Blood Donation";
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Track a Grievance</h2>
          <p className="text-muted-foreground">
            Enter your grievance tracking ID to check the current status and updates.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Grievance Tracker</CardTitle>
            <CardDescription>
              Enter the tracking ID that was provided when you submitted your grievance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter tracking ID (e.g., GR-123456)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading || !trackingId}>
                {loading ? "Loading..." : "Track"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {grievance && (
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Grievance {grievance.id}</CardTitle>
                  <CardDescription>
                    Submitted on {new Date(grievance.createdAt).toLocaleDateString()} at {new Date(grievance.createdAt).toLocaleTimeString()}
                  </CardDescription>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(grievance.status)}`}>
                  {getStatusText(grievance.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <div className={`mt-1 px-3 py-1 rounded-full text-sm font-medium inline-block ${getTypeClass(grievance.type)}`}>
                      {getTypeText(grievance.type)}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-muted-foreground">Contact Information</Label>
                    <div className="mt-1 space-y-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{grievance.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{grievance.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{grievance.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="mt-1">{grievance.description}</p>
                  </div>
                </div>
                
                {grievance.image && (
                  <div>
                    <Label className="text-muted-foreground">Attached Image</Label>
                    <div className="mt-1 rounded-lg overflow-hidden">
                      <img
                        src={grievance.image}
                        alt="Grievance"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Status Timeline</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-status-resolved flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-background"></span>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h5 className="font-medium">Grievance Submitted</h5>
                        <div className="ml-2 flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{new Date(grievance.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Your grievance has been received and is being processed.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-6 w-6 rounded-full ${grievance.status === "progress" || grievance.status === "resolved" ? "bg-status-resolved" : "bg-muted"} flex items-center justify-center`}>
                      <span className="h-2 w-2 rounded-full bg-background"></span>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h5 className={`font-medium ${grievance.status === "progress" || grievance.status === "resolved" ? "" : "text-muted-foreground"}`}>
                          Volunteer Assigned
                        </h5>
                        {grievance.status === "progress" || grievance.status === "resolved" ? (
                          <div className="ml-2 flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{new Date(new Date(grievance.createdAt).getTime() + 1000 * 60 * 30).toLocaleTimeString()}</span>
                          </div>
                        ) : null}
                      </div>
                      <p className={`text-sm ${grievance.status === "progress" || grievance.status === "resolved" ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                        {grievance.status === "progress" || grievance.status === "resolved" ? 
                          "A volunteer has been assigned to assist with your grievance." : 
                          "Waiting for volunteer assignment..."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-6 w-6 rounded-full ${grievance.status === "resolved" ? "bg-status-resolved" : "bg-muted"} flex items-center justify-center`}>
                      <span className="h-2 w-2 rounded-full bg-background"></span>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h5 className={`font-medium ${grievance.status === "resolved" ? "" : "text-muted-foreground"}`}>
                          Resolution
                        </h5>
                        {grievance.status === "resolved" ? (
                          <div className="ml-2 flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{new Date(new Date(grievance.createdAt).getTime() + 1000 * 60 * 120).toLocaleTimeString()}</span>
                          </div>
                        ) : null}
                      </div>
                      <p className={`text-sm ${grievance.status === "resolved" ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                        {grievance.status === "resolved" ? 
                          "Your grievance has been successfully resolved." : 
                          "Waiting for resolution..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default TrackPage;
