
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { GrievanceList } from "@/components/dashboard/GrievanceList";
import { GrievanceData } from "@/components/dashboard/GrievanceCard";
import { 
  AlertTriangle, 
  UserCheck, 
  CheckCircle,
  Clock,
  Heart, 
  Droplet, 
  Home as Shelter, 
  Pizza
} from "lucide-react";

// Mock data for grievances
const mockGrievances: GrievanceData[] = [
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
    id: "GR-912357",
    name: "Michael Johnson",
    phone: "+1 345-678-9012",
    location: "789 Pine St, Lakeside",
    type: "shelter",
    description: "Home destroyed in the earthquake. Seeking temporary shelter for a family of 5.",
    status: "resolved",
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    image: "https://images.unsplash.com/photo-1603665301175-57ba46e392bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVhcnRocXVha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
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
    id: "GR-789654",
    name: "David Brown",
    phone: "+1 567-890-1234",
    location: "654 Maple Ave, Eastside",
    type: "health",
    description: "Elderly person with chronic condition needs medication after getting displaced.",
    status: "progress",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
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
];

const DashboardPage = () => {
  // Calculate statistics
  const totalGrievances = mockGrievances.length;
  const pendingGrievances = mockGrievances.filter(g => g.status === "pending").length;
  const assignedGrievances = mockGrievances.filter(g => g.status === "progress").length;
  const resolvedGrievances = mockGrievances.filter(g => g.status === "resolved").length;
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of all grievances and their current status.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Grievances"
            value={totalGrievances}
            description="Total reported cases"
            icon={<AlertTriangle className="h-4 w-4" />}
            trend={{ value: 12, positive: false }}
          />
          
          <StatCard
            title="Pending"
            value={pendingGrievances}
            description="Awaiting assignment"
            icon={<Clock className="h-4 w-4" />}
            trend={{ value: 8, positive: false }}
          />
          
          <StatCard
            title="In Progress"
            value={assignedGrievances}
            description="Currently being addressed"
            icon={<UserCheck className="h-4 w-4" />}
            trend={{ value: 5, positive: true }}
          />
          
          <StatCard
            title="Resolved"
            value={resolvedGrievances}
            description="Successfully completed"
            icon={<CheckCircle className="h-4 w-4" />}
            trend={{ value: 18, positive: true }}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">Recent Grievances</h3>
          <p className="text-sm text-muted-foreground">
            Manage and monitor all grievances from a central dashboard.
          </p>
        </div>
        
        <GrievanceList grievances={mockGrievances} isAdmin={true} />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
