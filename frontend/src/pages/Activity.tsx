import { useEffect, useState } from 'react';
import api from '@/utils/api';
import './Activity.css';
import type { User, Task, Project } from '@/types';

type ActivityEvent = {
  id: string;
  type: 'task' | 'project' | 'user';
  action: 'created' | 'updated' | 'deleted';
  entityName: string;
  user?: { id: string; name: string };
  createdAt: string;
};

export function Activity() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const res = await api.get<ActivityEvent[]>('/activity');
        setEvents(res.data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load activity', err);
        setError(err.message || 'Error fetching activity');
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="page-container">
      <h1>Activity</h1>

      {loading ? (
        <div className="loading">Loading recent events...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🕒</div>
          <h3>No recent activity</h3>
          <p>New events will appear here as your team works.</p>
        </div>
      ) : (
        <div className="activity-feed">
          {events.map((event) => (
            <div key={event.id} className={`activity-item ${event.type}`}>
              <div className="icon">
                {event.type === 'task' && '✅'}
                {event.type === 'project' && '📁'}
                {event.type === 'user' && '👤'}
              </div>
              <div className="content">
                <div className="message">
                  <strong>{event.user?.name || 'Someone'}</strong>{' '}
                  {event.action} a {event.type}: <strong>{event.entityName}</strong>
                </div>
                <div className="meta">{formatDate(event.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Activity;
