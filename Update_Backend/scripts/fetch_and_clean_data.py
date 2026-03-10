import yfinance as yf
import pandas as pd
import os

STOCKS = {
    "TCS": "TCS.NS",
    "SUZLON": "SUZLON.NS",
    "ADANI": "ADANIPOWER.NS",
    "GOLD": "TATAGOLD.NS",
    "SILVER": "SILVERBEES.NS",
    "RELIANCE": "RELIANCE.NS"
}

DATA_FOLDER = "data"


def clean_data(df):

    df["Date"] = pd.to_datetime(df["Date"]).dt.tz_localize(None)

    df = df.sort_values("Date")

    df["Tomorrow"] = df["Close"].shift(-1)

    df["Daily_Return"] = df["Close"] - df["Close"].shift(1)

    df["Tomorrow_Return"] = (df["Tomorrow"] - df["Close"]) / df["Close"]

    df["Gap"] = df["Open"] - df["Close"].shift(1)

    df["High_Low_Range"] = df["High"] - df["Low"]

    df["Prev_Day_Trend"] = (df["Close"].shift(1) > df["Close"].shift(2)).astype(int)

    # Required features for prediction
    features = ["Daily_Return", "Gap", "High_Low_Range", "Prev_Day_Trend"]
    
    # Drop rows where features are NaN (usually first few rows)
    df = df.dropna(subset=features)

    return df



def fetch_data(stock, ticker):

    file_path = f"{DATA_FOLDER}/{stock}.csv"

    if os.path.exists(file_path):

        df_old = pd.read_csv(file_path)

        last_date = df_old["Date"].max()

        new_data = yf.download(ticker, start=last_date)

    else:

        new_data = yf.download(ticker, start="2005-01-01")

    # Handle MultiIndex columns from new yfinance versions
    if isinstance(new_data.columns, pd.MultiIndex):
        new_data.columns = new_data.columns.get_level_values(0)

    new_data.reset_index(inplace=True)

    return new_data



def update_stock_data(stock):
    stock = stock.upper()
    ticker = STOCKS.get(stock)
    if not ticker:
        print(f"Stock {stock} not supported.")
        return False
        
    data = fetch_data(stock, ticker)
    if data is None or data.empty:
        print(f"No new data for {stock}")
        return False
        
    was_updated = save_data(stock, data)
    return was_updated

def save_data(stock, new_data):
    file_path = f"{DATA_FOLDER}/{stock}.csv"
    
    if os.path.exists(file_path):
        old = pd.read_csv(file_path)
        # Convert both to same datetime format for comparison
        old["Date"] = pd.to_datetime(old["Date"]).dt.tz_localize(None)
        new_data["Date"] = pd.to_datetime(new_data["Date"]).dt.tz_localize(None)
        
        # Check if new_data has dates not in old
        existing_dates = set(old["Date"])
        new_dates = set(new_data["Date"])
        
        if new_dates.issubset(existing_dates):
            # No new days, but maybe today's price updated
            # For simplicity, we'll update if today's date is in new_data
            today = pd.Timestamp.now().normalize()
            if today in new_dates:
                # Update today's row
                old = old[old["Date"] != today]
                df = pd.concat([old, new_data])
            else:
                return False
        else:
            df = pd.concat([old, new_data])
            
        df = df.drop_duplicates(subset=["Date"])
    else:
        df = new_data

    df = clean_data(df)
    df.to_csv(file_path, index=False)
    print(f"{stock} dataset updated")
    return True

def run():
    if not os.path.exists(DATA_FOLDER):
        os.makedirs(DATA_FOLDER)
    for stock in STOCKS.keys():
        update_stock_data(stock)

if __name__ == "__main__":
    run()
