import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/app/dashboard/layout";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");

  const handleSendCredentials = () => {
    if (!email.trim()) {
      toast.error("Please enter a Gmail address");
      return;
    }
    if (!email.toLowerCase().includes("@gmail.com")) {
      toast.error("Please enter a valid Gmail address");
      return;
    }

    // Demo-only behavior: app has no backend mail service.
    toast.success(`Credentials sent to ${email}`, {
      description: `User ID: ${user?.id ?? "N/A"} | Password: sports@123`,
    });
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "staff", "student"]}>
      <DashboardLayout>
        <div className="max-w-xl rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-lg space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account credentials and notification email.</p>
          </div>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Full Name</p>
              <p className="text-lg font-medium">{user?.name ?? "-"}</p>
            </div>
            


            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Gmail Address
              </label>
              <Input
                type="email"
                placeholder="Enter your Gmail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-md h-11"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                We'll send your recovery password and login User ID to this address.
              </p>
            </div>
          </div>

          <Button 
            onClick={handleSendCredentials}
            className="w-full sm:w-auto px-8 h-11 font-semibold shadow-md active:scale-95 transition-transform"
          >
            Send Credentials to Gmail
          </Button>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
