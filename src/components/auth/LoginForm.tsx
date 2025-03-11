
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthLayout } from "./AuthLayout";
import { LoginTab } from "./LoginTab";
import { SignupTab } from "./SignupTab";
import { LoadingState } from "./LoadingState";

export function LoginForm() {
  const { isLoadingSession, handleLogin, handleSignup } = useAuth();
  
  if (isLoadingSession) {
    return <LoadingState />;
  }
  
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
          <LoginTab onLogin={handleLogin} />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupTab onSignup={handleSignup} />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}
