import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contactsApi } from '../api';

export function ContactListPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await contactsApi.list();
      setContacts(data.contacts);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    `${contact.first_name} ${contact.last_name || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Contacts</h1>
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="contact-grid">
          {filteredContacts.map((contact) => (
            <Link
              key={contact.id}
              to={`/contacts/${contact.id}`}
              className="contact-card"
            >
              <h3>{contact.first_name} {contact.last_name || ''}</h3>
              {contact.company && <p>{contact.company}</p>}
              {contact.job_title && <p>{contact.job_title}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
