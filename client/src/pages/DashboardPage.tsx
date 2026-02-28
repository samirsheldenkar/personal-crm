import { useEffect, useState } from 'react';
import { remindersApi } from '../api';

export function DashboardPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const data = await remindersApi.list();
      setReminders(data);
    } catch (error) {
      console.error('Failed to load reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Dashboard</h1>
      
      <section className="dashboard-section">
        <h2>Upcoming Reminders</h2>
        {loading ? (
          <p>Loading...</p>
        ) : reminders.length === 0 ? (
          <p>No upcoming reminders</p>
        ) : (
          <div className="reminder-list">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="reminder-card">
                <p>{reminder.note || 'Keep in touch'}</p>
                {reminder.due_date && (
                  <small>Due: {new Date(reminder.due_date).toLocaleDateString()}</small>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
