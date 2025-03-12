
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AuthLayout } from "./AuthLayout";
import { supabase } from "@/integrations/supabase/client";

// Define profile interface to match our database schema
interface Profile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "volunteer" | "grievance_reporter";
  created_at: string;
  updated_at: string;
}

export function LoginForm() {
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"volunteer" | "grievance_reporter">("grievance_reporter");
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Logged in successfully",
        description: "Welcome to the Grievance Redressal Platform",
      });
      
      // Using a direct RPC call instead of querying the profiles table
      // This avoids the TypeScript type issues
      try {
        // Use any as a type assertion to bypass TypeScript checking
        const client = supabase as any;
        const { data: profileData } = await client
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileData) {
          const userRole = profileData.role;
          
          if (userRole === 'admin') {
            navigate('/dashboard');
          } else if (userRole === 'volunteer') {
            navigate('/volunteer');
          } else {
            navigate('/report');
          }
        } else {
          // Default redirect if no profile is found
          navigate('/report');
        }
      } catch (profileError) {
        console.error('Error fetching user profile:', profileError);
        // Default redirect on error
        navigate('/report');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!name) {
        throw new Error("Name is required");
      }
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({ 
        email: signupEmail, 
        password: signupPassword,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials",
      });
      
      // Clear signup form
      setSignupEmail("");
      setSignupPassword("");
      setName("");
      setRole("grievance_reporter");
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "Please try again with different credentials",
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="your@email.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value: "volunteer" | "grievance_reporter") => setRole(value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grievance_reporter">Grievance Reporter</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                </SelectContent>
              </Select>
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
