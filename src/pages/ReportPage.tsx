
import { AppLayout } from "@/components/layout/AppLayout";
import { GrievanceForm } from "@/components/grievance/GrievanceForm";

const ReportPage = () => {
  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Report a Grievance</h2>
          <p className="text-muted-foreground">
            Use this form to report any disaster-related grievance. Your report will be processed immediately.
          </p>
        </div>
        
        <GrievanceForm />
      </div>
    </AppLayout>
  );
};

export default ReportPage;
