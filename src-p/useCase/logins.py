import json
import os

def logins():
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    caminho_arquivo = os.path.join(BASE_DIR, "db", "logins.json")
    with open(caminho_arquivo, "r", encoding="utf-8") as j:
        return json.load(j)