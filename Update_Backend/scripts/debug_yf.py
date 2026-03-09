import yfinance as yf
ticker = "TCS.NS"
new_data = yf.download(ticker, start="2024-01-01")
print(new_data.columns)
print(new_data.head())
