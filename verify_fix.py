
import urllib.request
import json

stocks = ["RELIANCE", "TCS", "ADANI", "GOLD", "SILVER", "SUZLON"]
base_url = "http://127.0.0.1:8000/predict"

print(f"{'Stock':<10} | {'Price':<10} | {'Return %':<10} | {'Signal':<10}")
print("-" * 50)

for stock in stocks:
    try:
        url = f"{base_url}?stock={stock}"
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            print(f"{data['stock']:<10} | {data['current_price']:<10} | {data['predicted_return']*100:>8.2f}% | {data['signal']:<10}")
    except Exception as e:
        print(f"{stock:<10} | Error: {e}")
