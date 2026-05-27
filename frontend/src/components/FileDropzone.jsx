import { useRef, useState } from 'react'

export default function FileDropzone({ file, onFileSelect, accept = '.pptx', label = 'PPTX 파일을 드래그하거나 클릭해서 선택' }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFileSelect(f)
  }

  function handleChange(e) {
    const f = e.target.files[0]
    if (f) onFileSelect(f)
  }

  if (file) {
    return (
      <div className="dropzone-selected">
        <span>📄</span>
        <span>{file.name}</span>
        <button onClick={() => { onFileSelect(null); if (inputRef.current) inputRef.current.value = '' }}>✕</button>
      </div>
    )
  }

  return (
    <div
      className={`dropzone${dragging ? ' drag-over' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} />
      <span className="dropzone-icon">📎</span>
      <p className="dropzone-text">
        <strong>클릭</strong>하거나 파일을 드래그해서 업로드<br />
        <span style={{ fontSize: '0.78rem' }}>{label}</span>
      </p>
    </div>
  )
}
