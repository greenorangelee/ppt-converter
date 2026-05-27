import { useState } from 'react'
import FileDropzone from '../components/FileDropzone'
import { convertPPT } from '../services/api'

export default function ConvertPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  async function handleConvert() {
    if (!file) return
    setLoading(true)
    setMsg(null)
    try {
      const blob = await convertPPT(file)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${file.name.replace('.pptx', '')}_converted.pptx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setMsg({ type: 'success', text: '변환이 완료되었습니다. 파일이 다운로드됩니다.' })
      setFile(null)
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="card">
        <p className="card-title">PPT 변환</p>
        <p className="section-label">변환할 PPTX 파일</p>
        <FileDropzone file={file} onFileSelect={setFile} label="변환할 발표자료 .pptx" />

        {loading && (
          <div className="alert alert-info" style={{ marginTop: '1rem' }}>
            <span className="spinner" style={{ borderTopColor: '#2b6cb0', borderColor: 'rgba(43,108,176,0.3)' }} />&nbsp;
            Claude AI가 슬라이드를 분석하고 있습니다... (수십 초 소요될 수 있습니다)
          </div>
        )}

        <div className="btn-row">
          <button className="btn btn-primary" onClick={handleConvert} disabled={!file || loading}>
            {loading ? <><span className="spinner" /> 변환 중...</> : '템플릿 적용 후 다운로드'}
          </button>
        </div>

        {msg && !loading && (
          <div className={`alert alert-${msg.type}`}>{msg.text}</div>
        )}
      </div>

      <div className="card" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
        <p className="card-title" style={{ color: '#92400e' }}>변환 안내</p>
        <ul style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li>텍스트 내용은 최대한 보존하며 회사 템플릿 레이아웃에 맞게 재배치합니다.</li>
          <li>이미지, 차트, 표는 현재 버전에서 지원하지 않습니다.</li>
          <li>변환 품질은 원본 PPT의 구조와 등록된 템플릿의 레이아웃 수에 따라 달라집니다.</li>
        </ul>
      </div>
    </>
  )
}
