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
        const { data: userRole, error: roleError } = await supabase
          .rpc('get_user_role', { user_id: data.user.id });
          
        if (roleError) {
          console.error('Error fetching user role:', roleError);
          navigate('/report');
          return;
        }
        
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
      if (!formData.name) {
        throw new Error("Name is required");
      }
      
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

  const createDemoUser = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email: "makeyourmark2023@gmail.com", 
        password: "123456",
        options: {
          data: {
            name: "Demo User",
            role: "reporter"
          }
        }
      });
      
      if (error) throw error;
      
      if (data?.user?.identities?.length === 0) {
        toast({
          title: "Demo user already exists",
          description: "You can now login with the demo credentials",
        });
        return;
      }
      
      toast({
        title: "Demo user created successfully",
        description: "Email: makeyourmark2023@gmail.com, Password: 123456",
      });
      
    } catch (error: any) {
      console.error('Demo user creation error:', error);
      toast({
        variant: "destructive",
        title: "Failed to create demo user",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    login,
    signup,
    createDemoUser,
  };
}
