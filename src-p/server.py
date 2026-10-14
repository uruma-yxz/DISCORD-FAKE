from fastapi import FastAPI
from controllers.route import appRouter
import uvicorn

app = FastAPI(docs_url=None,redoc_url=None)
app.include_router(appRouter)

if __name__ == "__main__":
    uvicorn.run(app,host="0.0.0.0",port=7777)