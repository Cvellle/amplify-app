import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

type Item = Schema['Item']['type'];
type Status = 'ACTIVE' | 'DONE' | 'ARCHIVED';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

const PRIORITY_COLORS: Record<Priority, string> = {
  HIGH: '#e53e3e',
  MEDIUM: '#d69e2e',
  LOW: '#38a169',
};

const STATUS_LABELS: Record<Status, string> = {
  ACTIVE: '🔵 Active',
  DONE: '✅ Done',
  ARCHIVED: '📦 Archived',
};

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [filter, setFilter] = useState<Status | 'ALL'>('ALL');
  const [adding, setAdding] = useState(false);

  // Real-time subscription — updates list instantly when data changes
  useEffect(() => {
    const sub = client.models.Item.observeQuery().subscribe({
      next: ({ items }) => {
        setItems([...items].sort((a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        ));
        setLoading(false);
      },
      error: (err) => {
        console.error('Subscription error:', err);
        setLoading(false);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return;
    setAdding(true);
    try {
      await client.models.Item.create({
        title: title.trim(),
        description: description.trim() || undefined,
        status: 'ACTIVE',
        priority,
      });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
    } catch (err) {
      console.error('Failed to create item:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleStatusChange = async (id: string, status: Status) => {
    await client.models.Item.update({ id, status });
  };

  const handleDelete = async (id: string) => {
    await client.models.Item.delete({ id });
  };

  const filtered = filter === 'ALL' ? items : items.filter((i) => i.status === filter);

  return (
    <div className="item-list-container">
      {/* Add Form */}
      <div className="add-form">
        <h2>Add Item</h2>
        <input
          className="input"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <input
          className="input"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="form-row">
          <select
            className="select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="LOW">🟢 Low Priority</option>
            <option value="MEDIUM">🟡 Medium Priority</option>
            <option value="HIGH">🔴 High Priority</option>
          </select>
          <button className="btn-primary" onClick={handleAdd} disabled={adding || !title.trim()}>
            {adding ? 'Adding...' : '+ Add Item'}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {(['ALL', 'ACTIVE', 'DONE', 'ARCHIVED'] as const).map((s) => (
          <button
            key={s}
            className={`filter-tab ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL' ? `All (${items.length})` : `${STATUS_LABELS[s as Status]} (${items.filter(i => i.status === s).length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="empty">No items here. Add one above!</p>
      ) : (
        <ul className="items">
          {filtered.map((item) => (
            <li key={item.id} className={`item-card ${item.status?.toLowerCase()}`}>
              <div className="item-header">
                <span
                  className="priority-dot"
                  style={{ background: PRIORITY_COLORS[item.priority as Priority] ?? '#999' }}
                  title={item.priority ?? ''}
                />
                <strong className="item-title">{item.title}</strong>
                <span className="item-status">{STATUS_LABELS[item.status as Status] ?? item.status}</span>
              </div>
              {item.description && <p className="item-desc">{item.description}</p>}
              <div className="item-actions">
                {item.status !== 'DONE' && (
                  <button className="btn-done" onClick={() => handleStatusChange(item.id, 'DONE')}>
                    ✅ Mark Done
                  </button>
                )}
                {item.status !== 'ARCHIVED' && (
                  <button className="btn-archive" onClick={() => handleStatusChange(item.id, 'ARCHIVED')}>
                    📦 Archive
                  </button>
                )}
                {item.status === 'ARCHIVED' && (
                  <button className="btn-restore" onClick={() => handleStatusChange(item.id, 'ACTIVE')}>
                    🔄 Restore
                  </button>
                )}
                <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
