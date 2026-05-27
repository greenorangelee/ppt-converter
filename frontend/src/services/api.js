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

export async function convertPPT(file, apiKey) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${BASE}/convert/`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey },
    body: fd,
  })
  await handleResponse(res)
  return res.blob()
}
