import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { contactsApi } from '../api';

export function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadContact();
    }
  }, [id]);

  const loadContact = async () => {
    try {
      const data = await contactsApi.getById(id!);
      setContact(data);
    } catch (error) {
      console.error('Failed to load contact:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  if (!contact) {
    return <div className="page">Contact not found</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{contact.first_name} {contact.last_name || ''}</h1>
      </div>

      <div className="contact-details">
        {contact.company && (
          <p><strong>Company:</strong> {contact.company}</p>
        )}
        {contact.job_title && (
          <p><strong>Job Title:</strong> {contact.job_title}</p>
        )}
        {contact.emails?.length > 0 && (
          <p><strong>Email:</strong> {contact.emails[0].value}</p>
        )}
        {contact.phones?.length > 0 && (
          <p><strong>Phone:</strong> {contact.phones[0].value}</p>
        )}
      </div>

      {contact.tags?.length > 0 && (
        <div className="contact-tags">
          <h3>Tags</h3>
          <div className="tag-list">
            {contact.tags.map((tag: any) => (
              <span key={tag.id} className="badge" style={{ backgroundColor: tag.color }}>
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
