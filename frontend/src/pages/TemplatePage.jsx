import { useState, useEffect } from 'react'
import FileDropzone from '../components/FileDropzone'
import { getTemplateInfo, uploadTemplate, deleteTemplate } from '../services/api'

export default function TemplatePage() {
  const [templateInfo, setTemplateInfo] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    fetchInfo()
  }, [])

  async function fetchInfo() {
    try {
      const data = await getTemplateInfo()
      setTemplateInfo(data)
    } catch {
      setTemplateInfo({ exists: false })
    }
  }

  async function handleUpload() {
    if (!file) return
    setLoading(true)
    setMsg(null)
    try {
      await uploadTemplate(file)
      setFile(null)
      setMsg({ type: 'success', text: '템플릿이 성공적으로 등록되었습니다.' })
      await fetchInfo()
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('등록된 템플릿을 삭제하시겠습니까?')) return
    setLoading(true)
    setMsg(null)
    try {
      await deleteTemplate()
      setMsg({ type: 'success', text: '템플릿이 삭제되었습니다.' })
      await fetchInfo()
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    } finally {
      setLoading(false)
    }
  }

  const hasTemplate = templateInfo?.exists

  return (
    <>
      <div className="card">
        <p className="card-title">현재 등록된 템플릿</p>

        {templateInfo === null ? (
          <p className="status-meta">불러오는 중...</p>
        ) : hasTemplate ? (
          <div className="template-status">
            <div className="status-dot green" />
            <div className="status-info">
              <p className="status-name">{templateInfo.info.filename}</p>
              <p className="status-meta">
                슬라이드 {templateInfo.info.slide_count}장 &middot; 레이아웃 {templateInfo.info.layout_count}종
              </p>
            </div>
            <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              삭제
            </button>
          </div>
        ) : (
          <div className="template-status none">
            <div className="status-dot yellow" />
            <div className="status-info">
              <p className="status-name">등록된 템플릿 없음</p>
              <p className="status-meta">아래에서 회사 공식 템플릿을 업로드해 주세요.</p>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <p className="card-title">{hasTemplate ? '템플릿 교체' : '템플릿 등록'}</p>
        <p className="section-label">회사 공식 PPTX 파일</p>
        <FileDropzone file={file} onFileSelect={setFile} label="회사 공식 템플릿 .pptx" />

        <div className="btn-row">
          <button className="btn btn-primary" onClick={handleUpload} disabled={!file || loading}>
            {loading ? <><span className="spinner" /> 업로드 중...</> : '템플릿 등록'}
          </button>
        </div>

        {msg && (
          <div className={`alert alert-${msg.type}`}>{msg.text}</div>
        )}
      </div>
    </>
  )
}
