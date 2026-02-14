import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import MapPage from "./pages/MapPage";
import "./App.css";

function App() {
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

      {/* Routes */}
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

