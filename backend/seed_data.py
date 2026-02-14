import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def seed():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.csidc_database
    
    plots = [
        {
            "plot_number": "101",
            "industrial_area": "TILDA INDUSTRIAL PARK",
            "district": "Raipur",
            "coordinates": [[21.365, 81.650], [21.366, 81.651], [21.367, 81.652]],
            "status": "Allotted",
            "owner": "Tata Steel"
        },
        {
            "plot_number": "202",
            "industrial_area": "BARTORI SECTOR",
            "district": "Bhilai",
            "coordinates": [[21.190, 81.350], [21.191, 81.351]],
            "status": "Available",
            "owner": None
        }
    ]
    
    await db.plots.insert_many(plots)
    print("Seeded MongoDB with pilot plots.")

if __name__ == "__main__":
    asyncio.run(seed())
