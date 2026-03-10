from fastapi import FastAPI, Body, HTTPException
from scripts.predict import predict_stock
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Configuration
SUPPORTED_STOCKS = ["RELIANCE", "TCS", "ADANI", "GOLD", "SILVER", "SUZLON"]

print("RUNNING UPDATE_BACKEND SERVER")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ml-stock-prediction.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"Server configured with SUPPORTED_STOCKS: {SUPPORTED_STOCKS}")


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
    stock = stock.strip().upper()
    if stock not in SUPPORTED_STOCKS:
        raise HTTPException(status_code=404, detail=f"Stock {stock} not supported. Try {SUPPORTED_STOCKS}")
    try:
        result = predict_stock(stock)
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
def post_prediction(request: StockRequest):
    stock = request.stock.strip().upper()
    if stock not in SUPPORTED_STOCKS:
        raise HTTPException(status_code=404, detail=f"Stock {stock} not supported. Try {SUPPORTED_STOCKS}")
    try:
        result = predict_stock(stock)
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting backend server on port {port}")
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
