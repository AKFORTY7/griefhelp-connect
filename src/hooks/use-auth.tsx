
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
        // Use rpc to get profile data bypassing TypeScript issues
        const { data: profileData, error: profileError } = await supabase
          .rpc('get_profile_by_id', { user_id: data.user.id });
          
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          navigate('/report'); // Default redirect
          return;
        }
        
        if (profileData) {
          const userRole = profileData.role;
          
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
      
      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials",
      });
      
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

  return {
    isLoading,
    login,
    signup,
  };
}
