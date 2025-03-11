
import { AuthLayout } from "./AuthLayout";

export function LoadingState() {
  return (
    <AuthLayout
      title="Grievance Connect"
      description="Loading..."
    >
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </AuthLayout>
  );
}
