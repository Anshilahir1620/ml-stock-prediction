import pandas as pd
import joblib

DATA_FOLDER = "data"
MODEL_FOLDER = "models"

features = [
"Daily_Return",
"Gap",
"High_Low_Range",
"Prev_Day_Trend"
]


import os

def predict_stock(stock):
    stock = stock.strip().upper()
    
    csv_path = os.path.join(DATA_FOLDER, f"{stock}.csv")
    model_path = os.path.join(MODEL_FOLDER, f"{stock}_model.pkl")

    # Double check file existence (case-insensitive fallback)
    if not os.path.exists(DATA_FOLDER):
        os.makedirs(DATA_FOLDER)
        
    if not os.path.exists(csv_path):
        files = os.listdir(DATA_FOLDER)
        match = [f for f in files if f.upper() == f"{stock}.CSV"]
        if match:
            csv_path = os.path.join(DATA_FOLDER, match[0])
        else:
            raise FileNotFoundError(f"Data file for {stock} not found. Please run the data update script.")

    if not os.path.exists(MODEL_FOLDER):
        os.makedirs(MODEL_FOLDER)

    if not os.path.exists(model_path):
        files = os.listdir(MODEL_FOLDER)
        match = [f for f in files if f.upper() == f"{stock}_MODEL.PKL"]
        if match:
            model_path = os.path.join(MODEL_FOLDER, match[0])
        else:
            raise FileNotFoundError(f"Model file for {stock} not found. Please run the training script.")


    df = pd.read_csv(csv_path)
    model = joblib.load(model_path)

    latest = df.tail(1)
    X = latest[features]

    # Get probability of upward movement
    proba = model.predict_proba(X)[0][1]
    
    threshold = 0.5
    signal = "BUY" if proba >= threshold else "SELL"
    current_price = float(latest["Close"].iloc[0])

    return {
        "stock": stock,
        "current_price": round(current_price, 2),
        "predicted_return": round(float(proba), 4),
        "signal": signal,
        "threshold": threshold,
        "confidence": round(abs(proba - threshold) * 2 * 100, 2)
    }

