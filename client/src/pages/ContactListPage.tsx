import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contactsApi, tagsApi } from '../api';
import type { Contact, Tag } from '../types';
import './ContactListPage.css';
import { CreateContactModal } from '../components/CreateContactModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

export function ContactListPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  useEffect(() => {
    loadData();
  }, [page, selectedTag]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<{id: string, name: string} | null>(null);

  const handleDelete = (e: React.MouseEvent, contact: Contact) => {
    e.preventDefault();
    e.stopPropagation();
    setContactToDelete({
      id: contact.id,
      name: `${contact.first_name} ${contact.last_name || ''}`.trim()
    });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (contactToDelete) {
      try {
        await contactsApi.delete(contactToDelete.id);
        setDeleteModalOpen(false);
        setContactToDelete(null);
        loadData();
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };


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
        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
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
          <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
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
                <button 
                  className="contact-card-delete"
                  onClick={(e) => handleDelete(e, contact)}
                  aria-label="Delete contact"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
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
      {isCreateModalOpen && (
        <CreateContactModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            loadData();
          }}
        />
      )}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setContactToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? All associated data including notes and relationships will be permanently removed."
        itemName={contactToDelete?.name}
      />
    </div>
  );
}
