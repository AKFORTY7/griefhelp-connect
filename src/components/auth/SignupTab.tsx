
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database } from "@/integrations/supabase/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type UserRole = Database["public"]["Enums"]["user_role"];

interface SignupTabProps {
  onSignup: (email: string, password: string, role: UserRole) => Promise<boolean>;
}

export function SignupTab({ onSignup }: SignupTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [signupRole, setSignupRole] = useState<UserRole>("reporter");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (emailRef.current && passwordRef.current) {
      try {
        console.log("Submitting with role:", signupRole);
        await onSignup(
          emailRef.current.value,
          passwordRef.current.value,
          signupRole
        );
      } catch (error) {
        console.error("Form submission error:", error);
        // Error is already handled in the hook
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="your@email.com"
          ref={emailRef}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          ref={passwordRef}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select 
          value={signupRole} 
          onValueChange={(value) => setSignupRole(value as UserRole)}
        >
          <SelectTrigger id="role" className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reporter">Grievance Reporter</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
