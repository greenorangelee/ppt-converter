import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .routers import template, convert

app = FastAPI(title="PPT Template Converter")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("storage/template", exist_ok=True)
os.makedirs("storage/output", exist_ok=True)

app.include_router(template.router, prefix="/api/template", tags=["template"])
app.include_router(convert.router, prefix="/api/convert", tags=["convert"])

app.mount("/storage", StaticFiles(directory="storage"), name="storage")


@app.get("/health")
def health():
    return {"status": "ok"}
