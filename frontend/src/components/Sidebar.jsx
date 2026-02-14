import { useState, useEffect, useRef } from "react";
import {
  Search,
  Edit3,
  Square,
  Trash2,
  RefreshCw,
  Scan,
  MapPin,
  Upload,
  FileText,
  CheckCircle2,
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
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
    setCurrentStep(2); // Move to upload step
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload and AI processing
      setTimeout(() => {
        setIsUploading(false);
        setCurrentStep(3);
        if (onLoadImagery) onLoadImagery();
      }, 2000);
    }
  };

  const steps = [
    { id: 1, title: "Select Region", icon: MapPin },
    { id: 2, title: "Upload Image", icon: Upload },
    { id: 3, title: "AI Detection", icon: Scan },
    { id: 4, title: "Comparison", icon: RefreshCw },
    { id: 5, title: "Report", icon: FileText },
  ];

  return (
    <aside className="w-full h-full bg-white/5 backdrop-blur-md border-r border-white/10 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Compliance Monitor
          </h2>
          <div className="flex gap-1">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStep >= s.id ? "bg-[#667eea]" : "bg-white/10"
                  } ${currentStep === s.id ? "ring-4 ring-[#667eea]/20 scale-125" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Workflow Guide */}
        <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Workflow Progress</p>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -z-10" />
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = currentStep === s.id;
              const isCompleted = currentStep > s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 group cursor-help" title={s.title}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? "bg-[#667eea] text-white shadow-lg shadow-[#667eea]/40 scale-110" :
                    isCompleted ? "bg-[#43e97b]/20 text-[#43e97b]" : "bg-white/5 text-gray-500"
                    }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
              Step {currentStep}: {steps[currentStep - 1].title}
            </p>
          </div>
        </div>

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

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-bold transition-all hover:-translate-y-1 ${isUploading
              ? "bg-white/5 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-xl shadow-[#667eea]/30"
              }`}
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                AI Processing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Satellite Image
              </>
            )}
          </button>

          <button
            onClick={() => {
              onAnalyzeChanges();
              setCurrentStep(4);
            }}
            disabled={currentStep < 3}
            className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-bold border transition-all ${currentStep < 3
              ? "bg-white/5 border-white/5 text-gray-600 cursor-not-allowed"
              : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/30 hover:-translate-y-1"
              }`}
          >
            <Scan className="w-5 h-5" />
            Run Compliance Check
          </button>
        </div>

        {/* Plot Selection */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Industrial Region
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                onHighlightPlot({
                  filename: e.target.value,
                  label: e.target.options[e.target.selectedIndex].text,
                  color: "#00ffff",
                  isComparison: false,
                  autoAnalyze: true,
                });
                if (currentStep < 2) setCurrentStep(2);
              }
            }}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-all appearance-none cursor-pointer hover:bg-white/10"
          >
            <option value="" className="bg-[#0a0a15]">Choose a Region...</option>
            <option value="/plot.json" className="bg-[#0a0a15]">TILDA INDUSTRIAL PARK</option>
            <option value="/plot2.json" className="bg-[#0a0a15]">BARTORI SECTOR</option>
          </select>
        </div>

        {/* Comparison Selection */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <RefreshCw className="w-4 h-4 text-orange-400" />
            Comparison (Reference Map)
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
                setCurrentStep(4);
              }
            }}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-400 transition-all appearance-none cursor-pointer hover:bg-white/10"
          >
            <option value="" className="bg-[#0a0a15]">Select Allotment Data...</option>
            <option value="/comparison.json" className="bg-[#0a0a15]">Allotment_Ref_2023</option>
            <option value="/comparison3.json" className="bg-[#0a0a15]">CSIDC_Base_Map_V2</option>
          </select>
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
              onClick={() => {
                onShowDetails();
                setCurrentStep(5);
              }}
              className="w-full py-3 bg-gradient-to-r from-[#ff00ff] to-[#7000ff] hover:shadow-lg hover:shadow-[#ff00ff]/40 rounded-xl text-white text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate Compliance Report
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
