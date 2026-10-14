import json
import os

def writeFile(dados):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    caminho_arquivo = os.path.join(BASE_DIR, "db", "logins.json")
    with open(caminho_arquivo,"w",encoding="utf-8") as j:
        json.dump(dados,j,ensure_ascii=False,indent=2)