import { Heart, Menu, AlertTriangle, Phone, Settings, LogOut } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { useState } from "react";
import { AdminLogin } from "./admin-login";
import { AdminDashboard } from "./admin-dashboard";
import { Button } from "./ui/button";

export default function Header() {
  const { isAdmin, login } = useAdmin();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      login(false);
      setShowAdminDashboard(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      {/* Crisis Banner */}
      <div className="bg-destructive text-destructive-foreground py-2 px-4 text-center">
        <div className="container mx-auto">
          <p className="text-sm font-medium flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Crisis Support: Call 988 (Suicide Crisis Lifeline) | Text "HOME" to 741741 (Crisis Text Line)
          </p>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">HealingHearts</h1>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <a 
              href="#faq" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-faq"
            >
              FAQ
            </a>
            {isAdmin && (
              <a 
                href="#blog" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-blog"
              >
                Blog
              </a>
            )}
            <a 
              href="#games" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-games"
            >
              Games
            </a>
            <a 
              href="#quizzes" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-quizzes"
            >
              Quizzes
            </a>
            <a 
              href="#quotes" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-quotes"
            >
              Quotes
            </a>
            <a 
              href="#chat" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-chat"
            >
              Chat
            </a>
            <a 
              href="#resources" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-resources"
            >
              Resources
            </a>
          </div>

          <div className="flex items-center space-x-2">
            {isAdmin ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdminDashboard(true)}
                  className="hidden md:flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdminLogin(true)}
                className="hidden md:flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            )}
            
            <button className="md:hidden text-foreground" data-testid="button-menu">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={(success) => {
            login(success);
            setShowAdminLogin(false);
            if (success) {
              setShowAdminDashboard(true);
            }
          }}
        />
      )}

      {showAdminDashboard && isAdmin && (
        <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
      )}
    </header>
  );
}
