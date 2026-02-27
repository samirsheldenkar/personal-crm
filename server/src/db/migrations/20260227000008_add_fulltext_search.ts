import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE contacts
    ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
      to_tsvector('english',
        coalesce(first_name, '') || ' ' ||
        coalesce(last_name, '') || ' ' ||
        coalesce(company, '') || ' ' ||
        coalesce(job_title, '')
      )
    ) STORED
  `);

  await knex.raw(`
    CREATE INDEX idx_contacts_search ON contacts USING gin(search_vector)
  `);

  await knex.raw(`
    ALTER TABLE notes
    ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
      to_tsvector('english', coalesce(body, ''))
    ) STORED
  `);

  await knex.raw(`
    CREATE INDEX idx_notes_search ON notes USING gin(search_vector)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP INDEX IF EXISTS idx_notes_search');
  await knex.raw('ALTER TABLE notes DROP COLUMN IF EXISTS search_vector');
  await knex.raw('DROP INDEX IF EXISTS idx_contacts_search');
  await knex.raw('ALTER TABLE contacts DROP COLUMN IF EXISTS search_vector');
}
