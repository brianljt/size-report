import sys
import os

if __name__ == "__main__":
    os.environ['FLASK_APP']="../backend"
    os.system("flask init-db")
    os.system("flask run")