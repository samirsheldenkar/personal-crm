import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contactsApi, notesApi, relationshipsApi } from '../api';
import { RelationshipGraph } from '../components/RelationshipGraph';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import type { ContactEmail, ContactPhone, ContactGraph, ContactWithDetails, Note } from '../types';
import './ContactDetailPage.css';

export function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<ContactWithDetails | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [graph, setGraph] = useState<ContactGraph | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'relationships'>('overview');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return fallback;
  };

  useEffect(() => {
    if (id) {
      loadContactData();
    }
  }, [id]);

  const loadContactData = async () => {
    if (!id) {
      setLoadError('Missing contact ID.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(null);

    try {
      const [contactData, notesData, graphData] = await Promise.all([
        contactsApi.getById(id!),
        notesApi.listByContact(id!),
        relationshipsApi.getGraph(id!),
      ]);
      setContact(contactData);
      setNotes(notesData);
      setGraph(graphData);
    } catch (error) {
      console.error('Failed to load contact:', error);
      setLoadError(getErrorMessage(error, 'Could not load this contact. Please try again.'));
      setContact(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    try {
      setActionError(null);
      await notesApi.create(id!, { body: newNote });
      setNewNote('');
      const notesData = await notesApi.listByContact(id!);
      setNotes(notesData);
    } catch (error) {
      console.error('Failed to add note:', error);
      setActionError(getErrorMessage(error, 'Could not add note. Please try again.'));
    }
  };
  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (contact) {
      try {
        setActionError(null);
        await contactsApi.delete(contact.id);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete contact:', error);
        setActionError(getErrorMessage(error, 'Could not delete contact. Please try again.'));
      }
    }
  };
  const handleNodeClick = (contactId: string) => {
    navigate(`/contacts/${contactId}`);
  };



  if (loading) {
    return (
      <div className="page">
        <div className="detail-loading" aria-label="Loading contact details">
          <div className="detail-skeleton detail-skeleton-header" />
          <div className="detail-skeleton detail-skeleton-tabs" />
          <div className="detail-skeleton detail-skeleton-content" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page">
        <div className="detail-feedback detail-error" role="alert">
          <p>{loadError}</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadContactData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="page">
        <div className="detail-feedback">
          <p>Contact not found.</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate('/contacts')}>
            Back to contacts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="contact-header">
          <div className="contact-avatar large">
            {contact.first_name[0]}
            {contact.last_name?.[0]}
          </div>
          <div>
            <h1>{contact.first_name} {contact.last_name || ''}</h1>
            {contact.job_title && contact.company && (
              <p>{contact.job_title} at {contact.company}</p>
            )}
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-danger" 
              onClick={handleDelete}
            >
              Delete Contact
            </button>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes ({notes.length})
        </button>
        <button
          className={`tab ${activeTab === 'relationships' ? 'active' : ''}`}
          onClick={() => setActiveTab('relationships')}
        >
          Relationships
        </button>
      </div>

      <div className="tab-content">
        {actionError && (
          <div className="detail-feedback detail-error" role="alert">
            <p>{actionError}</p>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="contact-details-grid">
              {contact.company && (
                <div className="detail-item">
                  <label>Company</label>
                  <p>{contact.company}</p>
                </div>
              )}
              {contact.job_title && (
                <div className="detail-item">
                  <label>Job Title</label>
                  <p>{contact.job_title}</p>
                </div>
              )}
              {contact.birthday && (
                <div className="detail-item">
                  <label>Birthday</label>
                  <p>{new Date(contact.birthday).toLocaleDateString()}</p>
                </div>
              )}
              {contact.emails?.map((email: ContactEmail, idx: number) => (
                <div className="detail-item" key={idx}>
                  <label>Email {email.label && `(${email.label})`}</label>
                  <p>{email.value}</p>
                </div>
              ))}
              {contact.phones?.map((phone: ContactPhone, idx: number) => (
                <div className="detail-item" key={idx}>
                  <label>Phone {phone.label && `(${phone.label})`}</label>
                  <p>{phone.value}</p>
                </div>
              ))}
            </div>

            {contact.tags?.length > 0 && (
              <div className="contact-tags-section">
                <h3>Tags</h3>
                <div className="tag-list">
                  {contact.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="badge"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="notes-tab">
            <form onSubmit={handleAddNote} className="add-note-form">
              <textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="input"
              />
              <button type="submit" className="btn btn-primary">
                Add Note
              </button>
            </form>

            <div className="notes-list">
              {notes.map((note) => (
                <div key={note.id} className="note-card">
                  <p>{note.body}</p>
                  <small>{new Date(note.created_at).toLocaleString()}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'relationships' && graph && (
          <div className="relationships-tab">
            <RelationshipGraph graph={graph} onNodeClick={handleNodeClick} />
          </div>
        )}

        {activeTab === 'relationships' && !graph && (
          <div className="detail-feedback">
            <p>No relationship graph data available yet.</p>
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? All associated data including notes and relationships will be permanently removed."
        itemName={contact ? `${contact.first_name} ${contact.last_name || ''}`.trim() : ''}
      />
    </div>
  );
}
