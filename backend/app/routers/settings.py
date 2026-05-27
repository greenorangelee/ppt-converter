import json
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

SETTINGS_PATH = "storage/settings.json"


def load_settings() -> dict:
    if not os.path.exists(SETTINGS_PATH):
        return {}
    with open(SETTINGS_PATH) as f:
        return json.load(f)


def save_settings(data: dict):
    os.makedirs("storage", exist_ok=True)
    with open(SETTINGS_PATH, "w") as f:
        json.dump(data, f)


class ApiKeyRequest(BaseModel):
    api_key: str


@router.get("/api-key")
def get_api_key_status():
    settings = load_settings()
    key = settings.get("api_key", "")
    if not key:
        return {"set": False, "masked": None}
    masked = key[:12] + "..." + key[-4:]
    return {"set": True, "masked": masked}


@router.post("/api-key")
def set_api_key(body: ApiKeyRequest):
    if not body.api_key.startswith("sk-ant-"):
        raise HTTPException(status_code=400, detail="유효한 Claude API 키를 입력해 주세요. (sk-ant- 로 시작)")
    settings = load_settings()
    settings["api_key"] = body.api_key
    save_settings(settings)
    return {"message": "API 키가 저장되었습니다."}


@router.delete("/api-key")
def delete_api_key():
    settings = load_settings()
    settings.pop("api_key", None)
    save_settings(settings)
    return {"message": "API 키가 삭제되었습니다."}
