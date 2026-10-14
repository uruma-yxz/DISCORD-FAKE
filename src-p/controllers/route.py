from fastapi import APIRouter, HTTPException, status
from useCase.checkAdmin import checkAdmin
from useCase.logins import logins
from useCase.writeJson import writeFile
from model.modelUsersLogin import ModelUsers

appRouter = APIRouter(prefix="/api/v1")

@appRouter.get("/health")
def health():
    return {"status": "ok"}

@appRouter.get("/admin")
def Paneladmin(user:str,password:str):
    check = checkAdmin(user,password)
    if check == True:
        return logins()
    return "Not Admin"

@appRouter.post("/login", status_code=201)
def sendLogin(users: ModelUsers):
    existing = logins()
    payload = users.model_dump()

    existing.append(payload)
    writeFile(existing)

    return {
        "message": "sucesso",
        "saved_user": payload,
        "total_users": len(existing),
    }