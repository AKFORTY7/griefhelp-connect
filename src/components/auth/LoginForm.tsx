
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthLayout } from "./AuthLayout";
import { LoginTab } from "./LoginTab";
import { SignupTab } from "./SignupTab";
import { useAuth } from "@/hooks/use-auth";
import { LoginFormData, SignupFormData } from "@/types/auth";

export function LoginForm() {
  const { isLoading, login, signup } = useAuth();
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
    </AuthLayout>
  );
}
