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

SUPPORTED_STOCKS = ["RELIANCE", "TCS", "ADANI", "GOLD", "SILVER", "SUZLON"]
IST = pytz.timezone('Asia/Kolkata')

last_refresh = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        should_refresh = True
    else:
        if now.date() != last.date():
            should_refresh = True
        else:
            market_start = now.replace(hour=9, minute=30, second=0, microsecond=0)
            market_end = now.replace(hour=15, minute=30, second=0, microsecond=0)
            
            if market_start <= now <= market_end:
                if (now - last).total_seconds() > 900:
                    should_refresh = True
            elif now > market_end and last < market_end:
                should_refresh = True

    if should_refresh:
        print(f"Refreshing data and model for {stock} at {now} IST...")
        try:
            updated = update_stock_data(stock)
            if updated:
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

@app.get("/historical-data")
def get_historical(stock: str):
    import pandas as pd
    stock = stock.strip().upper()
    if stock not in SUPPORTED_STOCKS:
        raise HTTPException(status_code=404, detail=f"Stock {stock} not supported.")
    
    refresh_if_needed(stock)
    
    csv_path = f"data/{stock}.csv"
    if not os.path.exists(csv_path):
         raise HTTPException(status_code=404, detail="Historical data file not found.")
    
    try:
        df = pd.read_csv(csv_path)
        df_viz = df.tail(101).copy()
        
        df_viz["Prev_Return"] = df_viz["Daily_Return"].shift(1)
        df_viz["Volatility"] = df_viz["High_Low_Range"]
        
        df_viz = df_viz.iloc[1:].copy()
        
        df_viz = df_viz.fillna(0)
        
        df_viz["Signal"] = df_viz["Tomorrow_Return"].apply(lambda x: "BUY" if x > 0 else "SELL")
        
        records = df_viz[["Date", "Daily_Return", "Gap", "High_Low_Range", "Signal", "Tomorrow_Return", "Close", "Volatility", "Prev_Return"]].to_dict(orient="records")
        return {
            "stock": stock,
            "data": records
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting backend server on port {port}")
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
