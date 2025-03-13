
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile, LoginFormData, SignupFormData } from "@/types/auth";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (formData: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      
      if (error) throw error;
      
      toast({
        title: "Logged in successfully",
        description: "Welcome to the Grievance Redressal Platform",
      });
      
      try {
        // Use get_user_role function which returns the role directly
        const { data: userRole, error: roleError } = await supabase
          .rpc('get_user_role', { user_id: data.user.id });
          
        if (roleError) {
          console.error('Error fetching user role:', roleError);
          navigate('/report'); // Default redirect
          return;
        }
        
        // userRole is directly the role string
        switch (userRole) {
          case 'admin':
            navigate('/dashboard');
            break;
          case 'volunteer':
            navigate('/volunteer');
            break;
          default:
            navigate('/report');
        }
        
      } catch (roleError) {
        console.error('Error fetching user role:', roleError);
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

  const signup = async (formData: SignupFormData) => {
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!formData.name) {
        throw new Error("Name is required");
      }
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({ 
        email: formData.email, 
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role
          }
        }
      });
      
      if (error) throw error;
      
      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        toast({
          title: "User already exists",
          description: "Please login instead or use a different email address",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials",
      });
      
      // After successful signup, switch to login view
      return true;
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "Please try again with different credentials",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    login,
    signup,
  };
}
