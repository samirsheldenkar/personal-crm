import { useEffect, useState } from 'react';
import { tagsApi, customFieldsApi } from '../api';
import './SettingsPage.css';

export function SettingsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'tags' | 'fields'>('tags');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tagsData, fieldsData] = await Promise.all([
        tagsApi.list(),
        customFieldsApi.list(),
      ]);
      setTags(tagsData);
      setCustomFields(fieldsData);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  return (
    <div className="page">
      <h1>Settings</h1>

      <div className="settings-tabs">
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
            <div className="tag-list">
              {tags.map((tag) => (
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

        {activeTab === 'fields' && (
          <div>
            <h2>Custom Fields</h2>
            <div className="custom-field-list">
              {customFields.map((field) => (
                <div key={field.id} className="custom-field-item">
                  <strong>{field.name}</strong>
                  <span className="badge">{field.field_type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
