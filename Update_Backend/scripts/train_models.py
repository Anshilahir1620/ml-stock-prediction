import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
import os

STOCKS = ["TCS", "SUZLON", "ADANI", "GOLD", "SILVER", "RELIANCE"]

DATA_FOLDER = "data"
MODEL_FOLDER = "models"

features = [
    "Daily_Return",
    "Gap",
    "High_Low_Range",
    "Prev_Day_Trend"
]

def train_model(stock):
    stock = stock.upper()
    file_path = os.path.join(DATA_FOLDER, f"{stock}.csv")
    if not os.path.exists(file_path):
        print(f"Data for {stock} not found.")
        return False
        
    df = pd.read_csv(file_path)
    
    df = df.dropna(subset=["Tomorrow_Return"])
    
    if len(df) < 50:
        print(f"Not enough data to train {stock}")
        return False

    X = df[features]
    y = (df["Tomorrow_Return"] > 0).astype(int)

    model = RandomForestClassifier(n_estimators=200)
    model.fit(X, y)

    if not os.path.exists(MODEL_FOLDER):
        os.makedirs(MODEL_FOLDER)

    model_path = os.path.join(MODEL_FOLDER, f"{stock}_model.pkl")
    joblib.dump(model, model_path)
    print(f"{stock} model trained and saved to {model_path}")
    return True

def train_all_models():
    for stock in STOCKS:
        train_model(stock)

if __name__ == "__main__":
    train_all_models()