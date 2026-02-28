import pandas as pd

# 🔒 Fixed threshold
THRESHOLD = 0.004  # 0.4%

FEATURES = [
    "Daily_Return",
    "Gap",
    "High_Low_Range",
    "Prev_Day_Trend"
]

def prepare_features(df: pd.DataFrame, n_features: int = 4):
    df = df.copy()

    df["Daily_Return"] = df["Close"] - df["Close"].shift(1)
    df["Gap"] = df["Open"] - df["Close"].shift(1)
    df["High_Low_Range"] = df["High"] - df["Low"]
    df["Prev_Day_Trend"] = (
        df["Close"].shift(1) > df["Close"].shift(2)
    ).astype(int)

    # Base features
    base_feats = ["Daily_Return", "Gap", "High_Low_Range", "Prev_Day_Trend"]
    
    # Add Volume if needed (some models expect 5 features)
    if n_features == 5:
        base_feats.append("Volume")

    X = df[base_feats].shift(1).dropna()

    # return last row only (tomorrow prediction)
    return X.iloc[[-1]]


def generate_signal(predicted_return: float) -> str:
    if predicted_return > THRESHOLD:
        return "BUY"
    elif predicted_return < -THRESHOLD:
        return "SELL"
    else:
        return "NO TRADE"