
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { GrievanceList } from "@/components/dashboard/GrievanceList";
import { GrievanceData } from "@/components/dashboard/GrievanceCard";
import { 
  Heart, 
  Droplet, 
  Home as Shelter, 
  Pizza,
  HandHelping,
  CheckCircle,
  Clock
} from "lucide-react";

// Mock data for grievances that would be shown to volunteers
const volunteerGrievances: GrievanceData[] = [
  {
    id: "GR-723491",
    name: "John Doe",
    phone: "+1 123-456-7890",
    location: "123 Main St, Springfield",
    type: "health",
    description: "Medical emergency after building collapse. Need immediate assistance with injuries.",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    image: "https://images.unsplash.com/photo-1541971875076-8f970d573be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZW1lcmdlbmN5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "GR-456123",
    name: "Emily Williams",
    phone: "+1 456-789-0123",
    location: "321 Elm St, Westview",
    type: "blood",
    description: "Urgent need for O- blood type for accident victim. Critical condition.",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "GR-321987",
    name: "Sarah Miller",
    phone: "+1 678-901-2345",
    location: "987 Cedar St, Northtown",
    type: "food",
    description: "Community kitchen needs supplies to feed 50 displaced people.",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    image: "https://images.unsplash.com/photo-1518568740560-333139a27e71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8a2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "GR-528734",
    name: "Jane Smith",
    phone: "+1 234-567-8901",
    location: "456 Oak Ave, Riverdale",
    type: "food",
    description: "Family stranded without food after flood. Need supplies for 4 people including 2 children.",
    status: "progress",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "GR-789654",
    name: "David Brown",
    phone: "+1 567-890-1234",
    location: "654 Maple Ave, Eastside",
    type: "health",
    description: "Elderly person with chronic condition needs medication after getting displaced.",
    status: "progress",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

const VolunteerPage = () => {
  // Calculate statistics for volunteer
  const availableGrievances = volunteerGrievances.filter(g => g.status === "pending").length;
  const assignedGrievances = volunteerGrievances.filter(g => g.status === "progress").length;
  const completedGrievances = 12; // Mock value for the volunteer's completed grievances
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Volunteer Dashboard</h2>
          <p className="text-muted-foreground">
            View and manage available grievances that need assistance.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Available Grievances"
            value={availableGrievances}
            description="Cases needing volunteers"
            icon={<Clock className="h-4 w-4" />}
          />
          
          <StatCard
            title="Assigned to You"
            value={assignedGrievances}
            description="Cases you're handling"
            icon={<HandHelping className="h-4 w-4" />}
          />
          
          <StatCard
            title="Completed Cases"
            value={completedGrievances}
            description="Successfully resolved"
            icon={<CheckCircle className="h-4 w-4" />}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">Available Grievances</h3>
          <p className="text-sm text-muted-foreground">
            Browse grievances that need assistance and offer your help.
          </p>
        </div>
        
        <GrievanceList grievances={volunteerGrievances} isVolunteer={true} />
      </div>
    </AppLayout>
  );
};

export default VolunteerPage;
