
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Droplet, 
  Home as Shelter, 
  Pizza, 
  MapPin, 
  Clock, 
  Phone,
  User,
  ChevronRight 
} from "lucide-react";

export type GrievanceStatus = "pending" | "progress" | "resolved";
export type GrievanceType = "health" | "food" | "shelter" | "blood";

export interface GrievanceData {
  id: string;
  name: string;
  phone: string;
  location: string;
  type: GrievanceType;
  description: string;
  status: GrievanceStatus;
  createdAt: string;
  image?: string;
}

interface GrievanceCardProps {
  grievance: GrievanceData;
  onView?: (id: string) => void;
  onAssign?: (id: string) => void;
  onResolve?: (id: string) => void;
  isVolunteer?: boolean;
  isAdmin?: boolean;
}

export function GrievanceCard({ 
  grievance, 
  onView, 
  onAssign, 
  onResolve, 
  isVolunteer = false,
  isAdmin = false 
}: GrievanceCardProps) {
  const { id, name, phone, location, type, description, status, createdAt, image } = grievance;
  
  const getTypeIcon = (type: GrievanceType) => {
    switch (type) {
      case "health":
        return <Heart className="h-5 w-5 text-emergency-health" />;
      case "food":
        return <Pizza className="h-5 w-5 text-emergency-food" />;
      case "shelter":
        return <Shelter className="h-5 w-5 text-emergency-shelter" />;
      case "blood":
        return <Droplet className="h-5 w-5 text-emergency-blood" />;
    }
  };
  
  const getStatusBadge = (status: GrievanceStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="status-badge pending">Pending</Badge>;
      case "progress":
        return <Badge variant="outline" className="status-badge progress">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="status-badge resolved">Resolved</Badge>;
    }
  };
  
  const getTypeBadge = (type: GrievanceType) => {
    switch (type) {
      case "health":
        return <Badge variant="outline" className="emergency-badge health">Health Emergency</Badge>;
      case "food":
        return <Badge variant="outline" className="emergency-badge food">Food Relief</Badge>;
      case "shelter":
        return <Badge variant="outline" className="emergency-badge shelter">Shelter Needs</Badge>;
      case "blood":
        return <Badge variant="outline" className="emergency-badge blood">Blood Donation</Badge>;
    }
  };
  
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center">
          <div className="rounded-full bg-muted p-2 mr-2">
            {getTypeIcon(type)}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{getTypeBadge(type)}</h3>
            <p className="text-sm text-muted-foreground">ID: {id}</p>
          </div>
        </div>
        {getStatusBadge(status)}
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="flex items-start">
            <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div className="text-sm">{name}</div>
          </div>
          
          <div className="flex items-start">
            <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div className="text-sm">{phone}</div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div className="text-sm">{location}</div>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div className="text-sm">
              {new Date(createdAt).toLocaleString()}
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <p className="text-sm line-clamp-3">{description}</p>
          
          {image && (
            <div className="mt-2">
              <img
                src={image}
                alt="Grievance"
                className="w-full h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm" onClick={() => onView?.(id)}>
          View Details
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        
        <div className="flex gap-2">
          {status === "pending" && (isVolunteer || isAdmin) && (
            <Button variant="outline" size="sm" onClick={() => onAssign?.(id)}>
              Assign
            </Button>
          )}
          
          {status === "progress" && (isVolunteer || isAdmin) && (
            <Button variant="outline" size="sm" onClick={() => onResolve?.(id)}>
              Resolve
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
