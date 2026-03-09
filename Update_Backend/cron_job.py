
from scripts.fetch_and_clean_data import run as fetch_and_clean
from scripts.train_models import train_all_models

def run():
    print("Starting ML Pipeline...")
    
    print("Step 1: Fetching and cleaning data...")
    fetch_and_clean()
    
    print("Step 2: Training models...")
    train_all_models()

    print("Pipeline finished successfully.")



if __name__ == "__main__":
    run()