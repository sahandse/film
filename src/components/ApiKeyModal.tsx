import { useState } from 'react'

interface Props {
  currentKey: string
  onSave: (key: string) => void
  onClose: () => void
}

export default function ApiKeyModal({ currentKey, onSave, onClose }: Props) {
  const [key, setKey] = useState(currentKey)

  return (
    <div className="movl on" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-body" style={{ padding: '32px 24px' }}>
          <button className="modal-close" onClick={onClose}>✕</button>
          <h2 style={{ marginBottom: 10, color: '#fff', fontSize: 20 }}>🔑 کلید TMDB</h2>
          <p style={{ color: 'var(--sub)', fontSize: 13, marginBottom: 20, lineHeight: 1.8 }}>
            برای نمایش فیلم‌ها و سریال‌ها به کلید API رایگان TMDB نیاز دارید.<br />
            در <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer"
              style={{ color: 'var(--accent)' }}>themoviedb.org</a> ثبت‌نام کنید و کلید v3 بگیرید.
          </p>
          <input
            type="text"
            className="sinput"
            style={{ width: '100%', marginBottom: 16, direction: 'ltr', textAlign: 'left' }}
            placeholder="کلید API v3 را اینجا بچسبانید..."
            value={key}
            onChange={e => setKey(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="hbtn hbtn-info" onClick={onClose}>انصراف</button>
            <button
              className="hbtn hbtn-play"
              disabled={!key.trim()}
              onClick={() => key.trim() && onSave(key.trim())}
            >
              ذخیره
            </button>
          </div>
          {currentKey && (
            <p style={{ color: 'var(--sub)', fontSize: 11, marginTop: 12, textAlign: 'center' }}>
              کلید فعلی: {currentKey.slice(0, 6)}...{currentKey.slice(-4)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
