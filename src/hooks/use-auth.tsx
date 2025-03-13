
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
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email)
        .single();
        
      if (existingUser) {
        toast({
          variant: "destructive",
          title: "User already exists",
          description: "Please login instead or use a different email address",
        });
        setIsLoading(false);
        return false;
      }
      
      // Create new user in auth
      const { data, error } = await supabase.auth.signUp({ 
        email: formData.email, 
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role // This is being cast to user_role enum in the database
          }
        }
      });
      
      if (error) throw error;
      
      // Check if user already exists in auth but not in profiles
      if (data?.user?.identities?.length === 0) {
        toast({
          title: "User already exists",
          description: "Please login instead or use a different email address",
          variant: "destructive"
        });
        return false;
      }
      
      // User created successfully
      console.log("User created successfully:", data.user);
      
      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials",
      });
      
      return true;
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Improved error handling for database-specific errors
      let errorMessage = error.message || "Please try again with different credentials";
      
      // Check for specific database errors
      if (error.message?.includes("user_role") || error.code === "42704") {
        errorMessage = "There's a database configuration issue. Please contact the administrator.";
        console.error('Database configuration error: The user_role enum might not exist');
      }
      
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createDemoUser = async () => {
    setIsLoading(true);
    const demoEmail = "makeyourmark2023@gmail.com";
    const demoPassword = "123456";
    
    try {
      // First check if user already exists by trying to login
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword
      });
      
      if (!loginError && loginData.user) {
        // User exists and we've successfully logged in
        toast({
          title: "Demo user logged in",
          description: "Successfully logged in with the demo account",
        });
        
        // Navigate based on user role
        try {
          const { data: userRole, error: roleError } = await supabase
            .rpc('get_user_role', { user_id: loginData.user.id });
            
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
        } catch (error) {
          console.error('Error determining role:', error);
          navigate('/report');
        }
        
        return;
      }
      
      // If login failed, try to create the user
      const { data, error } = await supabase.auth.signUp({ 
        email: demoEmail, 
        password: demoPassword,
        options: {
          data: {
            name: "Demo User",
            role: "reporter"
          }
        }
      });
      
      if (error) throw error;
      
      if (data?.user?.identities?.length === 0) {
        // User exists but password might be different
        toast({
          title: "Demo user exists",
          description: `The demo user account already exists. Try logging in with email: ${demoEmail}`,
        });
        return;
      }
      
      toast({
        title: "Demo user created",
        description: `Created and logged in as ${demoEmail}`,
      });
      
      // Auto-navigate to report page for demo users
      navigate('/report');
      
    } catch (error: any) {
      console.error('Demo user operation error:', error);
      toast({
        variant: "destructive",
        title: "Demo user operation failed",
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
