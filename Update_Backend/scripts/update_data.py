import yfinance as yf
import pandas as pd
import os

stocks = {
    "RELIANCE": "RELIANCE.NS",
    "TCS": "TCS.NS",
    "SILVER": "SILVERBEES.NS",
    "GOLD": "TATAGOLD.NS",
    "ADANI": "ADANIENT.NS",
    "SUZLON": "SUZLON.NS"
}

def update_all_data():

    for name,ticker in stocks.items():

        file_path = f"data/{name}.csv"

        if os.path.exists(file_path):

            df = pd.read_csv(file_path)
            last_date = df["Date"].max()

        else:

            last_date = "2005-01-01"

        new_data = yf.download(ticker,start=last_date)

        new_data.reset_index(inplace=True)

        if os.path.exists(file_path):

            df = pd.concat([df,new_data])

        else:

            df = new_data

        df.to_csv(file_path,index=False)

        print(name,"updated")
