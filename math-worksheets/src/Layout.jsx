import { Link, Outlet, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Upload, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import logoImage from "@/assets/logo.png";

export default function Layout() {
  const location = useLocation();
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-secondary-dark/30">
      <style>{`
        :root {
          --primary: #613613;
          --primary-dark: #4A290E;
          --secondary: #FFDF5B;
          --secondary-dark: #EEC847;
          --neutral: #1F1F1F;
          --surface: #FFF8E1;
        }
      `}</style>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <img
                src={logoImage}
                alt="Scotch Egg"
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="sr-only">Math Worksheets Home</span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link 
                to={createPageUrl("About")} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === createPageUrl("About")
                    ? "bg-brand-secondary text-brand-primary-dark font-medium"
                    : "text-gray-600 hover:text-brand-primary hover:bg-brand-secondary/40"
                }`}
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </Link>
              
              {user?.role === 'admin' && (
                <Link 
                  to={createPageUrl("Upload")} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === createPageUrl("Upload")
                      ? "bg-brand-secondary-dark text-brand-primary-dark font-medium"
                      : "text-gray-600 hover:text-brand-primary hover:bg-brand-secondary/40"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Free math worksheets for students everywhere
            </p>
            <p className="text-sm text-gray-500">
              Free forever • Every download helps us improve
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
