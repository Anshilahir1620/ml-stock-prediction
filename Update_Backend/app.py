from fastapi import FastAPI
from scripts.predict import predict_stock
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8000/predict?stock=Suzlon",
        "http://127.0.0.1:5173",
        "https://ml-stock-prediction.onrender.com",
        "*"   # keep for safety during dev
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get("/predict")

def get_prediction(stock: str):

    stock = stock.upper()

    try:

        result = predict_stock(stock)

        return result

    except:

        return {
            "error": "Stock not found"
        }