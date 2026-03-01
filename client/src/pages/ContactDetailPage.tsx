import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contactsApi, notesApi, relationshipsApi } from '../api';
import type { CreateContactInput } from '../api/contacts';
import { RelationshipGraph } from '../components/RelationshipGraph';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import type { ContactEmail, ContactPhone, ContactAddress, ContactGraph, ContactWithDetails, Note } from '../types';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CreateContactInput>>({});

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
  const startEditing = () => {
    if (!contact) return;
    setEditForm({
      firstName: contact.first_name,
      lastName: contact.last_name || undefined,
      company: contact.company || undefined,
      jobTitle: contact.job_title || undefined,
      birthday: contact.birthday ? new Date(contact.birthday).toISOString().split('T')[0] : undefined,
      emails: contact.emails ? [...contact.emails] : [],
      phones: contact.phones ? [...contact.phones] : [],
      addresses: contact.addresses ? [...contact.addresses] : [],
      socialLinks: contact.social_links ? Object.fromEntries(Object.entries(contact.social_links).filter(([_, v]) => v !== undefined)) as Record<string, string> : {},
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({});
    setActionError(null);
  };

  const saveChanges = async () => {
    if (!contact) return;
    try {
      setActionError(null);
      await contactsApi.update(contact.id, editForm);
      const updatedContact = await contactsApi.getById(contact.id);
      setContact(updatedContact);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update contact:', error);
      setActionError(getErrorMessage(error, 'Could not update contact. Please try again.'));
    }
  };

  const updateEditForm = (field: keyof CreateContactInput, value: CreateContactInput[keyof CreateContactInput]) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (field: 'emails' | 'phones' | 'addresses', index: number, key: string, value: string) => {
    setEditForm(prev => {
      const array = [...((prev[field] as ContactEmail[] | ContactPhone[] | ContactAddress[] | undefined) ?? [])];
      array[index] = { ...array[index], [key]: value };
      return { ...prev, [field]: array };
    });
  };

  const addArrayItem = (field: 'emails' | 'phones' | 'addresses') => {
    setEditForm(prev => {
      const array = [...((prev[field] as ContactEmail[] | ContactPhone[] | ContactAddress[] | undefined) ?? [])];
      if (field === 'emails') array.push({ value: '', label: 'work' });
      if (field === 'phones') array.push({ value: '', label: 'mobile' });
      if (field === 'addresses') array.push({ street: '', city: '', state: '', zip: '', country: '', label: 'home' });
      return { ...prev, [field]: array };
    });
  };

  const removeArrayItem = (field: 'emails' | 'phones' | 'addresses', index: number) => {
    setEditForm(prev => {
      const array = [...((prev[field] as ContactEmail[] | ContactPhone[] | ContactAddress[] | undefined) ?? [])];
      array.splice(index, 1);
      return { ...prev, [field]: array };
    });
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
            {isEditing ? (
              <div className="edit-header-fields">
                <div className="edit-name-row">
                  <input
                    type="text"
                    className="input"
                    value={editForm.firstName || ''}
                    onChange={(e) => updateEditForm('firstName', e.target.value)}
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    className="input"
                    value={editForm.lastName || ''}
                    onChange={(e) => updateEditForm('lastName', e.target.value)}
                    placeholder="Last Name"
                  />
                </div>
                <div className="edit-job-row">
                  <input
                    type="text"
                    className="input"
                    value={editForm.jobTitle || ''}
                    onChange={(e) => updateEditForm('jobTitle', e.target.value)}
                    placeholder="Job Title"
                  />
                  <span className="at-separator">at</span>
                  <input
                    type="text"
                    className="input"
                    value={editForm.company || ''}
                    onChange={(e) => updateEditForm('company', e.target.value)}
                    placeholder="Company"
                  />
                </div>
              </div>
            ) : (
              <>
<h1>{contact.first_name} {contact.last_name || ''}</h1>
{contact.job_title && contact.company && (
<p>{contact.job_title} at {contact.company}</p>
            )}
              </>
            )}
</div>
          <div className="header-actions">
            {isEditing ? (
              <>
            <button 
                  className="btn btn-secondary" 
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={saveChanges}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-secondary" 
                  onClick={startEditing}
                >
                  Edit
                </button>
                <button
className="btn btn-danger"
onClick={handleDelete}
>
Delete Contact
            </button>
              </>
            )}
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
              {isEditing ? (
                <>
                  <div className="detail-item edit-section">
                    <label>Birthday</label>
                    <input
                      type="date"
                      className="input"
                      value={editForm.birthday || ''}
                      onChange={(e) => updateEditForm('birthday', e.target.value)}
                    />
                  </div>

                  <div className="detail-item edit-section full-width">
                    <label>Emails</label>
                    {editForm.emails?.map((email, idx) => (
                      <div key={idx} className="edit-row">
                        <input
                          type="email"
                          className="input"
                          value={email.value}
                          onChange={(e) => updateArrayItem('emails', idx, 'value', e.target.value)}
                          placeholder="Email Address"
                        />
                        <select
                          className="input select-short"
                          value={email.label || 'work'}
                          onChange={(e) => updateArrayItem('emails', idx, 'label', e.target.value)}
                        >
                          <option value="work">Work</option>
                          <option value="personal">Personal</option>
                          <option value="other">Other</option>
                        </select>
                        <button type="button" className="btn btn-icon" onClick={() => removeArrayItem('emails', idx)}>×</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => addArrayItem('emails')}>+ Add Email</button>
                  </div>

                  <div className="detail-item edit-section full-width">
                    <label>Phones</label>
                    {editForm.phones?.map((phone, idx) => (
                      <div key={idx} className="edit-row">
                        <input
                          type="tel"
                          className="input"
                          value={phone.value}
                          onChange={(e) => updateArrayItem('phones', idx, 'value', e.target.value)}
                          placeholder="Phone Number"
                        />
                        <select
                          className="input select-short"
                          value={phone.label || 'mobile'}
                          onChange={(e) => updateArrayItem('phones', idx, 'label', e.target.value)}
                        >
                          <option value="mobile">Mobile</option>
                          <option value="work">Work</option>
                          <option value="home">Home</option>
                          <option value="other">Other</option>
                        </select>
                        <button type="button" className="btn btn-icon" onClick={() => removeArrayItem('phones', idx)}>×</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => addArrayItem('phones')}>+ Add Phone</button>
                  </div>

                  <div className="detail-item edit-section full-width">
                    <label>Addresses</label>
                    {editForm.addresses?.map((addr, idx) => (
                      <div key={idx} className="edit-address-block">
                        <div className="edit-row">
                          <input
                            type="text"
                            className="input"
                            value={addr.street || ''}
                            onChange={(e) => updateArrayItem('addresses', idx, 'street', e.target.value)}
                            placeholder="Street"
                          />
                          <select
                            className="input select-short"
                            value={addr.label || 'home'}
                            onChange={(e) => updateArrayItem('addresses', idx, 'label', e.target.value)}
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                          <button type="button" className="btn btn-icon" onClick={() => removeArrayItem('addresses', idx)}>×</button>
                        </div>
                        <div className="edit-row">
                          <input
                            type="text"
                            className="input"
                            value={addr.city || ''}
                            onChange={(e) => updateArrayItem('addresses', idx, 'city', e.target.value)}
                            placeholder="City"
                          />
                          <input
                            type="text"
                            className="input"
                            value={addr.state || ''}
                            onChange={(e) => updateArrayItem('addresses', idx, 'state', e.target.value)}
                            placeholder="State"
                          />
                          <input
                            type="text"
                            className="input"
                            value={addr.zip || ''}
                            onChange={(e) => updateArrayItem('addresses', idx, 'zip', e.target.value)}
                            placeholder="Zip"
                          />
                          <input
                            type="text"
                            className="input"
                            value={addr.country || ''}
                            onChange={(e) => updateArrayItem('addresses', idx, 'country', e.target.value)}
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => addArrayItem('addresses')}>+ Add Address</button>
                  </div>
                  
                  <div className="detail-item edit-section full-width">
                    <label>Social Links</label>
                    <div className="edit-row">
                        <span className="input-prefix">LinkedIn</span>
                        <input
                          type="text"
                          className="input"
                          value={editForm.socialLinks?.linkedin || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, linkedin: e.target.value } }))}
                          placeholder="LinkedIn URL"
                        />
                    </div>
                    <div className="edit-row">
                        <span className="input-prefix">Twitter</span>
                        <input
                          type="text"
                          className="input"
                          value={editForm.socialLinks?.twitter || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, twitter: e.target.value } }))}
                          placeholder="Twitter URL"
                        />
                    </div>
                    <div className="edit-row">
                        <span className="input-prefix">Website</span>
                        <input
                          type="text"
                          className="input"
                          value={editForm.socialLinks?.website || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, website: e.target.value } }))}
                          placeholder="Website URL"
                        />
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                  {contact.addresses?.map((addr: ContactAddress, idx: number) => (
                    <div className="detail-item" key={idx}>
                      <label>Address {addr.label && `(${addr.label})`}</label>
                      <p>{[addr.street, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(', ')}</p>
            </div>
                  ))}
                  {contact.social_links && Object.entries(contact.social_links).map(([key, value]) => (
                     value && (
                      <div className="detail-item" key={key}>
                        <label>{key}</label>
                        <p><a href={value as string} target="_blank" rel="noopener noreferrer">{value as string}</a></p>
                      </div>
                     )
                  ))}
                </>
              )}
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
