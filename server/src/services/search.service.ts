import db from '../db/connection';
import { SearchResult } from '../types/search';

export class SearchService {
  async search(userId: string, query: string, limit: number = 20): Promise<SearchResult[]> {
    const searchQuery = query.trim();
    
    if (!searchQuery) {
      return [];
    }

    const contacts = await db('contacts')
      .where('user_id', userId)
      .whereRaw('search_vector @@ plainto_tsquery(?)', [searchQuery])
      .select(
        'id',
        'first_name',
        'last_name',
        'company',
        'job_title',
        db.raw('ts_rank(search_vector, plainto_tsquery(?)) as rank', [searchQuery])
      )
      .orderBy('rank', 'desc')
      .limit(limit);

    const contactResults: SearchResult[] = contacts.map(contact => ({
      type: 'contact',
      id: contact.id,
      title: `${contact.first_name} ${contact.last_name || ''}`.trim(),
      subtitle: [contact.company, contact.job_title].filter(Boolean).join(' • ') || 'No additional info',
      contactId: contact.id,
      rank: contact.rank,
    }));

    const notes = await db('notes')
      .where('user_id', userId)
      .whereRaw('search_vector @@ plainto_tsquery(?)', [searchQuery])
      .select(
        'notes.id',
        'notes.body',
        'notes.contact_id',
        'contacts.first_name as contact_first_name',
        'contacts.last_name as contact_last_name',
        db.raw('ts_rank(notes.search_vector, plainto_tsquery(?)) as rank', [searchQuery])
      )
      .join('contacts', 'notes.contact_id', 'contacts.id')
      .orderBy('rank', 'desc')
      .limit(limit);

    const noteResults: SearchResult[] = notes.map(note => ({
      type: 'note',
      id: note.id,
      title: `Note on ${note.contact_first_name} ${note.contact_last_name || ''}`.trim(),
      subtitle: note.body.substring(0, 100) + (note.body.length > 100 ? '...' : ''),
      contactId: note.contact_id,
      rank: note.rank,
    }));

    const allResults = [...contactResults, ...noteResults]
      .sort((a, b) => b.rank - a.rank)
      .slice(0, limit);

    return allResults;
  }
}

export const searchService = new SearchService();
