import React, { useState } from "react";
import { X, Save } from "lucide-react";

const BoundaryForm = ({
  onSubmit,
  onCancel,
  mode = "plot",
  initialData = {},
}) => {
  const [activeTab, setActiveTab] = useState("category"); // 'category' | 'plot'

  const [formData, setFormData] = useState({
    // Shared / Plot fields
    district: "",
    sector: "",
    industrialArea: "",
    plotType: "",
    plotNumber: "",
    status: "Available",
    // Boundary only fields
    boundaryType: "District",
    category: "",
    location: "",
    color: "",
    ...initialData, // Merge initial data (e.g. industrialArea from parent detection)
  });

  // Categories definition (Industrial Plot removed from here as it has its own tab)
  const CATEGORIES = [
    { id: "green", label: "Green Area", color: "#4ade80", border: "#15803d" }, // Green
    { id: "road", label: "Road", color: "#9ca3af", border: "#4b5563" }, // Grey
    { id: "water", label: "Water Body", color: "#60a5fa", border: "#2563eb" }, // Blue
    {
      id: "amenities",
      label: "Amenities",
      color: "#b45309",
      border: "#78350f",
    }, // Brown
    {
      id: "commercial",
      label: "Commercial",
      color: "#a855f7",
      border: "#7e22ce",
    }, // Purple
    {
      id: "residential",
      label: "Residential",
      color: "#fbbf24",
      border: "#d97706",
    }, // Yellow
    { id: "utility", label: "Utility", color: "#f87171", border: "#dc2626" }, // Light Red
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (cat) => {
    setFormData((prev) => ({
      ...prev,
      category: cat.label,
      color: cat.color,
      plotNumber: "", // Reset plot number for categories
    }));
  };

  // Update form data when Tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "plot") {
      // Default to Industrial Plot settings
      setFormData((prev) => ({
        ...prev,
        category: "Industrial Plot",
        color: "#15803d", // Default to Dark Green (Available)
        status: "Available",
      }));
    } else {
      // Reset for Category mode
      setFormData((prev) => ({
        ...prev,
        category: "",
        color: "",
        plotNumber: "",
      }));
    }
  };

  const handleStatusChange = (status) => {
    let newColor = "#15803d"; // Default Available (Dark Green)

    switch (status) {
      case "Available":
        newColor = "#15803d"; // Dark Green
        break;
      case "Allotted":
        newColor = "#dc2626"; // Red
        break;
      case "Unavailable":
        newColor = "#1e40af"; // Dark Blue
        break;
      default:
        newColor = "#15803d";
    }

    setFormData((prev) => ({
      ...prev,
      status: status,
      color: newColor,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isBoundary = mode === "boundary";

  return (
    <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1a1b26]/90 border border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {isBoundary ? "Boundary Information" : "Zone Assignment"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Tabs for Non-Boundary Mode */}
        {!isBoundary && (
          <div className="flex bg-white/5 p-1 rounded-xl mb-6">
            <button
              onClick={() => handleTabChange("category")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "category"
                  ? "bg-[#667eea] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Select Category
            </button>
            <button
              onClick={() => handleTabChange("plot")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "plot"
                  ? "bg-[#764ba2] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Industrial Plot
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isBoundary ? (
            /* Boundary Mode Fields */
            <>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1">
                  Boundary Type
                </label>
                <select
                  name="boundaryType"
                  value={formData.boundaryType}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all appearance-none [&>option]:bg-[#1a1b26]"
                >
                  <option value="District">District Boundary</option>
                  <option value="Sector">Sector Boundary</option>
                  <option value="Village">Village Boundary</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1">
                  Industrial Area Name
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                  placeholder="e.g. Tilda Industrial Park"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                  placeholder="e.g. Raipur"
                  required
                />
              </div>
            </>
          ) : activeTab === "category" ? (
            /* Category Tab */
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 ml-1">
                  Choose Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${
                        formData.category === cat.label
                          ? "bg-white/10 border-white/30 ring-1 ring-white/20"
                          : "bg-white/5 border-transparent hover:bg-white/10"
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-md shadow-sm border border-white/10"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-xs text-gray-300 font-medium">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1">
                  District Name
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                  placeholder="Raipur"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                  placeholder="e.g. Bartori"
                />
              </div>
            </>
          ) : (
            /* Plot Tab */
            <>
              {/* Context Info if parent detected */}
              {(initialData.district || initialData.industrialArea) && (
                <div className="flex flex-col gap-1 bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl mb-4">
                  <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Auto-detected Location
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {initialData.industrialArea && (
                      <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-200 border border-white/10">
                        🏭 {initialData.industrialArea}
                      </span>
                    )}
                    {initialData.district && (
                      <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-200 border border-white/10">
                        📍 {initialData.district}
                      </span>
                    )}
                    {initialData.sector && (
                      <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-200 border border-white/10">
                        🧩 {initialData.sector}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {!initialData.district && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 ml-1">
                      District
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                      placeholder="Raipur"
                      required
                    />
                  </div>
                )}
                {!initialData.sector && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 ml-1">
                      Sector
                    </label>
                    <input
                      type="text"
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                      placeholder="Sector 1"
                    />
                  </div>
                )}
              </div>

              {!initialData.industrialArea && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Industrial Area
                  </label>
                  <input
                    type="text"
                    name="industrialArea"
                    value={formData.industrialArea}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                    placeholder="e.g. Tilda"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Plot Type
                  </label>
                  <input
                    type="text"
                    name="plotType"
                    value={formData.plotType}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                    placeholder="Industrial Purpose"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Plot Number
                  </label>
                  <input
                    type="text"
                    name="plotNumber"
                    value={formData.plotNumber}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                    placeholder="101"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-medium text-gray-400 ml-1">
                  Allocation Status
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange("Available")}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                      formData.status === "Available"
                        ? "bg-[#15803d]/20 border-[#15803d] ring-1 ring-[#15803d]/50"
                        : "bg-white/5 border-transparent hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#15803d] shadow-[0_0_10px_#15803d]" />
                      <span
                        className={`text-sm font-medium ${formData.status === "Available" ? "text-white" : "text-gray-400"}`}
                      >
                        Available
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange("Allotted")}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                      formData.status === "Allotted"
                        ? "bg-[#dc2626]/20 border-[#dc2626] ring-1 ring-[#dc2626]/50"
                        : "bg-white/5 border-transparent hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#dc2626] shadow-[0_0_10px_#dc2626]" />
                      <span
                        className={`text-sm font-medium ${formData.status === "Allotted" ? "text-white" : "text-gray-400"}`}
                      >
                        Allocated
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange("Unavailable")}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                      formData.status === "Unavailable"
                        ? "bg-[#1e40af]/20 border-[#1e40af] ring-1 ring-[#1e40af]/50"
                        : "bg-white/5 border-transparent hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#1e40af] shadow-[0_0_10px_#1e40af]" />
                      <span
                        className={`text-sm font-medium ${formData.status === "Unavailable" ? "text-white" : "text-gray-400"}`}
                      >
                        Unavailable
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default BoundaryForm;
