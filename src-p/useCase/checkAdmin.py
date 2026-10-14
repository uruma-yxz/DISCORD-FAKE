def checkAdmin(username:str,password:str) -> bool:
    if username == "admin" and password == "admin@123":
        return True
    return False