import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { remindersApi, contactsApi, searchApi, notesApi, relationshipsApi } from '../api';
import type { Contact, Note, Relationship, Reminder, SearchResult } from '../types';
import './DashboardPage.css';

interface BirthdayItem {
  id: string;
  contactId: string;
  contactName: string;
  ageTurning: number;
  nextBirthday: Date;
  daysUntil: number;
}

interface ActivityItem {
  id: string;
  type: 'note' | 'contact' | 'relationship';
  contactName: string;
  description: string;
  timestamp: string;
  contactId: string;
}

interface WidgetErrorBoundaryProps {
  title: string;
  children: ReactNode;
}

interface WidgetErrorBoundaryState {
  hasError: boolean;
}

class WidgetErrorBoundary extends Component<WidgetErrorBoundaryProps, WidgetErrorBoundaryState> {
  public state: WidgetErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): WidgetErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`Dashboard widget failed: ${this.props.title}`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="widget-state widget-error" role="alert">
          <p>Could not load {this.props.title.toLowerCase()}.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function getContactName(contact: Pick<Contact, 'first_name' | 'last_name'>) {
  return `${contact.first_name} ${contact.last_name || ''}`.trim();
}

function parseDateValue(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getUpcomingBirthdayInfo(contact: Contact): BirthdayItem | null {
  const birthdayDate = parseDateValue(contact.birthday);
  if (!birthdayDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const month = birthdayDate.getMonth();
  const day = birthdayDate.getDate();
  const nextBirthday = new Date(today.getFullYear(), month, day);

  if (nextBirthday < today) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }

  const oneDayMs = 24 * 60 * 60 * 1000;
  const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / oneDayMs);
  if (daysUntil < 0 || daysUntil > 30) {
    return null;
  }

  return {
    id: `birthday-${contact.id}`,
    contactId: contact.id,
    contactName: getContactName(contact),
    ageTurning: nextBirthday.getFullYear() - birthdayDate.getFullYear(),
    nextBirthday,
    daysUntil,
  };
}

function formatRelativeDays(daysUntil: number) {
  if (daysUntil === 0) return 'Today';
  if (daysUntil === 1) return 'Tomorrow';
  return `In ${daysUntil} days`;
}

function formatActivityTime(timestamp: string) {
  const date = parseDateValue(timestamp);
  return date ? date.toLocaleString() : 'Unknown time';
}

function getRelationshipDescription(relationship: Relationship, contactsById: Map<string, Contact>) {
  const fromName = relationship.from_first_name
    ? `${relationship.from_first_name} ${relationship.from_last_name || ''}`.trim()
    : getContactName(contactsById.get(relationship.from_contact_id) || { first_name: 'Unknown', last_name: null });

  const toName = relationship.to_first_name
    ? `${relationship.to_first_name} ${relationship.to_last_name || ''}`.trim()
    : getContactName(contactsById.get(relationship.to_contact_id) || { first_name: 'Unknown', last_name: null });

  return {
    contactName: `${fromName} ↔ ${toName}`,
    description: `${fromName} is now connected to ${toName} (${relationship.type})`,
    contactId: relationship.from_contact_id,
  };
}

export function DashboardPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<BirthdayItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState({ total: 0, recent: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [birthdaysLoading, setBirthdaysLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [birthdaysError, setBirthdaysError] = useState<string | null>(null);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadBirthdaysAndActivity();
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const runSearch = async () => {
      if (!debouncedSearchQuery) {
        setSearchResults([]);
        setSearchError(null);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);
      setSearchError(null);

      try {
        const results = await searchApi.search(debouncedSearchQuery, 10);
        if (!isCancelled) {
          setSearchResults(results.results);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Search failed:', error);
          setSearchError('Could not complete search. Please try again.');
          setSearchResults([]);
        }
      } finally {
        if (!isCancelled) {
          setSearchLoading(false);
        }
      }
    };

    runSearch();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearchQuery]);

  const fetchAllContacts = async () => {
    const pageSize = 100;
    const firstPage = await contactsApi.list({ page: 1, limit: pageSize, sort: 'created_at', order: 'desc' });
    const collected = [...firstPage.contacts];
    const totalPages = Math.ceil(firstPage.total / pageSize);

    if (totalPages > 1) {
      const pageCalls: Promise<{ contacts: Contact[] }>[] = [];
      for (let page = 2; page <= totalPages; page += 1) {
        pageCalls.push(contactsApi.list({ page, limit: pageSize, sort: 'created_at', order: 'desc' }));
      }

      const remainingPages = await Promise.all(pageCalls);
      remainingPages.forEach((response) => {
        collected.push(...response.contacts);
      });
    }

    return { contacts: collected, total: firstPage.total };
  };

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

  const loadBirthdaysAndActivity = async () => {
    let contactsForWidgets: Contact[] = [];

    setBirthdaysLoading(true);
    setActivityLoading(true);
    setBirthdaysError(null);
    setActivityError(null);

    try {
      const { contacts } = await fetchAllContacts();
      contactsForWidgets = contacts;

      const birthdayItems = contactsForWidgets
        .map(getUpcomingBirthdayInfo)
        .filter((item): item is BirthdayItem => item !== null)
        .sort((a, b) => a.daysUntil - b.daysUntil);

      setUpcomingBirthdays(birthdayItems);
    } catch (error) {
      console.error('Failed to load upcoming birthdays:', error);
      setBirthdaysError('Could not load upcoming birthdays.');
    } finally {
      setBirthdaysLoading(false);
    }

    try {
      if (contactsForWidgets.length === 0) {
        const { contacts } = await fetchAllContacts();
        contactsForWidgets = contacts;
      }

      const contactsById = new Map(contactsForWidgets.map((contact) => [contact.id, contact]));

      const contactActivities: ActivityItem[] = contactsForWidgets
        .filter((contact) => Boolean(parseDateValue(contact.created_at)))
        .map((contact) => ({
          id: `contact-${contact.id}`,
          type: 'contact',
          contactName: getContactName(contact),
          description: 'Contact created',
          timestamp: contact.created_at,
          contactId: contact.id,
        }));

      const relationships = await relationshipsApi.list();
      const relationshipActivities: ActivityItem[] = relationships
        .filter((relationship) => Boolean(parseDateValue(relationship.created_at)))
        .map((relationship) => {
          const relationDetails = getRelationshipDescription(relationship, contactsById);
          return {
            id: `relationship-${relationship.id}`,
            type: 'relationship',
            contactName: relationDetails.contactName,
            description: relationDetails.description,
            timestamp: relationship.created_at,
            contactId: relationDetails.contactId,
          };
        });

      const noteResults = await Promise.allSettled(
        contactsForWidgets.map(async (contact) => {
          const notes = await notesApi.listByContact(contact.id);
          return { contact, notes };
        }),
      );

      const noteActivities: ActivityItem[] = [];
      noteResults.forEach((result) => {
        if (result.status !== 'fulfilled') {
          return;
        }

        const { contact, notes } = result.value;
        notes.forEach((note: Note) => {
          if (!parseDateValue(note.created_at)) {
            return;
          }

          noteActivities.push({
            id: `note-${note.id}`,
            type: 'note',
            contactName: getContactName(contact),
            description: 'Note added',
            timestamp: note.created_at,
            contactId: contact.id,
          });
        });
      });

      const sortedActivity = [...contactActivities, ...relationshipActivities, ...noteActivities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

      setRecentActivity(sortedActivity);
    } catch (error) {
      console.error('Failed to load recent activity:', error);
      setActivityError('Could not load recent activity.');
    } finally {
      setActivityLoading(false);
    }
  };

  const getActivityLabel = (type: ActivityItem['type']) => {
    if (type === 'contact') return 'New Contact';
    if (type === 'relationship') return 'Relationship';
    return 'Note';
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

      <div className="dashboard-search">
        <input
          type="text"
          placeholder="Search contacts and notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-lg"
        />
      </div>

      {searchLoading && (
        <div className="widget-state">Searching…</div>
      )}

      {searchError && (
        <div className="widget-state widget-error" role="alert">
          {searchError}
        </div>
      )}

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

      {!searchLoading && !searchError && debouncedSearchQuery && searchResults.length === 0 && (
        <div className="widget-state">No search results found.</div>
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
        <WidgetErrorBoundary title="Upcoming reminders">
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
        </WidgetErrorBoundary>

        <WidgetErrorBoundary title="Recently added contacts">
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
        </WidgetErrorBoundary>

        <WidgetErrorBoundary title="Upcoming birthdays">
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Upcoming Birthdays</h2>
              <span className="widget-count">{upcomingBirthdays.length}</span>
            </div>
            {birthdaysLoading ? (
              <div className="widget-state">Loading birthdays...</div>
            ) : birthdaysError ? (
              <div className="widget-state widget-error" role="alert">{birthdaysError}</div>
            ) : upcomingBirthdays.length === 0 ? (
              <div className="empty-state">
                <p>No birthdays in the next 30 days</p>
              </div>
            ) : (
              <div className="birthday-list">
                {upcomingBirthdays.map((birthday) => (
                  <Link key={birthday.id} to={`/contacts/${birthday.contactId}`} className="birthday-card">
                    <div>
                      <h4>{birthday.contactName}</h4>
                      <p>{birthday.nextBirthday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="birthday-meta">
                      <strong>Turns {birthday.ageTurning}</strong>
                      <span>{formatRelativeDays(birthday.daysUntil)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </WidgetErrorBoundary>

        <WidgetErrorBoundary title="Recent activity">
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
              <span className="widget-count">{recentActivity.length}</span>
            </div>
            {activityLoading ? (
              <div className="widget-state">Loading activity...</div>
            ) : activityError ? (
              <div className="widget-state widget-error" role="alert">{activityError}</div>
            ) : recentActivity.length === 0 ? (
              <div className="empty-state">
                <p>No activity yet</p>
              </div>
            ) : (
              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <Link key={activity.id} to={`/contacts/${activity.contactId}`} className="activity-item">
                    <div className="activity-header-row">
                      <span className="badge">{getActivityLabel(activity.type)}</span>
                      <small>{formatActivityTime(activity.timestamp)}</small>
                    </div>
                    <h4>{activity.contactName}</h4>
                    <p>{activity.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </WidgetErrorBoundary>
      </div>
    </div>
  );
}
