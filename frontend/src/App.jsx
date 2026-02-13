import { useState, useRef } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SatelliteMap from "./components/SatelliteMap";
import "./App.css";

function App() {
  const mapRef = useRef(null);
  const [stats, setStats] = useState({
    area: 0,
    perimeter: 0,
    imageCount: 0,
    status: "Ready",
  });

  const handleLoadImagery = () => {
    console.log("Loading imagery...");
    if (mapRef.current?.loadImagery) {
      mapRef.current.loadImagery();
    }
  };

  const handleAnalyzeChanges = () => {
    console.log("Analyzing changes...");
    if (mapRef.current?.analyzeChanges) {
      mapRef.current.analyzeChanges();
    }
  };

  const handleClearDrawing = () => {
    console.log("Clearing drawings...");
    if (mapRef.current?.clearDrawings) {
      mapRef.current.clearDrawings();
    }
  };

  const handleDrawBoundary = () => {
    if (mapRef.current?.startBoundaryDraw) {
      mapRef.current.startBoundaryDraw();
    }
  };

  const handleDrawPolygon = () => {
    if (mapRef.current?.startPolygonDraw) {
      mapRef.current.startPolygonDraw();
    }
  };

  const handleDrawRectangle = () => {
    if (mapRef.current?.startRectangleDraw) {
      mapRef.current.startRectangleDraw();
    }
  };

  const handleSearch = (query) => {
    if (mapRef.current?.performSearch) {
      mapRef.current.performSearch(query);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a15] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-[#667eea]/15 via-transparent to-transparent animate-gradient-shift" />
        <div className="absolute inset-0 bg-gradient-radial from-[#764ba2]/15 via-transparent to-transparent animate-gradient-shift-delayed" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[50px_50px] animate-grid-move" />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="grid grid-cols-[380px_1fr] h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar
          onLoadImagery={handleLoadImagery}
          onAnalyzeChanges={handleAnalyzeChanges}
          onClearDrawing={handleClearDrawing}
          onDrawBoundary={handleDrawBoundary}
          onDrawPolygon={handleDrawPolygon}
          onDrawRectangle={handleDrawRectangle}
          onSearch={handleSearch}
          stats={stats}
        />

        {/* Map Section */}
        <section className="relative h-full overflow-hidden">
          <SatelliteMap ref={mapRef} onStatsUpdate={setStats} />
        </section>
      </main>
    </div>
  );
}

export default App;
