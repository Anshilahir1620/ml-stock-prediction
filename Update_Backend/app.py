from fastapi import FastAPI, Body, HTTPException
from scripts.predict import predict_stock
from scripts.fetch_and_clean_data import update_stock_data
from scripts.train_models import train_model
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import datetime
import pytz
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Configuration
SUPPORTED_STOCKS = ["RELIANCE", "TCS", "ADANI", "GOLD", "SILVER", "SUZLON"]
IST = pytz.timezone('Asia/Kolkata')

# In-memory cache for last refresh time per stock
last_refresh = {}

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

class StockRequest(BaseModel):
    stock: str

def refresh_if_needed(stock: str):
    stock = stock.strip().upper()
    now = datetime.datetime.now(IST)
    last = last_refresh.get(stock)
    
    should_refresh = False
    
    if not last:
        # Never refreshed in this session
        should_refresh = True
    else:
        # Check if it was a different day
        if now.date() != last.date():
            should_refresh = True
        else:
            # Same day: Check market hours (9:30 AM - 3:30 PM IST)
            market_start = now.replace(hour=9, minute=30, second=0, microsecond=0)
            market_end = now.replace(hour=15, minute=30, second=0, microsecond=0)
            
            if market_start <= now <= market_end:
                # If market is open, refresh if last refresh was more than 15 mins ago
                if (now - last).total_seconds() > 900:
                    should_refresh = True
            elif now > market_end and last < market_end:
                # Final refresh after market close to get the end-of-day data
                should_refresh = True

    if should_refresh:
        print(f"Refreshing data and model for {stock} at {now} IST...")
        try:
            # Fetch latest data
            updated = update_stock_data(stock)
            if updated:
                # Retrain model with new data
                train_model(stock)
            last_refresh[stock] = now
            return True
        except Exception as e:
            print(f"Error during auto-refresh for {stock}: {e}")
            return False
    return False

@app.get("/")
def read_root():
    return {
        "status": "online",
        "supported_stocks": SUPPORTED_STOCKS,
        "timezone": "IST (Asia/Kolkata)"
    }

@app.post("/predict")
def post_prediction(request: StockRequest):
    stock = request.stock.strip().upper()
    if stock not in SUPPORTED_STOCKS:
        raise HTTPException(status_code=404, detail=f"Stock {stock} not supported. Try {SUPPORTED_STOCKS}")
    
    # Trigger smart refresh/retrain before predicting
    refresh_if_needed(stock)
    
    try:
        result = predict_stock(stock)
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predict")
def get_prediction(stock: str):
    stock = stock.strip().upper()
    if stock not in SUPPORTED_STOCKS:
        raise HTTPException(status_code=404, detail=f"Stock {stock} not supported. Try {SUPPORTED_STOCKS}")
    
    refresh_if_needed(stock)
    
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
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
