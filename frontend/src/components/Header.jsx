import { Link, useLocation } from "react-router-dom";
import { Map, BarChart3, FileText, Bell, Settings, LayoutDashboard } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-[1000] bg-[#0a0a15]/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="flex items-center justify-between px-8 py-4 gap-6">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="animate-float group-hover:scale-110 transition-transform">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="8" fill="url(#gradient1)" />
              <path
                d="M20 10L30 15V25L20 30L10 25V15L20 10Z"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="20" r="3" fill="white" />
              <defs>
                <linearGradient id="gradient1" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              LandWatch
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Industrial Compliance Monitor
            </p>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="flex gap-2">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/")
              ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-[0_0_20px_rgba(102,126,234,0.3)]"
              : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to="/map"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive("/map")
              ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-[0_0_20px_rgba(102,126,234,0.3)]"
              : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
          >
            <Map className="w-5 h-5" />
            Map View
          </Link>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <BarChart3 className="w-5 h-5" />
            Analysis
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <FileText className="w-5 h-5" />
            Reports
          </button>
        </nav>

        {/* Header Actions */}
        <div className="flex gap-2">
          <button className="relative w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all hover:-translate-y-0.5 group">
            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center shadow-lg border-2 border-[#0a0a15] animate-pulse">
              3
            </span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all hover:-translate-y-0.5 group">
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </header>
  );
};


export default Header;

