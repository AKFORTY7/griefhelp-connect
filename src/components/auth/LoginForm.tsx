
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AuthLayout } from "./AuthLayout";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Here we would integrate with Supabase Auth
    // For now, simulating login logic
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock login logic
      if (email === 'admin@example.com' && password === 'password') {
        toast({
          title: "Logged in successfully",
          description: "Welcome to the Grievance Redressal Platform",
        });
        navigate('/dashboard');
      } else if (email === 'volunteer@example.com' && password === 'password') {
        toast({
          title: "Logged in successfully",
          description: "Welcome to the Grievance Redressal Platform",
        });
        navigate('/volunteer');
      } else if (email && password) {
        toast({
          title: "Logged in successfully",
          description: "Welcome to the Grievance Redressal Platform",
        });
        navigate('/report');
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Account created successfully",
        description: "You can now login with your credentials",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "Please try again with different credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout
      title="Grievance Connect"
      description="Login or create an account to report and track grievances during disasters."
    >
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>For demo purposes:</p>
              <p>Admin: admin@example.com / password</p>
              <p>Volunteer: volunteer@example.com / password</p>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={handleSignup} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select 
                id="role" 
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                defaultValue="reporter"
              >
                <option value="reporter">Grievance Reporter</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}
