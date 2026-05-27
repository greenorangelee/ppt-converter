import { useState } from 'react'
import TemplatePage from './pages/TemplatePage'
import ConvertPage from './pages/ConvertPage'

export default function App() {
  const [tab, setTab] = useState('template')

  return (
    <>
      <header className="app-header">
        <h1>PPT 템플릿 변환기</h1>
        <nav className="tab-nav">
          <button className={tab === 'template' ? 'active' : ''} onClick={() => setTab('template')}>
            템플릿 관리
          </button>
          <button className={tab === 'convert' ? 'active' : ''} onClick={() => setTab('convert')}>
            PPT 변환
          </button>
        </nav>
      </header>
      <main className="app-main">
        {tab === 'template' ? <TemplatePage /> : <ConvertPage />}
      </main>
    </>
  )
}
