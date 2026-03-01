from fastapi import FastAPI, HTTPException, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import pandas as pd
import joblib

from utils import prepare_features, generate_signal, THRESHOLD



app = FastAPI(title="Stock Prediction API")

# 🌐 CORS Configuration - Wildcard is safe with allow_credentials=False
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = Path(__file__).resolve().parent


# 📂 Load Models
MODELS = {
    "RELIANCE": joblib.load(BASE_DIR / "Models" / "reliance_model.pkl"),
    "TCS": joblib.load(BASE_DIR / "Models" / "tcs_model.pkl"),
    "ADANI": joblib.load(BASE_DIR / "Models" / "Adani_model.pkl"),
    "GOLD": joblib.load(BASE_DIR / "Models" / "Gold_model.pkl"),
    "SILVER": joblib.load(BASE_DIR / "Models" / "Silver_model.pkl"),
    "SUZLON": joblib.load(BASE_DIR / "Models" / "Suzlon_model.pkl"),
}

# 📊 Map stocks to CSVs
DATA_FILES = {
    "RELIANCE": BASE_DIR / "data" / "RELIANCE.csv",
    "TCS": BASE_DIR / "data" / "TCS.csv",
    "ADANI": BASE_DIR / "data" / "Adani.csv",
    "GOLD": BASE_DIR / "data" / "Gold.csv",
    "SILVER": BASE_DIR / "data" / "Silver.csv",
    "SUZLON": BASE_DIR / "data" / "Suzlon.csv",
}

# 🔄 Stock Name Aliases (Frontend -> Backend)
STOCK_ALIASES = {
    "ADANI POWER": "ADANI",
    "TATA GOLD ETF": "GOLD",
    "SILVER ETF": "SILVER"
}


class PredictRequest(BaseModel):
    stock: str



@app.get("/")
def home():
    return {"message": "ML Stock Prediction API is Running", "supported_stocks": list(DATA_FILES.keys())}

@app.post("/predict")
def predict(req: PredictRequest):
    try:
        raw_stock = req.stock.upper()
        # Resolve alias if exists
        stock = STOCK_ALIASES.get(raw_stock, raw_stock)

        if stock not in MODELS:
            raise HTTPException(status_code=404, detail=f"Stock '{raw_stock}' not supported. Supported: {list(MODELS.keys()) + list(STOCK_ALIASES.keys())}")

        df = pd.read_csv(DATA_FILES[stock])
        df["Date"] = pd.to_datetime(df["Date"])
        df = df.sort_values("Date")
        
        obj = MODELS[stock]
        model = obj
        if isinstance(obj, dict):
            for v in obj.values():
                if hasattr(v, "predict"):
                    model = v
                    break

        n_features = getattr(model, "n_features_in_", 4)
        X_tomorrow = prepare_features(df, n_features=n_features)
        
        raw_prediction = float(model.predict(X_tomorrow)[0])
        current_price = float(df["Close"].iloc[-1])

        if abs(raw_prediction) > 2.0:
            predicted_return = (raw_prediction - current_price) / current_price
        else:
            predicted_return = raw_prediction

        signal = generate_signal(predicted_return)

        return {
            "stock": raw_stock,
            "current_price": round(current_price, 2),
            "predicted_return": round(predicted_return, 6),
            "signal": signal,
            "threshold": THRESHOLD
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Internal Server Error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal Server Error: {str(e)}"}
        )
