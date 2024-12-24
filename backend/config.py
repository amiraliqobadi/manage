from fastapi.middleware.cors import CORSMiddleware
import logging.config
import yaml
from fastapi import FastAPI, Request, Depends, HTTPException
from datetime import datetime, timedelta

from routers import auth, product_managment, installments, check, day_income, cash_flow
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI(openapi_url=None, redoc_url=None)
app.mount("/static", StaticFiles(directory="./static"), name="static")

app.include_router(auth.router)
app.include_router(product_managment.router)
app.include_router(installments.router)
app.include_router(check.router)
app.include_router(day_income.router)
app.include_router(cash_flow.router)


origins = [
    "http://frytodashboard.ir",
    "http://193.151.140.110",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
