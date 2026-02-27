import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('custom_field_definitions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.string('field_type', 20).notNullable();
    table.jsonb('options').defaultTo('[]');
    table.text('default_value');
    table.integer('sort_order').defaultTo(0);
    table.unique(['user_id', 'name']);
  });

  await knex.schema.createTable('custom_field_values', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('contact_id').notNullable().references('id').inTable('contacts').onDelete('CASCADE');
    table.uuid('field_id').notNullable().references('id').inTable('custom_field_definitions').onDelete('CASCADE');
    table.text('value');
    table.unique(['contact_id', 'field_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('custom_field_values');
  await knex.schema.dropTableIfExists('custom_field_definitions');
}
