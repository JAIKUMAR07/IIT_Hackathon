import { useState } from "react";
import { Map, BarChart3, FileText, Bell, Settings } from "lucide-react";

const Header = () => {
  const [activeView, setActiveView] = useState("map");

  return (
    <header className="sticky top-0 z-1000 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="flex items-center justify-between px-8 py-4 gap-6">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="animate-float">
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
            <h1 className="text-2xl font-bold bg-linear-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              LandWatch
            </h1>
            <p className="text-xs text-gray-400">
              Industrial Compliance Monitor
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex gap-2">
          <button
            onClick={() => setActiveView("map")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === "map"
                ? "bg-linear-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Map className="w-5 h-5" />
            Map View
          </button>
          <button
            onClick={() => setActiveView("analysis")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === "analysis"
                ? "bg-linear-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analysis
          </button>
          <button
            onClick={() => setActiveView("reports")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === "reports"
                ? "bg-linear-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <FileText className="w-5 h-5" />
            Reports
          </button>
        </nav>

        {/* Header Actions */}
        <div className="flex gap-2">
          <button className="relative w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all hover:-translate-y-0.5">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-semibold flex items-center justify-center animate-pulse">
              3
            </span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all hover:-translate-y-0.5">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
