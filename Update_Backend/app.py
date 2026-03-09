from fastapi import FastAPI
from scripts.predict import predict_stock
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
print("RUNNING UPDATE_BACKEND SERVER")
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "https://ml-stock-prediction.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get("/predict")
def get_prediction(stock: str):
    try:
        result = predict_stock(stock)
        return result
    except Exception as e:
        return {
            "error": str(e)
        }
