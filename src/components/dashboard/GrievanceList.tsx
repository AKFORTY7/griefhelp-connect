
import { useState } from "react";
import { GrievanceCard, GrievanceData } from "./GrievanceCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GrievanceListProps {
  grievances: GrievanceData[];
  isVolunteer?: boolean;
  isAdmin?: boolean;
}

export function GrievanceList({ grievances, isVolunteer = false, isAdmin = false }: GrievanceListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { toast } = useToast();
  
  const handleViewGrievance = (id: string) => {
    // Here we would navigate to the grievance detail page
    console.log("View grievance:", id);
  };
  
  const handleAssignGrievance = (id: string) => {
    // Here we would assign the grievance to the current volunteer
    toast({
      title: "Grievance assigned",
      description: `You have been assigned to grievance ${id}`,
    });
  };
  
  const handleResolveGrievance = (id: string) => {
    // Here we would mark the grievance as resolved
    toast({
      title: "Grievance resolved",
      description: `Grievance ${id} has been marked as resolved`,
    });
  };
  
  // Filter and search the grievances
  const filteredGrievances = grievances.filter(grievance => {
    // Search by ID, name, location, or description
    const matchesSearch = searchTerm === "" || 
      grievance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || grievance.status === statusFilter;
    
    // Filter by type
    const matchesType = typeFilter === "all" || grievance.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, name, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-48">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="shelter">Shelter</SelectItem>
                <SelectItem value="blood">Blood</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {filteredGrievances.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No grievances found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrievances.map((grievance) => (
            <GrievanceCard
              key={grievance.id}
              grievance={grievance}
              onView={handleViewGrievance}
              onAssign={handleAssignGrievance}
              onResolve={handleResolveGrievance}
              isVolunteer={isVolunteer}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
