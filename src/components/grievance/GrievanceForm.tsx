
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Droplet, 
  Home as Shelter, 
  Pizza, 
  MapPin, 
  Upload
} from "lucide-react";

type GrievanceType = "health" | "food" | "shelter" | "blood";

interface GrievanceTypeOption {
  value: GrievanceType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const grievanceTypes: GrievanceTypeOption[] = [
  {
    value: "health",
    label: "Health Emergency",
    icon: <Heart className="h-5 w-5 text-emergency-health" />,
    description: "Medical emergencies, injuries, or health-related needs"
  },
  {
    value: "food",
    label: "Food Relief",
    icon: <Pizza className="h-5 w-5 text-emergency-food" />,
    description: "Food shortage, water, or essential supplies"
  },
  {
    value: "shelter",
    label: "Shelter Needs",
    icon: <Shelter className="h-5 w-5 text-emergency-shelter" />,
    description: "Housing requirements or shelter during disaster"
  },
  {
    value: "blood",
    label: "Blood Donation",
    icon: <Droplet className="h-5 w-5 text-emergency-blood" />,
    description: "Blood donation requirements or related assistance"
  }
];

export function GrievanceForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState<GrievanceType | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Getting your location",
        description: "Please wait while we fetch your coordinates",
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
          toast({
            title: "Location fetched",
            description: "Your coordinates have been added to the form",
          });
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Location error",
            description: "Unable to get your location: " + error.message,
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType) {
      toast({
        variant: "destructive",
        title: "Missing grievance type",
        description: "Please select the type of grievance",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here would be Supabase logic to save the grievance
      // For now, we're simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Grievance submitted",
        description: "Your grievance has been successfully reported",
      });
      
      // Generate a mock tracking ID
      const trackingId = `GR-${Math.floor(Math.random() * 1000000)}`;
      
      // Navigate to the tracking page with the ID
      navigate(`/track?id=${trackingId}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting your grievance. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Report a Grievance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Type of Grievance</Label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {grievanceTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    className={`relative flex items-start gap-4 rounded-lg border p-4 text-left transition-all hover:bg-accent ${
                      selectedType === type.value
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary"
                    }`}
                    onClick={() => setSelectedType(type.value)}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      {type.icon}
                    </div>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {type.description}
                      </div>
                    </div>
                    {selectedType === type.value && (
                      <span className="absolute right-4 top-4 flex h-3 w-3 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter your contact number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Your current location or address"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGetLocation}
                  className="flex-shrink-0"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Location
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your situation in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-32"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Upload Image (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {imageSrc ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imageSrc}
                        alt="Preview"
                        className="w-full h-full object-contain p-2"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setImage(null);
                          setImageSrc(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG or JPEG (MAX. 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Grievance"}
          </Button>
        </div>
      </form>
    </div>
  );
}
