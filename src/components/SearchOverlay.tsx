import { useState, useEffect, useRef } from 'react'
import type { Item } from '../types'
import Card from './Card'

interface Props {
  open: boolean
  all: Item[]
  onClose: () => void
  onOpen: (item: Item) => void
}

export default function SearchOverlay({ open, all, onClose, onOpen }: Props) {
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  const results = q.length > 1
    ? all.filter(i => i.title.includes(q) || i.desc.includes(q)).slice(0, 40)
    : []

  return (
    <div className={`search-ovl${open ? ' on' : ''}`}>
      <div className="sinput-wrap">
        <input
          ref={inputRef}
          className="sinput"
          placeholder="جستجوی فیلم، سریال، انیمه..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button className="sclose-btn" onClick={onClose}>بستن</button>
      </div>
      <div className="sresults">
        {results.map(item => (
          <Card key={item.id} item={item} onOpen={i => { onClose(); onOpen(i) }} />
        ))}
        {q.length > 1 && !results.length && (
          <p style={{ color: 'var(--sub)', gridColumn: '1/-1', padding: '24px 0', textAlign: 'center' }}>
            نتیجه‌ای یافت نشد
          </p>
        )}
      </div>
    </div>
  )
}
