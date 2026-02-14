import google.generativeai as genai
import os
import json
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-1.5')

PROMPT = """
You are an expert geospatial analyst for CSIDC (Chhattisgarh State Industrial Development Corporation).
Analyze this satellite image of an industrial plot. 
Compare the visible construction/boundary with the provided reference layout.

Tasks:
1. Detect the current physical boundary of the industry.
2. Identify any encroachments beyond the allotted plot area.
3. Check for any unauthorized construction.

Return the response in strict JSON format with the following keys:
- match_percentage: (number 0-100) based on compliance with reference.
- encroachment_detected: (boolean)
- summary: (string) detailed observation.
- detected_boundaries: (array of [lat, lng]) approximate boundary corners found in image. (Use the frame of the image to estimate relative coordinates if possible, or just provide semantic descriptions if specific coordinates aren't clear, but prefer numerical approximations).

Reference Area for this image: {plot_info}
"""

async def analyze_plot_image(image_bytes: bytes, plot_info: str):
    image = Image.open(BytesIO(image_bytes))
    
    response = model.generate_content([
        PROMPT.format(plot_info=plot_info),
        image
    ])
    
    try:
        # Clean response if it contains markdown code blocks
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except Exception as e:
        return {
            "match_percentage": 0,
            "encroachment_detected": False,
            "summary": f"Failed to parse AI response: {str(e)}",
            "detected_boundaries": []
        }
