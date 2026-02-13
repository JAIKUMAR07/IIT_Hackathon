import { useState, useEffect, useRef } from "react";
import {
  Search,
  Edit3,
  Square,
  Trash2,
  RefreshCw,
  Scan,
  MapPin,
} from "lucide-react";

const Sidebar = ({
  onLoadImagery,
  onAnalyzeChanges,
  onClearDrawing,
  onDrawBoundary,
  onDrawPolygon,
  onDrawRectangle,
  onSearch,
  onHighlightPlot,
  onShowDetails,
  stats,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleSearch = (query = searchQuery) => {
    if (query.trim() && onSearch) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.length > 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              value,
            )}&limit=5&addressdetails=1`,
          );
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const name = suggestion.display_name;
    setSearchQuery(name.split(",")[0]);
    // Optimization: Pass full suggestion object to avoid re-fetching
    if (onSearch) {
      onSearch(suggestion);
    }
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <aside className="w-full h-full bg-white/5 backdrop-blur-md border-r border-white/10 overflow-y-auto">
      <div className="p-8">
        <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          Map Controls
        </h2>

        {/* Location Search */}
        <div className="mb-6 relative">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <Search className="w-4 h-4 text-[#667eea]" />
            Search Location
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition-all"
              placeholder="Place name, Lat, Lng or Lat,Lng"
            />
            <button
              onClick={() => handleSearch()}
              className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg text-white hover:shadow-lg hover:shadow-[#667eea]/50 transition-all hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a15] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#667eea] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {item.display_name.split(",")[0]}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {item.display_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawing Tools */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <Edit3 className="w-4 h-4 text-[#667eea]" />
            Drawing Tools
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onDrawBoundary}
              className="flex flex-col items-center gap-2 px-3 py-4 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs font-medium hover:bg-white/10 hover:border-[#667eea] hover:text-white transition-all hover:-translate-y-0.5"
            >
              <Scan className="w-5 h-5 text-red-500" />
              Industry Boundary
            </button>
            <button
              onClick={onDrawPolygon}
              className="flex flex-col items-center gap-2 px-3 py-4 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs font-medium hover:bg-white/10 hover:border-[#667eea] hover:text-white transition-all hover:-translate-y-0.5"
            >
              <Edit3 className="w-5 h-5 text-blue-500" />
              Draw Plot
            </button>
            <button
              onClick={onDrawRectangle}
              className="flex flex-col items-center gap-2 px-3 py-4 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs font-medium hover:bg-white/10 hover:border-[#667eea] hover:text-white transition-all hover:-translate-y-0.5"
            >
              <Square className="w-5 h-5 text-blue-500" />
              Rect Plot
            </button>
            <button
              onClick={onClearDrawing}
              className="flex flex-col items-center gap-2 px-3 py-4 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs font-medium hover:bg-white/10 hover:border-[#667eea] hover:text-white transition-all hover:-translate-y-0.5"
            >
              <Trash2 className="w-5 h-5 text-gray-400" />
              Clear All
            </button>
          </div>
        </div>

        {/* Plot Selection */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Select Plot
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                onHighlightPlot({
                  filename: e.target.value,
                  label: e.target.options[e.target.selectedIndex].text,
                  color: "#00ffff",
                  isComparison: false,
                });
              }
            }}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#0a0a15]">Choose a Plot...</option>
            <option value="/plot.json" className="bg-[#0a0a15]">Plot 1 (Primary)</option>
            <option value="/plot2.json" className="bg-[#0a0a15]">Plot 2 (Secondary)</option>
          </select>
        </div>

        {/* Comparison Selection */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <RefreshCw className="w-4 h-4 text-orange-400" />
            Comparison Data
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                onHighlightPlot({
                  filename: e.target.value,
                  label: e.target.options[e.target.selectedIndex].text,
                  color: "#ff8c00", // Orange for comparison
                  isComparison: true,
                });
              }
            }}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-orange-400 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#0a0a15]">Select Comparison...</option>
            <option value="/comparison.json" className="bg-[#0a0a15]">Comparison 1</option>
            <option value="/comparison3.json" className="bg-[#0a0a15]">Comparison 2</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mb-6">
          <button
            onClick={onLoadImagery}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:shadow-[#667eea]/50 transition-all hover:-translate-y-0.5"
          >
            <RefreshCw className="w-4 h-4" />
            Load Imagery
          </button>
          <button
            onClick={onAnalyzeChanges}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5"
          >
            <Scan className="w-4 h-4" />
            Analyze Changes
          </button>
        </div>

        {/* Analysis Summary */}
        {stats.analysis && (
          <div className="mb-6 p-4 bg-gradient-to-br from-[#ff00ff]/10 to-transparent border border-[#ff00ff]/30 rounded-xl">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-white">
              <RefreshCw className="w-4 h-4 text-[#ff00ff] animate-spin-slow" />
              Spatial Analysis
            </h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Similarity:</span>
                <span className="text-[#43e97b] font-bold">{stats.analysis.matchPercentage}%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Deviation:</span>
                <span className="text-orange-400 font-bold">{stats.analysis.lostArea} ha</span>
              </div>
            </div>
            <button
              onClick={onShowDetails}
              className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white text-xs font-bold transition-all active:scale-95"
            >
              View Full Details
            </button>
          </div>
        )}

        {/* Statistics Panel */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <h3 className="text-base font-semibold mb-4 text-white">
            Current Selection
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-300">Area:</span>
              <span className="text-sm font-semibold text-white">
                {stats.area} ha
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-300">Perimeter:</span>
              <span className="text-sm font-semibold text-white">
                {stats.perimeter} m
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-300">Images Found:</span>
              <span className="text-sm font-semibold text-white">
                {stats.imageCount}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-300">Status:</span>
              <span className="text-sm font-semibold text-[#43e97b]">
                {stats.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
