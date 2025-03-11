
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database } from "@/integrations/supabase/types";

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
        <select 
          id="role" 
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={signupRole}
          onChange={(e) => setSignupRole(e.target.value as UserRole)}
        >
          <option value="reporter">Grievance Reporter</option>
          <option value="volunteer">Volunteer</option>
        </select>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
