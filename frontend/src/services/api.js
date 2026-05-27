const BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const body = await res.json()
      msg = body.detail || msg
    } catch {}
    throw new Error(msg)
  }
  return res
}

export async function getTemplateInfo() {
  const res = await fetch(`${BASE}/template/info`)
  return (await handleResponse(res)).json()
}

export async function uploadTemplate(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${BASE}/template/upload`, { method: 'POST', body: fd })
  return (await handleResponse(res)).json()
}

export async function deleteTemplate() {
  const res = await fetch(`${BASE}/template/`, { method: 'DELETE' })
  return (await handleResponse(res)).json()
}

export async function getApiKeyStatus() {
  const res = await fetch(`${BASE}/settings/api-key`)
  return (await handleResponse(res)).json()
}

export async function saveApiKey(apiKey) {
  const res = await fetch(`${BASE}/settings/api-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  })
  return (await handleResponse(res)).json()
}

export async function deleteApiKey() {
  const res = await fetch(`${BASE}/settings/api-key`, { method: 'DELETE' })
  return (await handleResponse(res)).json()
}

export async function convertPPT(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${BASE}/convert/`, { method: 'POST', body: fd })
  await handleResponse(res)
  return res.blob()
}
