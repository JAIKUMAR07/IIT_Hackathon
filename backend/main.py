from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from database import get_database
from gemini_service import analyze_plot_image
import json
from bson import ObjectId

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CSIDC Compliance Backend Active"}

@app.get("/plots")
async def get_plots():
    db = get_database()
    plots = await db.plots.find().to_list(100)
    for p in plots:
        p["_id"] = str(p["_id"])
    return plots

@app.post("/analyze")
async def analyze(
    image: UploadFile = File(...),
    plot_info: str = Form(...)
):
    image_bytes = await image.read()
    result = await analyze_plot_image(image_bytes, plot_info)
    return result

@app.post("/plots")
async def create_plot(plot: dict):
    db = get_database()
    result = await db.plots.insert_one(plot)
    return {"id": str(result.inserted_id)}
