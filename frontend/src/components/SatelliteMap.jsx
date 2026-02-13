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
  const [drawMode, setDrawMode] = useState("plot"); // 'boundary' or 'plot'
  const [detectedParentArea, setDetectedParentArea] = useState(null);

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

      // Calculate center to check containment
      const center = layer.getBounds().getCenter();
      let parentContext = null;

      // Check if this new layer is inside any existing Industry Boundary
      drawnItemsRef.current.eachLayer((existingLayer) => {
        // We need a way to identify if an existing layer is a boundary.
        // We can check if it has 'boundaryType' in its options or popup content,
        // but cleaner is to store metadata on the layer object itself.
        if (
          existingLayer.userData &&
          existingLayer.userData.type === "boundary"
        ) {
          // Check if center is inside this polygon
          // Leaflet's contains is for bounds, but for polygon shape we can use a simple point-in-polygon check
          // or just check bounds for MVP if shapes are simple rectangles.
          // Better: use bounds intersection as a proxy for "is inside area"
          if (existingLayer.getBounds().contains(center)) {
            // Found a parent boundary, extract relevant context
            parentContext = {
              industrialArea: existingLayer.userData.name,
              district: existingLayer.userData.district,
              // Add other inherited fields if necessary
            };
          }
        }
      });

      map.addLayer(layer);
      setPendingLayer(layer);
      // Pass the detected parent context to the form
      setDetectedParentArea(parentContext);
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

    const {
      category,
      color,
      district,
      location,
      plotNumber,
      industrialArea,
      sector,
      status,
      boundaryType,
    } = data;

    // Use the color selected in the form, or fallbacks
    let finalColor = color || "#667eea";
    let fillColor = color || "#667eea";
    let dashArray = null;
    let weight = 2;
    let fillOpacity = 0.5;

    // Persist data to the layer for future retrieval
    pendingLayer.userData = {
      ...data,
      type: drawMode === "boundary" ? "boundary" : "plot",
      name: drawMode === "boundary" ? location : "", // Use location as the name for the boundary
    };

    // Boundary Mode Styling
    if (drawMode === "boundary") {
      finalColor = "#ef4444";
      fillColor = "transparent";
      dashArray = "10, 10"; // Dashed line
      weight = 4;
      fillOpacity = 0;
    } else {
      // Plot Mode Styling
      // For industrial plots, we might want to respect the status color override if user wants that
      // But the user specifically asked for "choose plot with red color box", so we prioritize the selected category color.
      // However, if the category is 'Industrial Plot', we might want to let the Status dictate the shade or just stick to Red.
      // The current form sets 'Industrial Plot' to Red.
      // If the user selects "Green Area", it's green.
    }

    pendingLayer.setStyle({
      color: finalColor,
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      weight: weight,
      dashArray: dashArray,
    });

    // Add Label to the center (Plot Number or Category Name)
    // Only add label if it's a plot or if it has a meaningful name
    const center = pendingLayer.getBounds().getCenter();
    let labelContent = "";

    if (drawMode === "boundary") {
      // For boundary, maybe show "District Boundary" text? Or skip.
      // Skipping for now to keep it clean like image 1
    } else {
      if (category === "Industrial Plot" && plotNumber) {
        labelContent = `<span style="font-weight: 800; font-size: 14px; text-shadow: 0 0 4px #000;">${plotNumber}</span>`;
      } else if (category && category !== "Industrial Plot") {
        labelContent = `<span style="font-weight: 600; font-size: 10px; text-transform: uppercase; text-shadow: 0 0 4px #000;">${category}</span>`;
      }
    }

    if (labelContent) {
      const labelIcon = L.divIcon({
        className: "plot-label",
        html: `<div style="color: white; text-align: center; white-space: nowrap;">${labelContent}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0], // Centered roughly by CSS if needed, or we rely on the div centering
      });

      const labelMarker = L.marker(center, {
        icon: labelIcon,
        interactive: false, // Click through to polygon
        zIndexOffset: 1000,
      }).addTo(drawnItemsRef.current);

      // Store reference to label in the layer for potential deletion later
      pendingLayer.labelMarker = labelMarker;
    }

    // Popup Content Construction
    let popupContent = "";
    // Styles for Popup
    const styles = {
      popup: "font-family: 'Inter', sans-serif; min-width: 260px; padding: 0;",
      header: `display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 2px solid ${finalColor}; background: #f9fafb; border-radius: 8px 8px 0 0;`,
      title:
        "margin: 0; color: #1f2937; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px;",
      closeBtn:
        "cursor: pointer; font-size: 18px; color: #9ca3af; line-height: 1;",
      content: "padding: 0;",
      table: "width: 100%; border-collapse: collapse; font-size: 13px;",
      tdKey:
        "padding: 10px 16px; color: #6b7280; font-weight: 500; border-bottom: 1px solid #f3f4f6; border-right: 1px solid #f3f4f6; width: 40%; background: #fff;",
      tdValue:
        "padding: 10px 16px; color: #1f2937; font-weight: 600; border-bottom: 1px solid #f3f4f6; background: #fff;",
      locationBox:
        "display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;",
    };

    // Location HTML (Bottom)
    const locationBottomHtml = `
      <div style="${styles.locationBox}">
        <span style="color: #ef4444; font-size: 18px;">📍</span>
        <div style="display: flex; flex-direction: column;">
           <span style="font-size: 12px; font-weight: 700; color: #1f2937;">Location</span>
           <span style="font-size: 11px; font-family: monospace; color: #6b7280;">
             ${center.lat.toFixed(7)}°N, ${center.lng.toFixed(7)}°E
           </span>
        </div>
      </div>
    `;

    if (drawMode === "boundary") {
      popupContent = `
        <div style="${styles.popup}">
          <div style="${styles.header} border-bottom-color: #ef4444;">
             <h3 style="${styles.title}">
               <span style="font-size: 18px;">🚧</span> Boundary Info
             </h3>
             <span style="${styles.closeBtn}" onclick="this.closest('.leaflet-popup').remove()">&times;</span>
          </div>
          
          <div style="${styles.content}">
            <table style="${styles.table}">
              <tr>
                <td style="${styles.tdKey}">Type</td>
                <td style="${styles.tdValue}">${boundaryType || "N/A"}</td>
              </tr>
              <tr>
                <td style="${styles.tdKey}">Name</td>
                <td style="${styles.tdValue}">${location || "N/A"}</td>
              </tr>
               <tr>
                <td style="${styles.tdKey}">District</td>
                <td style="${styles.tdValue}">${district || "N/A"}</td>
              </tr>
            </table>
          </div>
          ${locationBottomHtml}
        </div>
      `;
    } else {
      // Logic for Plots
      const isIndustrial = category === "Industrial Plot";
      const title = isIndustrial
        ? "Industrial Plot Information"
        : "Amenity Information";
      const icon = isIndustrial ? "🏭" : "🏢";

      let tableRows = "";

      if (isIndustrial) {
        // Image 3 Structure
        tableRows = `
          <tr><td style="${styles.tdKey}">District</td><td style="${styles.tdValue}">${district || "N/A"}</td></tr>
          <tr><td style="${styles.tdKey}">Sector</td><td style="${styles.tdValue}">${sector || "Others"}</td></tr>
          <tr><td style="${styles.tdKey}">Industrial Area</td><td style="${styles.tdValue}">${industrialArea || "N/A"}</td></tr>
          <tr><td style="${styles.tdKey}">Plot Type</td><td style="${styles.tdValue}">${plotType || "Industrial Purpose"}</td></tr>
          <tr><td style="${styles.tdKey}">Plot Number</td><td style="${styles.tdValue}">${plotNumber || "N/A"}</td></tr>
          <tr>
            <td style="${styles.tdKey}">Status</td>
            <td style="${styles.tdValue}">
               <span style="font-size: 10px; padding: 4px 8px; border-radius: 4px; background: ${status === "Available" ? "#dcfce7" : status === "Allotted" ? "#fee2e2" : "#dbeafe"}; color: ${status === "Available" ? "#166534" : status === "Allotted" ? "#991b1b" : "#1e40af"}; font-weight: 700; text-transform: uppercase;">
                 ${status || "N/A"}
               </span>
            </td>
          </tr>
        `;
      } else {
        // Image 1/2 Structure
        tableRows = `
          <tr><td style="${styles.tdKey}">Category</td><td style="${styles.tdValue}">${(category || "").toUpperCase()}</td></tr>
          <tr><td style="${styles.tdKey}">District Name</td><td style="${styles.tdValue}">${district || "N/A"}</td></tr>
          <tr><td style="${styles.tdKey}">Location</td><td style="${styles.tdValue}">${location || "N/A"}</td></tr>
          <tr><td style="${styles.tdKey}">Plot Type</td><td style="${styles.tdValue}">N/A</td></tr>
        `;
      }

      popupContent = `
        <div style="${styles.popup}">
          <div style="${styles.header}">
             <h3 style="${styles.title}">
               <span style="font-size: 18px;">${icon}</span> ${title}
             </h3>
             <span style="${styles.closeBtn}" onclick="this.closest('.leaflet-popup').remove()">&times;</span>
          </div>
          
          <div style="${styles.content}">
            <table style="${styles.table}">
              ${tableRows}
            </table>
          </div>
          ${locationBottomHtml}
        </div>
      `;
    }

    pendingLayer.bindPopup(popupContent, {
      maxWidth: 300,
      className: "custom-popup",
    });

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
      setDrawMode("boundary");
      if (mapInstanceRef.current) {
        new L.Draw.Polygon(mapInstanceRef.current, {
          shapeOptions: {
            color: "#ef4444",
            weight: 3,
            fillOpacity: 0,
            dashArray: "5, 10",
          },
        }).enable();
      }
    },
    startPolygonDraw: () => {
      setDrawMode("plot");
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
      setDrawMode("plot");
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
        let lat, lng, displayName;

        // Optimization: Handle detailed location object directly from Sidebar
        if (
          typeof query === "object" &&
          query !== null &&
          query.lat &&
          query.lon
        ) {
          lat = parseFloat(query.lat);
          lng = parseFloat(query.lon);
          displayName = query.display_name;
        } else if (typeof query === "string") {
          // Check if query is lat,lng coordinate
          const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
          const match = query.match(coordRegex);

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
        } else {
          return;
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
          initialData={detectedParentArea || {}}
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
              <span
                style={{
                  border: "2px dashed #ef4444",
                  width: "20px",
                  height: "12px",
                  borderRadius: "2px",
                }}
              ></span>
              <span>Industry Boundary</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-5 h-3 rounded bg-[#15803d] shadow-sm"></span>
              <span>Available Plot</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-5 h-3 rounded bg-[#dc2626] shadow-sm"></span>
              <span>Allotted Plot</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <span className="w-5 h-3 rounded bg-[#1e40af] shadow-sm"></span>
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
