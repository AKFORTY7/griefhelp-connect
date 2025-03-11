
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  FileText, 
  Users,
  AlertTriangle, 
  PieChart,
  Settings, 
  Heart,
  Droplet,
  Home as Shelter,
  Pizza
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userRole: string | null;
}

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  path: string;
  active?: boolean;
  badge?: number;
}

function SidebarItem({ icon, label, path, active, badge }: SidebarItemProps) {
  return (
    <Link 
      to={path}
      onClick={(e) => {
        const target = e.currentTarget;
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = target.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        ripple.className = 'absolute rounded-full bg-primary/10 animate-[ripple_0.7s_ease-out]';
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      }}
    >
      <Button
        variant={active ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2",
          active && "bg-secondary text-secondary-foreground"
        )}
      >
        {icon}
        <span>{label}</span>
        {badge ? (
          <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {badge}
          </span>
        ) : null}
      </Button>
    </Link>
  );
}

export function Sidebar({ open, setOpen, userRole }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => location.pathname === path;
  
  const closeSidebarIfMobile = () => {
    if (isMobile) {
      setOpen(false);
    }
  };
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm" 
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r bg-background transition-transform duration-300 ease-in-out lg:static lg:w-64",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4">
          <Link to={userRole === 'admin' ? '/dashboard' : userRole === 'volunteer' ? '/volunteer' : '/report'} className="flex items-center gap-2 font-semibold" onClick={closeSidebarIfMobile}>
            <AlertTriangle className="h-6 w-6 text-primary" />
            <span>Grievance Connect</span>
          </Link>
        </div>
        
        <Separator />
        
        <ScrollArea className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {/* Admin items */}
            {userRole === 'admin' && (
              <SidebarItem
                icon={<Home className="h-5 w-5" />}
                label="Dashboard"
                path="/dashboard"
                active={isActive("/dashboard")}
              />
            )}
            
            {/* Volunteer items */}
            {userRole === 'volunteer' && (
              <SidebarItem
                icon={<Home className="h-5 w-5" />}
                label="Volunteer Dashboard"
                path="/volunteer"
                active={isActive("/volunteer")}
              />
            )}
            
            {/* All users can report grievances */}
            <SidebarItem
              icon={<FileText className="h-5 w-5" />}
              label="Report Grievance"
              path="/report"
              active={isActive("/report")}
            />
            
            <SidebarItem
              icon={<AlertTriangle className="h-5 w-5" />}
              label="Track Grievance"
              path="/track"
              active={isActive("/track")}
            />
            
            <h3 className="my-2 px-4 text-xs font-medium text-muted-foreground">Emergency Services</h3>
            
            <SidebarItem
              icon={<Heart className="h-5 w-5 text-emergency-health" />}
              label="Health Emergency"
              path="/emergency/health"
              active={isActive("/emergency/health")}
            />
            
            <SidebarItem
              icon={<Droplet className="h-5 w-5 text-emergency-blood" />}
              label="Blood Donation"
              path="/emergency/blood"
              active={isActive("/emergency/blood")}
            />
            
            <SidebarItem
              icon={<Pizza className="h-5 w-5 text-emergency-food" />}
              label="Food Relief"
              path="/emergency/food"
              active={isActive("/emergency/food")}
            />
            
            <SidebarItem
              icon={<Shelter className="h-5 w-5 text-emergency-shelter" />}
              label="Shelter"
              path="/emergency/shelter"
              active={isActive("/emergency/shelter")}
            />
            
            {/* Admin and volunteer can see management section */}
            {(userRole === 'admin' || userRole === 'volunteer') && (
              <>
                <h3 className="my-2 px-4 text-xs font-medium text-muted-foreground">Management</h3>
                
                <SidebarItem
                  icon={<Users className="h-5 w-5" />}
                  label="Volunteers"
                  path="/volunteers"
                  active={isActive("/volunteers")}
                  badge={3}
                />
                
                {/* Only admin can see analytics */}
                {userRole === 'admin' && (
                  <SidebarItem
                    icon={<PieChart className="h-5 w-5" />}
                    label="Analytics"
                    path="/analytics"
                    active={isActive("/analytics")}
                  />
                )}
                
                <SidebarItem
                  icon={<Settings className="h-5 w-5" />}
                  label="Settings"
                  path="/settings"
                  active={isActive("/settings")}
                />
              </>
            )}
          </nav>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="glass-card rounded-lg p-3">
            <h3 className="text-sm font-medium">Need Help?</h3>
            <p className="text-xs text-muted-foreground">
              Get emergency assistance or volunteer support
            </p>
            <Button className="mt-2 w-full" size="sm">
              Emergency Contacts
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
