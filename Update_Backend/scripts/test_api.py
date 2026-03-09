import requests
import time

url = "http://127.0.0.1:8000/predict"

def test_prediction(stock):
    try:
        response = requests.get(url, params={"stock": stock})
        print(f"Stock: {stock}, Status: {response.status_code}, Response: {response.json()}")
    except Exception as e:
        print(f"Error for {stock}: {e}")

# Give server a bit more time if needed
time.sleep(2)

print("Testing valid stocks...")
test_prediction("TCS")
test_prediction("Suzlon")

print("\nTesting invalid stock...")
test_prediction("INVALID_STOCK")
