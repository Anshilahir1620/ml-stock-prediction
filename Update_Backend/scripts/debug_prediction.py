import os
import pandas as pd
import joblib
try:
    from scripts.predict import predict_stock
except ImportError:
    from predict import predict_stock


STOCKS = ["TCS", "Suzlon", "Adani", "Gold", "SILVER", "RELIANCE"]
ALTERNATE = ["TCS", "SUZLON", "ADANI", "GOLD", "SILVER", "RELIANCE"]

print("Checking data files:")
for s in STOCKS + ALTERNATE:
    path = f"data/{s}.csv"
    exists = os.path.exists(path)
    size = os.path.getsize(path) if exists else 0
    print(f"data/{s}.csv: {'Exists (' + str(size) + ' bytes)' if exists else 'Missing'}")

print("\nChecking model files:")
for s in STOCKS + ALTERNATE:
    path = f"models/{s}_model.pkl"
    exists = os.path.exists(path)
    print(f"models/{s}_model.pkl: {'Exists' if exists else 'Missing'}")

print("\nTesting predict_stock function:")
for s in ALTERNATE:
    try:
        res = predict_stock(s)
        print(f"Prediction for {s}: SUCCESS -> {res}")
    except Exception as e:
        print(f"Prediction for {s}: FAILED -> {e}")
