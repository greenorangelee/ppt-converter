import { useState, useEffect } from 'react'
import FileDropzone from '../components/FileDropzone'
import { getTemplateInfo, uploadTemplate, deleteTemplate, getApiKeyStatus, saveApiKey, deleteApiKey } from '../services/api'

export default function TemplatePage() {
  const [templateInfo, setTemplateInfo] = useState(null)
  const [file, setFile] = useState(null)
  const [templateLoading, setTemplateLoading] = useState(false)
  const [templateMsg, setTemplateMsg] = useState(null)

  const [keyStatus, setKeyStatus] = useState(null)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [keyLoading, setKeyLoading] = useState(false)
  const [keyMsg, setKeyMsg] = useState(null)

  useEffect(() => {
    fetchTemplateInfo()
    fetchKeyStatus()
  }, [])

  async function fetchTemplateInfo() {
    try {
      setTemplateInfo(await getTemplateInfo())
    } catch {
      setTemplateInfo({ exists: false })
    }
  }

  async function fetchKeyStatus() {
    try {
      setKeyStatus(await getApiKeyStatus())
    } catch {
      setKeyStatus({ set: false, masked: null })
    }
  }

  async function handleUpload() {
    if (!file) return
    setTemplateLoading(true)
    setTemplateMsg(null)
    try {
      await uploadTemplate(file)
      setFile(null)
      setTemplateMsg({ type: 'success', text: '템플릿이 성공적으로 등록되었습니다.' })
      await fetchTemplateInfo()
    } catch (e) {
      setTemplateMsg({ type: 'error', text: e.message })
    } finally {
      setTemplateLoading(false)
    }
  }

  async function handleDeleteTemplate() {
    if (!confirm('등록된 템플릿을 삭제하시겠습니까?')) return
    setTemplateLoading(true)
    setTemplateMsg(null)
    try {
      await deleteTemplate()
      setTemplateMsg({ type: 'success', text: '템플릿이 삭제되었습니다.' })
      await fetchTemplateInfo()
    } catch (e) {
      setTemplateMsg({ type: 'error', text: e.message })
    } finally {
      setTemplateLoading(false)
    }
  }

  async function handleSaveKey() {
    if (!apiKeyInput.trim()) return
    setKeyLoading(true)
    setKeyMsg(null)
    try {
      await saveApiKey(apiKeyInput.trim())
      setApiKeyInput('')
      setShowKey(false)
      setKeyMsg({ type: 'success', text: 'API 키가 저장되었습니다.' })
      await fetchKeyStatus()
    } catch (e) {
      setKeyMsg({ type: 'error', text: e.message })
    } finally {
      setKeyLoading(false)
    }
  }

  async function handleDeleteKey() {
    if (!confirm('등록된 API 키를 삭제하시겠습니까?')) return
    setKeyLoading(true)
    setKeyMsg(null)
    try {
      await deleteApiKey()
      setKeyMsg({ type: 'success', text: 'API 키가 삭제되었습니다.' })
      await fetchKeyStatus()
    } catch (e) {
      setKeyMsg({ type: 'error', text: e.message })
    } finally {
      setKeyLoading(false)
    }
  }

  const hasTemplate = templateInfo?.exists

  return (
    <>
      {/* ── Template ── */}
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
            <button className="btn btn-danger" onClick={handleDeleteTemplate} disabled={templateLoading}>삭제</button>
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
          <button className="btn btn-primary" onClick={handleUpload} disabled={!file || templateLoading}>
            {templateLoading ? <><span className="spinner" /> 업로드 중...</> : '템플릿 등록'}
          </button>
        </div>
        {templateMsg && <div className={`alert alert-${templateMsg.type}`}>{templateMsg.text}</div>}
      </div>

      {/* ── API Key ── */}
      <div className="card">
        <p className="card-title">Claude API 키</p>

        {keyStatus === null ? (
          <p className="status-meta">불러오는 중...</p>
        ) : keyStatus.set ? (
          <div className="template-status">
            <div className="status-dot green" />
            <div className="status-info">
              <p className="status-name">API 키 등록됨</p>
              <p className="status-meta">{keyStatus.masked}</p>
            </div>
            <button className="btn btn-danger" onClick={handleDeleteKey} disabled={keyLoading}>삭제</button>
          </div>
        ) : (
          <div className="template-status none">
            <div className="status-dot yellow" />
            <div className="status-info">
              <p className="status-name">API 키 미등록</p>
              <p className="status-meta">아래에서 Claude API 키를 등록해 주세요.</p>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.2rem' }}>
          <p className="section-label">{keyStatus?.set ? 'API 키 교체' : 'API 키 등록'}</p>
          <div className="api-key-field">
            <input
              type={showKey ? 'text' : 'password'}
              placeholder="sk-ant-..."
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              spellCheck={false}
            />
            <button className="btn btn-secondary" onClick={() => setShowKey(v => !v)}>
              {showKey ? '숨기기' : '표시'}
            </button>
          </div>
          <p className="api-key-hint">키는 서버에 저장되며 브라우저로 다시 전송되지 않습니다.</p>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={handleSaveKey} disabled={!apiKeyInput.trim() || keyLoading}>
              {keyLoading ? <><span className="spinner" /> 저장 중...</> : 'API 키 저장'}
            </button>
          </div>
        </div>

        {keyMsg && <div className={`alert alert-${keyMsg.type}`}>{keyMsg.text}</div>}
      </div>
    </>
  )
}
