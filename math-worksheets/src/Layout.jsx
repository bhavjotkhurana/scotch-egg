import { Link, Outlet, useLocation } from 'react-router-dom';
import logoImage from '@/assets/logo.png';

const NAV_LINKS = [
  { to: '/', label: 'Practice', match: ['/', '/practice'] },
  { to: '/about', label: 'About' },
];

export default function Layout() {
  const location = useLocation();

  function isActive(link) {
    const prefixes = link.match ?? [link.to];
    return prefixes.some((p) => {
      if (p === '/') return location.pathname === '/';
      return location.pathname === p || location.pathname.startsWith(`${p}/`);
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-secondary-dark/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logoImage}
                alt="Scotch Egg"
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="sr-only">Scotch Egg Home</span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    isActive(link)
                      ? 'bg-brand-secondary text-brand-primary-dark font-medium'
                      : 'text-gray-600 hover:text-brand-primary hover:bg-brand-secondary/40'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/book"
                className="ml-1 rounded-lg bg-brand-primary px-3 py-2 text-sm font-medium text-white hover:bg-brand-primary-dark"
              >
                Book
              </Link>
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
            <p className="text-gray-600 mb-2">Private math &amp; stats tutoring by Bhav Khurana</p>
            <p className="text-sm text-gray-500">
              <a href="mailto:bhavjotskhurana@gmail.com" className="hover:text-brand-primary">
                bhavjotskhurana@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
