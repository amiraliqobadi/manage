from fastapi.middleware.cors import CORSMiddleware
import logging.config
import yaml
from fastapi import FastAPI, Request, Depends, HTTPException
from datetime import datetime, timedelta

from routers import auth, product_managment
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router)
app.include_router(product_managment.router)

allow_origins = (["http://localhost:5173"], ["*"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


logger = logging.getLogger(__name__)


@app.middleware("http")
async def request_middleware(request: Request, call_next):
    start_time = datetime.now()
    response = await call_next(request)
    process_time = (datetime.now() - start_time).total_seconds()
    ip = request.client.host
    logger.info(
        f"{request.method} {request.url} - {ip} - {process_time}s",
        extra={"request": request, "response": response},
    )
    return response