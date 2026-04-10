import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';

export default function NotAuthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <ShieldX className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
      <Button onClick={() => navigate('/')} className="gradient-primary text-primary-foreground">
        Back to Login
      </Button>
    </div>
  );
}
