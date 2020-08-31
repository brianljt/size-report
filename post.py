import requests
import json
import os

def post_fake_data(data):
    url = "http://127.0.0.1:5000"
    r = requests.post(
        url="http://127.0.0.1:5000/getcommit",
        data=json.dumps(data),
        headers={'Content-type': 'application/json; charset=utf-8'}
    )
    print(r)


def load_json():
    path="./backend/json_generated"
    files = os.listdir(path)
    
    for file in files:
        if os.path.isdir(file):
            continue
        
        f = open(path + "/" + file, "r")
        data = json.load(f)

        post_fake_data(data)


if __name__ == "__main__":
    load_json()