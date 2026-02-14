import { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import SatelliteMap from "../components/SatelliteMap";
import AnalysisModal from "../components/AnalysisModal";

const MapPage = () => {
    const mapRef = useRef(null);
    const [stats, setStats] = useState({
        area: 0,
        perimeter: 0,
        imageCount: 0,
        status: "Ready",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setStats({
            area: 0,
            perimeter: 0,
            imageCount: 0,
            status: "Ready",
        });
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

    const handleHighlightPlot = (config) => {
        if (mapRef.current?.highlightPlot) {
            mapRef.current.highlightPlot(config);
        }
    };

    return (
        <div className="flex-1 grid grid-cols-[380px_1fr] h-[calc(100vh-73px)]">
            {/* Sidebar */}
            <Sidebar
                onLoadImagery={handleLoadImagery}
                onAnalyzeChanges={handleAnalyzeChanges}
                onClearDrawing={handleClearDrawing}
                onDrawBoundary={handleDrawBoundary}
                onDrawPolygon={handleDrawPolygon}
                onDrawRectangle={handleDrawRectangle}
                onSearch={handleSearch}
                onHighlightPlot={handleHighlightPlot}
                onShowDetails={() => setIsModalOpen(true)}
                stats={stats}
            />

            {/* Map Section */}
            <section className="relative h-full overflow-hidden">
                <SatelliteMap ref={mapRef} onStatsUpdate={setStats} />
            </section>

            {/* Details Modal */}
            <AnalysisModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={stats.analysis}
            />
        </div>
    );
}

export default MapPage;
