
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

export function useAuth() {
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        redirectBasedOnRole();
      }
      setIsLoadingSession(false);
    };
    
    checkSession();
    
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        redirectBasedOnRole();
      }
    });
    
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);
  
  const redirectBasedOnRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }
    
    if (profile.role === 'admin') {
      navigate('/dashboard');
    } else if (profile.role === 'volunteer') {
      navigate('/volunteer');
    } else {
      navigate('/report');
    }
  };
  
  const handleLogin = async (email: string, password: string) => {
    let isLoading = true;
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Logged in successfully",
        description: "Welcome to the Grievance Redressal Platform",
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
      });
      throw error;
    } finally {
      isLoading = false;
    }
    
    return isLoading;
  };
  
  const handleSignup = async (signupEmail: string, signupPassword: string, signupRole: UserRole) => {
    let isLoading = true;
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: signupRole })
          .eq('id', data.user.id);
          
        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw new Error('Failed to set user role');
        }
      }
      
      toast({
        title: "Account created successfully",
        description: "You can now login with your credentials",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "Please try again with different credentials",
      });
      throw error;
    } finally {
      isLoading = false;
    }
    
    return isLoading;
  };
  
  return {
    isLoadingSession,
    handleLogin,
    handleSignup,
  };
}
