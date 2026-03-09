
from scripts.fetch_and_clean_data import run as fetch_and_clean
from scripts.train_models import train_all_models

def run():

    fetch_and_clean()

    train_all_models()

    print("Pipeline finished")


if __name__ == "__main__":
    run()