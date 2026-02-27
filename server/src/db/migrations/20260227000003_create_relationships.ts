import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TYPE relationship_type AS ENUM (
      'friend', 'colleague', 'parent', 'child', 'sibling', 'cousin',
      'partner', 'spouse', 'mentor', 'mentee', 'manager', 'report',
      'introduced_by', 'met_at_event', 'acquaintance', 'neighbor', 'other'
    )
  `);

  await knex.schema.createTable('relationships', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('from_contact_id').notNullable().references('id').inTable('contacts').onDelete('CASCADE');
    table.uuid('to_contact_id').notNullable().references('id').inTable('contacts').onDelete('CASCADE');
    table.specificType('type', 'relationship_type').notNullable();
    table.jsonb('metadata').defaultTo('{}');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());

    table.index(['from_contact_id'], 'idx_rel_from');
    table.index(['to_contact_id'], 'idx_rel_to');
  });

  await knex.raw(`
    ALTER TABLE relationships
    ADD CONSTRAINT chk_no_self_ref CHECK (from_contact_id <> to_contact_id)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('relationships');
  await knex.raw('DROP TYPE IF EXISTS relationship_type');
}
