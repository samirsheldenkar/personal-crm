import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { remindersApi, contactsApi, searchApi } from '../api';
import type { Contact, Reminder, SearchResult } from '../types';
import './DashboardPage.css';

export function DashboardPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState({ total: 0, recent: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [remindersData, contactsData] = await Promise.all([
        remindersApi.list(),
        contactsApi.list({ limit: 5, sort: 'created_at', order: 'desc' }),
      ]);
      setReminders(remindersData);
      setRecentContacts(contactsData.contacts);
      setStats({ total: contactsData.total, recent: contactsData.contacts.length });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      const results = await searchApi.search(searchQuery, 5);
      setSearchResults(results.results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  return (
    <div className="page dashboard-page">
      <header className="dashboard-header">
        <h1>{getGreeting()}</h1>
        <p>Here's what's happening with your contacts</p>
      </header>

      <form onSubmit={handleSearch} className="dashboard-search">
        <input
          type="text"
          placeholder="Search contacts and notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-lg"
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {searchResults.length > 0 && (
        <section className="dashboard-section search-results">
          <h2>Search Results</h2>
          <div className="search-results-list">
            {searchResults.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                to={`/contacts/${result.contactId}`}
                className="search-result-item"
              >
                <span className="badge">{result.type}</span>
                <h4>{result.title}</h4>
                <p>{result.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Contacts</p>
        </div>
        <div className="stat-card">
          <h3>{reminders.length}</h3>
          <p>Upcoming Reminders</p>
        </div>
        <div className="stat-card">
          <h3>{stats.recent}</h3>
          <p>Recently Added</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Upcoming Reminders</h2>
            <Link to="/contacts" className="btn btn-sm btn-secondary">View All</Link>
          </div>
          {reminders.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming reminders</p>
              <Link to="/contacts" className="btn btn-primary">Add Reminder</Link>
            </div>
          ) : (
            <div className="reminder-list">
              {reminders.slice(0, 5).map((reminder) => (
                <div key={reminder.id} className="reminder-card">
                  <p>{reminder.note || 'Keep in touch'}</p>
                  {reminder.due_date && (
                    <small className="due-date">
                      Due: {new Date(reminder.due_date).toLocaleDateString()}
                    </small>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Recently Added</h2>
            <Link to="/contacts" className="btn btn-sm btn-secondary">View All</Link>
          </div>
          {recentContacts.length === 0 ? (
            <div className="empty-state">
              <p>No contacts yet</p>
              <Link to="/contacts" className="btn btn-primary">Add Contact</Link>
            </div>
          ) : (
            <div className="contact-list">
              {recentContacts.map((contact) => (
                <Link
                  key={contact.id}
                  to={`/contacts/${contact.id}`}
                  className="contact-list-item"
                >
                  <div className="contact-avatar">
                    {contact.first_name[0]}
                    {contact.last_name?.[0]}
                  </div>
                  <div className="contact-info">
                    <h4>{contact.first_name} {contact.last_name || ''}</h4>
                    {contact.company && <p>{contact.company}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
