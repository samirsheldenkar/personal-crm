import { useEffect, useState } from 'react';
import { tagsApi, customFieldsApi } from '../api';
import type { CustomField, Tag } from '../types';
import { getErrorMessage } from '../utils/getErrorMessage';
import './SettingsPage.css';

export function SettingsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [activeTab, setActiveTab] = useState<'tags' | 'fields'>('tags');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [tagsData, fieldsData] = await Promise.all([
        tagsApi.list(),
        customFieldsApi.list(),
      ]);
      setTags(tagsData);
      setCustomFields(fieldsData);
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError(getErrorMessage(err, 'Could not load settings. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <h1>Settings</h1>
        <div className="settings-loading" aria-label="Loading settings">
          <div className="loading-skeleton" style={{ height: '44px', marginBottom: '1.5rem' }} />
          <div className="loading-skeleton" style={{ height: '400px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {error && (
        <div className="settings-error" role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadData}>
            Retry
          </button>
        </div>
      )}

      <div className="settings-nav">
        <button
          className={`tab ${activeTab === 'tags' ? 'active' : ''}`}
          onClick={() => setActiveTab('tags')}
        >
          Tags
        </button>
        <button
          className={`tab ${activeTab === 'fields' ? 'active' : ''}`}
          onClick={() => setActiveTab('fields')}
        >
          Custom Fields
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'tags' && (
          <div>
            <h2>Tags</h2>
            {tags.length === 0 ? (
              <p className="empty-text">No tags defined yet.</p>
            ) : (
              <div className="tag-list">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="tag-item"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'fields' && (
          <div>
            <h2>Custom Fields</h2>
            {customFields.length === 0 ? (
              <p className="empty-text">No custom fields defined yet.</p>
            ) : (
              <div className="custom-field-list">
                {customFields.map((field) => (
                  <div key={field.id} className="field-item">
                    <strong>{field.name}</strong>
                    <span className="badge">{field.field_type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
