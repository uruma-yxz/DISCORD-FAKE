from fastapi import HTTPException

def erroHttpNone(conteudo, status: int, detail: dict | str):
  if conteudo is None:
    raise HTTPException(status_code=status, detail=detail)


def erroHttpNot(conteudo, status: int, detail: dict | str):
  if not conteudo:
    raise HTTPException(status_code=status, detail=detail)