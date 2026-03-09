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


def predict_stock(stock):

    df = pd.read_csv(f"{DATA_FOLDER}/{stock}.csv")

    model = joblib.load(f"{MODEL_FOLDER}/{stock}_model.pkl")

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
        "threshold": threshold
    }
