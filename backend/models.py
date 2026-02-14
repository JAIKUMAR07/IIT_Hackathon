from pydantic import BaseModel, Field
from typing import List, Optional

class Coordinate(BaseModel):
    lat: float
    lng: float

class PlotBase(BaseModel):
    plot_number: str
    industrial_area: str
    district: str
    coordinates: List[List[float]] # List of [easting, northing] or [lat, lng]
    status: str = "Available"
    owner: Optional[str] = None

class AnalysisResult(BaseModel):
    match_percentage: float
    encroachment_detected: bool
    summary: str
    detected_plot_coordinates: List[List[float]]
