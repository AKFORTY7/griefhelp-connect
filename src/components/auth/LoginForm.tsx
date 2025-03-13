
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthLayout } from "./AuthLayout";
import { LoginTab } from "./LoginTab";
import { SignupTab } from "./SignupTab";
import { useAuth } from "@/hooks/use-auth";
import { LoginFormData, SignupFormData } from "@/types/auth";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const { isLoading, login, signup, createDemoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const handleLogin = async (data: LoginFormData) => {
    await login(data);
  };
  
  const handleSignup = async (data: SignupFormData) => {
    const success = await signup(data);
    // Reset form and switch to login tab on successful signup
    if (success) {
      setActiveTab("login");
    }
  };
  
  const handleCreateDemoUser = async () => {
    await createDemoUser();
  };
  
  return (
    <AuthLayout
      title="Grievance Connect"
      description="Login or create an account to report and track grievances during disasters."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginTab onLogin={handleLogin} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupTab onSignup={handleSignup} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Button 
          onClick={handleCreateDemoUser} 
          variant="secondary" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Quick Access: Create & Login as Demo User"}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Email: makeyourmark2023@gmail.com | Password: 123456
        </p>
      </div>
    </AuthLayout>
  );
}
