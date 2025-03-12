
export interface Profile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "volunteer" | "reporter";
  created_at: string;
  updated_at: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  name: string;
  role: "volunteer" | "reporter";
}
