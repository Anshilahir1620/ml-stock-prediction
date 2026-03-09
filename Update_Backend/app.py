from fastapi import FastAPI, Body
from scripts.predict import predict_stock
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Configuration
SUPPORTED_STOCKS = ["RELIANCE", "TCS", "ADANI", "GOLD", "SILVER", "SUZLON"]

print("RUNNING UPDATE_BACKEND SERVER")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ml-stock-prediction.vercel.app/",
        "http://localhost:5173/"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StockRequest(BaseModel):
    stock: str

@app.get("/")
def read_root():
    return {
        "status": "online",
        "supported_stocks": SUPPORTED_STOCKS
    }

@app.get("/predict")
def get_prediction(stock: str):
    stock = stock.upper()
    try:
        result = predict_stock(stock)
        return result
    except Exception as e:
        return {"error": str(e)}

@app.post("/predict")
def post_prediction(request: StockRequest):
    stock = request.stock.upper()
    try:
        result = predict_stock(stock)
        return result
    except Exception as e:
        return {"error": str(e)}
