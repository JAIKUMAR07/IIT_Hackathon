# LandWatch - Industrial Land Monitoring System

A comprehensive satellite-based industrial land monitoring application built with React, Tailwind CSS, and Leaflet.

## 🚀 Features

### ✨ Satellite Imagery

- **Multiple Satellite Sources**: Google Satellite (Hybrid & Pure), ESRI Satellite
- **High-Resolution Imagery**: Up to 21 zoom levels for detailed inspection
- **Layer Control**: Switch between different satellite providers
- **Place Labels Overlay**: Optional labels for better navigation

### 🗺️ Interactive Mapping

- **Drawing Tools**: Polygon and Rectangle tools for boundary selection
- **Real-time Coordinates**: 7-decimal precision for accurate positioning
- **Zoom Controls**: Smooth zoom with 0.5 increments
- **Location Search**: Search by place name or coordinates

### 📊 Analysis Tools

- **Area Calculation**: Automatic area calculation in hectares
- **Perimeter Measurement**: Precise boundary measurements
- **Change Detection**: Analyze land use changes over time
- **Statistics Panel**: Real-time stats for selected areas

### 🎨 Premium UI/UX

- **Glassmorphism Design**: Modern glass-effect UI components
- **Dark Theme**: Eye-friendly dark interface
- **Animated Backgrounds**: Dynamic gradient and grid animations
- **Responsive Layout**: Optimized for all screen sizes
- **Custom Scrollbars**: Styled scrollbars matching the theme

## 📦 Tech Stack

- **React 18** - UI Framework
- **Tailwind CSS** - Styling
- **Leaflet** - Interactive maps
- **Leaflet Draw** - Drawing tools
- **Lucide React** - Modern icons
- **Vite** - Build tool

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Control panel
│   │   └── SatelliteMap.jsx    # Main map component
│   ├── App.jsx                 # Main application
│   ├── index.css               # Global styles & animations
│   └── main.jsx                # Entry point
├── index.html                  # HTML template
├── tailwind.config.js          # Tailwind configuration
└── vite.config.js              # Vite configuration
```

## 🎯 Key Components

### SatelliteMap Component

- Initializes Leaflet map with satellite layers
- Handles drawing events
- Calculates area and perimeter
- Manages map interactions

### Sidebar Component

- Date range selection
- Satellite layer selection
- Cloud cover filter
- Drawing tools
- Statistics display

### Header Component

- Navigation menu
- Notifications
- Settings
- Branding

## 🌟 Features Breakdown

### Satellite Layers

1. **Google Satellite (Hybrid)** - Best quality with labels
2. **Google Satellite (Pure)** - Ultra high-resolution imagery
3. **ESRI Satellite** - Alternative satellite source
4. **OpenStreetMap** - Standard street map view

### Drawing Tools

- **Polygon Tool**: Draw custom boundaries
- **Rectangle Tool**: Quick rectangular selection
- **Clear Tool**: Remove all drawings

### Statistics

- **Area**: Calculated in hectares
- **Perimeter**: Measured in meters
- **Image Count**: Number of available satellite images
- **Status**: Current operation status

## 🎨 Design System

### Colors

- **Primary**: `#667eea` → `#764ba2` (Purple gradient)
- **Accent**: `#f093fb` → `#f5576c` (Pink gradient)
- **Success**: `#43e97b` (Green)
- **Info**: `#4facfe` (Blue)
- **Warning**: `#feca57` (Yellow)
- **Danger**: `#ff6b6b` (Red)

### Typography

- **Primary Font**: Inter (300-800 weights)
- **Display Font**: Space Grotesk (500-700 weights)

### Animations

- **Gradient Shift**: 20s infinite background animation
- **Grid Move**: 30s infinite grid movement
- **Float**: 3s logo floating effect
- **Pulse**: Notification badge pulse

## 🔧 Configuration

### Tailwind Config

Custom theme with:

- Extended color palette
- Custom fonts
- Radial gradients
- Custom animations

### Vite Config

- React plugin
- Tailwind CSS plugin
- Development server settings

## 📱 Responsive Design

- **Desktop**: Full sidebar + map layout
- **Tablet**: Collapsible sidebar
- **Mobile**: Full-screen map with drawer

## 🚀 Future Enhancements

### Google Earth Engine Integration

The application is designed to integrate with Google Earth Engine for:

- Real Sentinel-2 imagery
- NDVI calculations
- Change detection algorithms
- Time-series analysis

### Planned Features

- [ ] Real-time satellite data loading
- [ ] Advanced change detection
- [ ] Export reports (PDF/Excel)
- [ ] User authentication
- [ ] Save/load projects
- [ ] Multi-user collaboration
- [ ] Alert system for changes
- [ ] Mobile app version

## 📝 Notes

### Current Implementation

- Uses publicly available satellite tile services
- Simulated change detection for demonstration
- Client-side calculations for area/perimeter

### Production Deployment

For production use with real satellite data:

1. Set up Google Cloud Project
2. Enable Earth Engine API
3. Create service account
4. Implement backend server (Node.js + Express)
5. Connect frontend to backend API

## 🤝 Contributing

This is a hackathon project for industrial land monitoring. Contributions welcome!

## 📄 License

MIT License - feel free to use for your projects!

## 🙏 Acknowledgments

- Google Maps for satellite imagery
- ESRI for additional satellite data
- Leaflet for the amazing mapping library
- Tailwind CSS for the utility-first framework

---

**Built with ❤️ for IIIT Hackathon**
