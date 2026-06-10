import type { Item } from '../types'
import Card from './Card'

interface Props {
  items: Item[]
  onOpen: (item: Item) => void
  emptyMsg?: string
}

export default function FullGrid({ items, onOpen, emptyMsg }: Props) {
  if (!items.length) {
    return (
      <div className="no-content" style={{ padding: '60px 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
        <p>{emptyMsg ?? 'در حال بارگذاری...'}</p>
      </div>
    )
  }
  return (
    <div className="full-grid">
      {items.map(item => <Card key={item.id} item={item} onOpen={onOpen} gridMode />)}
    </div>
  )
}
