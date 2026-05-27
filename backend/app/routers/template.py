import os
from fastapi import APIRouter, UploadFile, File, HTTPException

from ..services.ppt_service import get_template_info

router = APIRouter()

TEMPLATE_PATH = "storage/template/template.pptx"


@router.post("/upload")
async def upload_template(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pptx"):
        raise HTTPException(status_code=400, detail="PPTX 파일만 업로드 가능합니다.")

    os.makedirs("storage/template", exist_ok=True)

    content = await file.read()
    with open(TEMPLATE_PATH, "wb") as f:
        f.write(content)

    info = get_template_info(TEMPLATE_PATH)
    return {"message": "템플릿이 업로드되었습니다.", "info": info}


@router.get("/info")
def get_info():
    if not os.path.exists(TEMPLATE_PATH):
        return {"exists": False}
    info = get_template_info(TEMPLATE_PATH)
    return {"exists": True, "info": info}


@router.delete("/")
def delete_template():
    if os.path.exists(TEMPLATE_PATH):
        os.remove(TEMPLATE_PATH)
    return {"message": "템플릿이 삭제되었습니다."}
