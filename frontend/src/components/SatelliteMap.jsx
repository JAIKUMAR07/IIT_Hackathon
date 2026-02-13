import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import BoundaryForm from "./BoundaryForm";

const SatelliteMap = forwardRef(({ onStatsUpdate }, ref) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const drawnItemsRef = useRef(null);
  const currentLayerRef = useRef(null);
  const searchMarkerRef = useRef(null);

  const [selectedBoundary, setSelectedBoundary] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 28.6139, lng: 77.209 });
  const [zoom, setZoom] = useState(12);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [pendingLayer, setPendingLayer] = useState(null);
  const [drawMode, setDrawMode] = useState('plot'); // 'boundary' or 'plot'

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapRef.current, {
      center: [28.6139, 77.209],
      zoom: 12,
      minZoom: 3,
      maxZoom: 21,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
    });

    mapInstanceRef.current = map;

    // Add satellite layers
    const googleSatellite = L.tileLayer(
      "https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      {
        attribution: "&copy; Google Maps",
        maxZoom: 21,
        maxNativeZoom: 21,
        subdomains: ["0", "1", "2", "3"],
        id: "google-satellite",
      },
    ).addTo(map);

    const googleSatellitePure = L.tileLayer(
      "https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      {
        attribution: "&copy; Google Maps",
        maxZoom: 21,
        maxNativeZoom: 21,
        subdomains: ["0", "1", "2", "3"],
        id: "google-satellite-pure",
      },
    );

    const esriSatellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        maxZoom: 21,
        maxNativeZoom: 19,
        id: "esri-satellite",
      },
    );

    // Google Streets layer (High Res)
    const googleStreets = L.tileLayer(
      "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      {
        attribution: "&copy; Google Maps",
        maxZoom: 21,
        maxNativeZoom: 21,
        subdomains: ["0", "1", "2", "3"],
        id: "google-streets",
      },
    );

    const labelsOverlay = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "",
        maxZoom: 21,
        maxNativeZoom: 18,
        opacity: 0.9,
        id: "labels",
      },
    );

    // Layer control
    const baseLayers = {
      "🏆 Google Satellite (Hybrid)": googleSatellite,
      "🛰️ Google Satellite (Pure)": googleSatellitePure,
      "🛰️ ESRI Satellite": esriSatellite,
      "🗺️ Google Streets (High Res)": googleStreets,
    };

    const overlayLayers = {
      "🏷️ Place Labels": labelsOverlay,
    };

    L.control
      .layers(baseLayers, overlayLayers, {
        position: "topright",
        collapsed: false,
      })
      .addTo(map);

    // Initialize drawing layer
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    // Add draw controls
    const drawControl = new L.Control.Draw({
      position: "topright",
      draw: {
        polyline: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: "#667eea",
            weight: 3,
            fillOpacity: 0.2,
          },
        },
        rectangle: {
          shapeOptions: {
            color: "#667eea",
            weight: 3,
            fillOpacity: 0.2,
          },
        },
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });
    map.addControl(drawControl);

    // Map event listeners
    map.on("mousemove", (e) => {
      setCoordinates({
        lat: e.latlng.lat.toFixed(7),
        lng: e.latlng.lng.toFixed(7),
      });
    });

    map.on("zoomend", () => {
      setZoom(map.getZoom());
    });

    map.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;

      // If rectangle tool was used, we still treat it as the current drawMode (usually plot)
      // but if we want specifically to allow user to toggle, we'll use drawMode state.

      map.addLayer(layer);
      setPendingLayer(layer);
      setShowForm(true);
      calculateStatistics(layer);
    });

    map.on(L.Draw.Event.DELETED, () => {
      setSelectedBoundary(null);
      setStats({ area: 0, perimeter: 0, imageCount: 0, status: "Ready" });
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Calculate statistics
  const calculateStatistics = (layer) => {
    if (!layer) return;

    const latlngs = layer.getLatLngs()[0];
    let area = 0;
    let perimeter = 0;

    // Calculate area using geodesic formula
    area = L.GeometryUtil.geodesicArea(latlngs);

    // Calculate perimeter
    for (let i = 0; i < latlngs.length; i++) {
      const p1 = latlngs[i];
      const p2 = latlngs[(i + 1) % latlngs.length];
      perimeter += mapInstanceRef.current.distance(p1, p2);
    }

    const newStats = {
      area: (area / 10000).toFixed(2), // Convert to hectares
      perimeter: perimeter.toFixed(2),
      imageCount: Math.floor(Math.random() * 20) + 5,
      status: "Ready",
    };

    if (onStatsUpdate) {
      onStatsUpdate(newStats);
    }
  };

  const handleFormSubmit = (data) => {
    if (!pendingLayer || !drawnItemsRef.current) return;

    const { status, category, district, location, plotType, plotNumber, industrialArea, sector } = data;

    let color = '#667eea';
    let fillColor = '#667eea';
    let dashArray = null;
    let weight = 2;
    let fillOpacity = 0.4;

    if (drawMode === 'boundary') {
      color = '#ef4444'; // Red for boundary
      fillColor = 'transparent';
      dashArray = '5, 10'; // Dashed line
      weight = 3;
      fillOpacity = 0;
    } else {
      if (status === 'Available') {
        color = '#22c55e';
        fillColor = '#4ade80';
      } else if (status === 'Allotted') {
        color = '#ef4444';
        fillColor = '#f87171';
      } else if (status === 'Unavailable') {
        color = '#3b82f6';
        fillColor = '#60a5fa';
      }
    }

    pendingLayer.setStyle({
      color: color,
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      weight: weight,
      dashArray: dashArray
    });

    let popupContent = '';

    if (drawMode === 'boundary') {
      popupContent = `
        <div style="font-family: 'Inter', sans-serif; min-width: 250px; padding: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #ef4444; padding-bottom: 8px;">
             <h3 style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
               <span style="font-size: 18px;">🏢</span> Amenity Information
             </h3>
             <span style="cursor: pointer; font-size: 18px; color: #9ca3af;" onclick="this.closest('.leaflet-popup').remove()">&times;</span>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Category</td>
              <td style="padding: 8px 0; color: #1f2937; text-align: right; font-weight: 600;">${category || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">District Name</td>
              <td style="padding: 8px 0; color: #1f2937; text-align: right; font-weight: 600;">${district || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Location</td>
              <td style="padding: 8px 0; color: #1f2937; text-align: right; font-weight: 600;">${location || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Plot Type</td>
              <td style="padding: 8px 0; color: #1f2937; text-align: right; font-weight: 600;">${plotType || 'N/A'}</td>
            </tr>
          </table>

          <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #f3f4f6; display: flex; align-items: center; gap: 8px; color: #ef4444;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span style="font-size: 12px; font-weight: 600;">Location</span>
            <span style="font-size: 12px; color: #6b7280; margin-left: auto;">${coordinates.lat}°N, ${coordinates.lng}°E</span>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
            <button style="background: #3b82f6; color: white; border: none; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              <span>🗺️</span> View on Map
            </button>
            <button style="background: #10b981; color: white; border: none; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              <span>⤴️</span> Get Directions
            </button>
          </div>
        </div>
      `;
    } else {
      popupContent = `
        <div style="font-family: 'Inter', sans-serif; min-width: 250px; padding: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
             <h3 style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
               <span style="font-size: 18px;">🏭</span> Industrial Plot Information
             </h3>
             <span style="cursor: pointer; font-size: 18px; color: #9ca3af;" onclick="this.closest('.leaflet-popup').remove()">&times;</span>
          </div>
          
          <div style="max-height: 200px; overflow-y: auto; margin-right: -5px; padding-right: 5px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">District</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: right; font-weight: 600;">${district || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Sector</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: right; font-weight: 600;">${sector || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Industrial Area</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: right; font-weight: 600;">${industrialArea || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Plot Type</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: right; font-weight: 600;">${plotType || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Plot Number</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: right; font-weight: 600;">${plotNumber || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Status</td>
                <td style="padding: 8px 0; text-align: right;">
                  <span style="font-size: 11px; padding: 4px 10px; border-radius: 4px; background: ${color}20; color: ${color}; border: 1px solid ${color}; font-weight: 800; text-transform: uppercase;">
                    ${status}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #f3f4f6; display: flex; align-items: center; gap: 8px; color: #2563eb;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span style="font-size: 12px; font-weight: 600;">Location</span>
            <span style="font-size: 12px; color: #6b7280; margin-left: auto;">${coordinates.lat}°N, ${coordinates.lng}°E</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
            <button style="background: #3b82f6; color: white; border: none; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              <span>🗺️</span> View on Map
            </button>
            <button style="background: #10b981; color: white; border: none; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              <span>⤴️</span> Get Directions
            </button>
          </div>
        </div>
      `;
    }

    pendingLayer.bindPopup(popupContent, { maxWidth: 300, className: 'custom-popup' });


    // Add to feature group
    drawnItemsRef.current.addLayer(pendingLayer);

    // Reset state
    setShowForm(false);
    setPendingLayer(null);
    setSelectedBoundary(pendingLayer);
  };

  const handleFormCancel = () => {
    if (pendingLayer && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(pendingLayer);
    }
    setShowForm(false);
    setPendingLayer(null);
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    startBoundaryDraw: () => {
      setDrawMode('boundary');
      if (mapInstanceRef.current) {
        new L.Draw.Polygon(mapInstanceRef.current, {
          shapeOptions: {
            color: "#ef4444",
            weight: 3,
            fillOpacity: 0,
            dashArray: '5, 10'
          },
        }).enable();
      }
    },
    startPolygonDraw: () => {
      setDrawMode('plot');
      if (mapInstanceRef.current) {
        new L.Draw.Polygon(mapInstanceRef.current, {
          shapeOptions: {
            color: "#667eea",
            weight: 3,
            fillOpacity: 0.2,
          },
        }).enable();
      }
    },
    startRectangleDraw: () => {
      setDrawMode('plot');
      if (mapInstanceRef.current) {
        new L.Draw.Rectangle(mapInstanceRef.current, {
          shapeOptions: {
            color: "#667eea",
            weight: 3,
            fillOpacity: 0.2,
          },
        }).enable();
      }
    },
    clearDrawings: () => {
      if (drawnItemsRef.current) {
        drawnItemsRef.current.clearLayers();
        if (onStatsUpdate) {
          onStatsUpdate({
            area: 0,
            perimeter: 0,
            imageCount: 0,
            status: "Ready",
          });
        }
      }
    },
    loadImagery: () => {
      console.log("Loading satellite imagery...");
      // Placeholder for GEE integration
      if (onStatsUpdate) {
        onStatsUpdate((prev) => ({ ...prev, status: "Loading imagery..." }));
      }
      setTimeout(() => {
        if (onStatsUpdate) {
          onStatsUpdate((prev) => ({ ...prev, status: "Ready" }));
        }
      }, 2000);
    },
    analyzeChanges: () => {
      console.log("Analyzing changes...");
      // Placeholder for change detection
      if (onStatsUpdate) {
        onStatsUpdate((prev) => ({ ...prev, status: "Analyzing..." }));
      }
      setTimeout(() => {
        if (onStatsUpdate) {
          onStatsUpdate((prev) => ({ ...prev, status: "Analysis complete" }));
        }
      }, 2000);
    },
    performSearch: async (query) => {
      try {
        // Check if query is lat,lng coordinate
        const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
        const match = query.match(coordRegex);

        let lat, lng, displayName;

        if (match) {
          lat = parseFloat(match[1]);
          lng = parseFloat(match[3]);
          displayName = `Coordinates: ${lat}, ${lng}`;
        } else {
          // Use Nominatim API for place search
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              query,
            )}&addressdetails=1`,
          );
          const data = await response.json();

          if (data && data.length > 0) {
            lat = parseFloat(data[0].lat);
            lng = parseFloat(data[0].lon);
            displayName = data[0].display_name;
          } else {
            console.warn("Location not found");
            if (onStatsUpdate) {
              onStatsUpdate((prev) => ({
                ...prev,
                status: "Location not found",
              }));
            }
            return;
          }
        }

        if (mapInstanceRef.current) {
          // Remove previous search marker
          if (searchMarkerRef.current) {
            mapInstanceRef.current.removeLayer(searchMarkerRef.current);
          }

          // Custom Icon matching original design
          const searchIcon = L.divIcon({
            className: "search-marker",
            html: `
              <div style="
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: 3px solid white;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="transform: rotate(45deg);">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
          });

          // Add marker
          searchMarkerRef.current = L.marker([lat, lng], {
            icon: searchIcon,
          }).addTo(mapInstanceRef.current);

          // Custom Popup
          const popupContent = `
            <div style="font-family: Inter, sans-serif; min-width: 200px;">
              <h4 style="margin: 0 0 8px 0; color: #667eea; font-size: 14px;">📍 Search Result</h4>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Location:</strong> ${displayName}</p>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Coordinates:</strong> ${lat.toFixed(7)}, ${lng.toFixed(7)}</p>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #888;">
                Click drawing tools to mark this area for monitoring
              </p>
            </div>
          `;

          searchMarkerRef.current.bindPopup(popupContent).openPopup();

          // Fly to location
          mapInstanceRef.current.flyTo([lat, lng], 17, {
            duration: 1.5,
            easeLinearity: 0.25,
          });

          if (onStatsUpdate) {
            onStatsUpdate((prev) => ({
              ...prev,
              status: "Location Found",
            }));
          }
        }
      } catch (error) {
        console.error("Search error:", error);
        if (onStatsUpdate) {
          onStatsUpdate((prev) => ({
            ...prev,
            status: "Search Error",
          }));
        }
      }
    },
  }));

  // Leaflet Geometry Util
  L.GeometryUtil = L.extend(L.GeometryUtil || {}, {
    geodesicArea: function (latLngs) {
      var pointsCount = latLngs.length,
        area = 0.0,
        d2r = Math.PI / 180,
        p1,
        p2;

      if (pointsCount > 2) {
        for (var i = 0; i < pointsCount; i++) {
          p1 = latLngs[i];
          p2 = latLngs[(i + 1) % pointsCount];
          area +=
            (p2.lng - p1.lng) *
            d2r *
            (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
        }
        area = (area * 6378137.0 * 6378137.0) / 2.0;
      }

      return Math.abs(area);
    },
  });

  return (
    <div className="relative h-full w-full">
      {/* Map Container */}
      <div ref={mapRef} className="h-full w-full bg-[#0a0a15]" />

      {/* Boundary Form Modal */}
      {showForm && (
        <BoundaryForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          mode={drawMode}
        />
      )}

      {/* Coordinates Overlay */}
      <div className="absolute top-4 left-4 z-[500] pointer-events-none">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl pointer-events-auto min-w-[200px]">
          <h3 className="text-sm font-semibold mb-2 text-white">Coordinates</h3>
          <p className="text-xs text-gray-300">
            Lat: {coordinates.lat}, Lng: {coordinates.lng}
          </p>
          <p className="text-xs text-gray-300 mt-1">Zoom: {zoom}</p>
        </div>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-[500] pointer-events-none">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl pointer-events-auto min-w-[220px]">
          <h3 className="text-sm font-semibold mb-3 text-white">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span style={{ border: '2px dashed #ef4444', width: '20px', height: '12px', borderRadius: '2px' }}></span>
              <span>Industry Boundary</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-5 h-3 rounded bg-[#4ade80] shadow-sm"></span>
              <span>Available Plot</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-5 h-3 rounded bg-[#f87171] shadow-sm"></span>
              <span>Allotted Plot</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-5 h-3 rounded bg-[#60a5fa] shadow-sm"></span>
              <span>Unavailable Plot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SatelliteMap.displayName = "SatelliteMap";

export default SatelliteMap;
