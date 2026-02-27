import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('contacts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255);
    table.text('avatar_url');
    table.string('company', 255);
    table.string('job_title', 255);
    table.date('birthday');
    table.jsonb('emails').defaultTo('[]');
    table.jsonb('phones').defaultTo('[]');
    table.jsonb('addresses').defaultTo('[]');
    table.jsonb('social_links').defaultTo('{}');
    table.boolean('is_archived').defaultTo(false);
    table.timestamp('last_contacted_at', { useTz: true });
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());

    table.index(['user_id'], 'idx_contacts_user');
    table.index(['user_id', 'first_name', 'last_name'], 'idx_contacts_name');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('contacts');
}
