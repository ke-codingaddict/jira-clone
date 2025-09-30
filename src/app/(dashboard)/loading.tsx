import { Loader } from "lucide-react";

const DashboardLoading = () => {
  return (
    <div className="h-screen flex items-center justify-center ">
      <Loader className="size-6 selection:animate-spin text-muted-foreground" />
    </div>
  );
};

export default DashboardLoading;
