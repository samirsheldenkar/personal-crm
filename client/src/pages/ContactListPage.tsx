import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contactsApi, tagsApi } from '../api';

export function ContactListPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadData();
  }, [page, selectedTag]);

  const loadData = async () => {
    try {
      const [contactsData, tagsData] = await Promise.all([
        contactsApi.list({ 
          page, 
          limit, 
          search: search || undefined,
          tags: selectedTag || undefined 
        }),
        tagsApi.list(),
      ]);
      setContacts(contactsData.contacts);
      setTotal(contactsData.total);
      setTags(tagsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Contacts</h1>
        <button className="btn btn-primary" onClick={() => alert('Add contact - TODO')}>
          + Add Contact
        </button>
      </div>

      <div className="filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>

        <div className="tag-filter">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="input"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading contacts...</div>
      ) : contacts.length === 0 ? (
        <div className="empty-state">
          <h3>No contacts found</h3>
          <p>Get started by adding your first contact</p>
          <button className="btn btn-primary" onClick={() => alert('Add contact - TODO')}>
            Add Contact
          </button>
        </div>
      ) : (
        <>
          <div className="contact-grid">
            {contacts.map((contact) => (
              <Link
                key={contact.id}
                to={`/contacts/${contact.id}`}
                className="contact-card"
              >
                <div className="contact-card-header">
                  <div className="contact-avatar">
                    {contact.first_name[0]}
                    {contact.last_name?.[0]}
                  </div>
                  <div className="contact-card-info">
                    <h3>{contact.first_name} {contact.last_name || ''}</h3>
                    {contact.job_title && (
                      <p className="contact-job">{contact.job_title}</p>
                    )}
                  </div>
                </div>
                
                {contact.company && (
                  <p className="contact-company">{contact.company}</p>
                )}
                
                {contact.emails?.length > 0 && (
                  <p className="contact-email">{contact.emails[0].value}</p>
                )}
                
                {contact.phones?.length > 0 && (
                  <p className="contact-phone">{contact.phones[0].value}</p>
                )}
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-sm btn-secondary"
              >
                Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-sm btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
