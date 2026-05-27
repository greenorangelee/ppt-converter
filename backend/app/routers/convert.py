import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse

from ..services.ppt_service import convert_ppt
from .settings import load_settings

router = APIRouter()

TEMPLATE_PATH = "storage/template/template.pptx"


def _cleanup(*paths: str):
    for path in paths:
        try:
            if os.path.exists(path):
                os.remove(path)
        except Exception:
            pass


@router.post("/")
async def convert_presentation(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
):
    if not file.filename.lower().endswith(".pptx"):
        raise HTTPException(status_code=400, detail="PPTX 파일만 업로드 가능합니다.")

    if not os.path.exists(TEMPLATE_PATH):
        raise HTTPException(status_code=400, detail="회사 템플릿이 등록되지 않았습니다. 먼저 템플릿을 업로드해 주세요.")

    api_key = load_settings().get("api_key", "")
    if not api_key:
        raise HTTPException(status_code=400, detail="Claude API 키가 등록되지 않았습니다. 설정에서 먼저 등록해 주세요.")

    os.makedirs("storage/output", exist_ok=True)

    job_id = str(uuid.uuid4())
    input_path = f"storage/output/input_{job_id}.pptx"
    output_path = f"storage/output/output_{job_id}.pptx"

    content = await file.read()
    with open(input_path, "wb") as f:
        f.write(content)

    try:
        await convert_ppt(TEMPLATE_PATH, input_path, output_path, api_key)
    except ValueError as e:
        _cleanup(input_path, output_path)
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        _cleanup(input_path, output_path)
        raise HTTPException(status_code=500, detail=f"변환 중 오류가 발생했습니다: {str(e)}")

    original_stem = os.path.splitext(file.filename)[0]
    background_tasks.add_task(_cleanup, input_path, output_path)

    return FileResponse(
        output_path,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        filename=f"{original_stem}_converted.pptx",
    )
