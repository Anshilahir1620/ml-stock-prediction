from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib

from utils import prepare_features, generate_signal, THRESHOLD

app = FastAPI(title="Stock Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Load models ONCE (important)
MODELS = {
    "RELIANCE": joblib.load("../Models/reliance_model.pkl"),
    "TCS": joblib.load("../Models/tcs_model.pkl"),
    "ADANI": joblib.load("../Models/Adani_model.pkl"),
    "GOLD": joblib.load("../Models/Gold_model.pkl"),
    "SILVER": joblib.load("../Models/Silver_model.pkl"),
    "SUZLON": joblib.load("../Models/Suzlon_model.pkl"),
}

DATA_FILES = {
    "RELIANCE": "../data/RELIANCE_cleaned.csv",
    "TCS": "../data/TCS.csv",
    "ADANI": "../data/Adani.csv",
    "GOLD": "../data/Gold.csv",
    "SILVER": "../data/Silver.csv",
    "SUZLON": "../data/Suzlon.csv",
}

@app.get("/")
def home():
    return {"message": "Stock Prediction API is running"}

@app.get("/predict")
def predict(stock: str):
    stock = stock.upper()

    if stock not in MODELS:
        raise HTTPException(status_code=404, detail="Stock not supported")

    # Load latest data
    df = pd.read_csv(DATA_FILES[stock])
    df["Date"] = pd.to_datetime(df["Date"])
    df = df.sort_values("Date")

    # Get model object
    obj = MODELS[stock]
    model = obj
    
    # Handle cases where model might be in a dictionary
    if isinstance(obj, dict):
        for v in obj.values():
            if hasattr(v, "predict"):
                model = v
                break

    # Detect required feature count
    n_features = getattr(model, "n_features_in_", 4)

    # Prepare features
    X_tomorrow = prepare_features(df, n_features=n_features)

    # Predict
    raw_prediction = float(model.predict(X_tomorrow)[0])
    current_price = float(df["Close"].iloc[-1])
    
    # Normalize: If raw prediction is > 1.0, assume it's an absolute price target
    # and convert to a fractional return. (e.g. 1% return = 0.01)
    if abs(raw_prediction) > 2.0: # threshold to distinguish return vs price
        predicted_return = (raw_prediction - current_price) / current_price
    else:
        predicted_return = raw_prediction

    # Signal logic
    signal = generate_signal(predicted_return)

    return {
        "stock": stock,
        "current_price": round(current_price, 2),
        "predicted_return": round(predicted_return, 6),
        "signal": signal,
        "threshold": THRESHOLD
    }
