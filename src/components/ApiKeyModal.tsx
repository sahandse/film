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
      <div
        className="modal api-key-modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 460 }}
      >
        <div className="modal-body" style={{ padding: '32px 24px' }}>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
          <h2 style={{ marginBottom: 12, color: '#fff' }}>🔑 کلید TMDB</h2>
          <p
            style={{
              color: 'var(--sub)',
              fontSize: 13,
              marginBottom: 20,
              lineHeight: 1.7,
            }}
          >
            برای نمایش فیلم‌ها و سریال‌ها به کلید API رایگان TMDB نیاز دارید.
            <br />
            از{' '}
            <a
              href="https://www.themoviedb.org/settings/api"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--accent)' }}
            >
              themoviedb.org
            </a>{' '}
            ثبت‌نام کرده و کلید رایگان بگیرید.
          </p>
          <input
            type="text"
            className="sinput"
            style={{ width: '100%', marginBottom: 16, boxSizing: 'border-box' }}
            placeholder="کلید API v3 را اینجا بچسبانید..."
            value={key}
            onChange={e => setKey(e.target.value)}
            dir="ltr"
          />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="hbtn hbtn-info" onClick={onClose}>
              انصراف
            </button>
            <button
              className="hbtn hbtn-play"
              onClick={() => {
                const trimmed = key.trim()
                if (trimmed) onSave(trimmed)
              }}
            >
              ذخیره
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
