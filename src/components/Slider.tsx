import { useRef } from 'react'
import type { Category, Item } from '../types'
import Card from './Card'

interface Props {
  cat: Category
  items: Item[]
  onOpen: (item: Item) => void
}

export default function Slider({ cat, items, onOpen }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  const slide = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    const w = el.querySelector<HTMLElement>('.card')?.offsetWidth || 150
    el.scrollBy({ left: dir * w * 3 * -1, behavior: 'smooth' })
  }

  return (
    <div className="row">
      <div className="row-head">
        <h3 className="row-title">{cat.icon} {cat.label}</h3>
        <span className="row-more">مشاهده همه
          <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 2.5, display: 'inline', marginRight: 3 }}>
            <path d="m15 18-6-6 6-6" />
          </svg>
        </span>
      </div>
      <div className="slider">
        <div className="slider-track" ref={trackRef}>
          {items.map(item => <Card key={item.id} item={item} onOpen={onOpen} />)}
        </div>
        <button className="sl-btn sl-prev" onClick={() => slide(-1)}>
          <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
        </button>
        <button className="sl-btn sl-next" onClick={() => slide(1)}>
          <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
        </button>
      </div>
    </div>
  )
}
