import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
import os

STOCKS = [
"TCS","SUZLON","ADANI","GOLD","SILVER","RELIANCE"
]


DATA_FOLDER = "data"
MODEL_FOLDER = "models"

features = [
"Daily_Return",
"Gap",
"High_Low_Range",
"Prev_Day_Trend"
]


def train_all_models():

    if not os.path.exists(MODEL_FOLDER):
        os.makedirs(MODEL_FOLDER)

    for stock in STOCKS:

        df = pd.read_csv(f"{DATA_FOLDER}/{stock}.csv")
        
        # Drop rows where target is missing (the latest row)
        df = df.dropna(subset=["Tomorrow_Return"])

        X = df[features]

        y = (df["Tomorrow_Return"] > 0).astype(int)


        model = RandomForestClassifier(n_estimators=200)

        model.fit(X, y)

        joblib.dump(model, f"{MODEL_FOLDER}/{stock}_model.pkl")

        print(stock, "model trained")


if __name__ == "__main__":
    train_all_models()