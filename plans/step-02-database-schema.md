# Step 2: Database Schema & Migrations

## Goal
Create Knex migration files that produce the full database schema (all 9 tables + enum type + indexes) and a seed file with demo data.

**Prerequisite:** Step 1 completed (server package initialized, Knex configured).

---

## 2.1 Migration: `001_create_users.ts`

**File:** `server/src/db/migrations/20260227000001_create_users.ts`

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Enable uuid extension
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('display_name', 255);
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
```

---

## 2.2 Migration: `002_create_contacts.ts`

**File:** `server/src/db/migrations/20260227000002_create_contacts.ts`

```typescript
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
```

---

## 2.3 Migration: `003_create_relationships.ts`

**File:** `server/src/db/migrations/20260227000003_create_relationships.ts`

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create the relationship_type enum
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

  // Add CHECK constraint: no self-referencing relationships
  await knex.raw(`
    ALTER TABLE relationships
    ADD CONSTRAINT chk_no_self_ref CHECK (from_contact_id <> to_contact_id)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('relationships');
  await knex.raw('DROP TYPE IF EXISTS relationship_type');
}
```

---

## 2.4 Migration: `004_create_notes.ts`

**File:** `server/src/db/migrations/20260227000004_create_notes.ts`

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('notes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('contact_id').notNullable().references('id').inTable('contacts').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('body').notNullable();
    table.string('format', 10).defaultTo('markdown');
    table.jsonb('tags').defaultTo('[]');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());

    table.index(['contact_id'], 'idx_notes_contact');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('notes');
}
```

---

## 2.5 Migration: `005_create_tags.ts`

**File:** `server/src/db/migrations/20260227000005_create_tags.ts`

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tags', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 100).notNullable();
    table.string('color', 7).defaultTo('#6366f1');
    table.unique(['user_id', 'name']);
  });

  await knex.schema.createTable('contact_tags', (table) => {
    table.uuid('contact_id').notNullable().references('id').inTable('contacts').onDelete('CASCADE');
    table.uuid('tag_id').notNullable().references('id').inTable('tags').onDelete('CASCADE');
    table.primary(['contact_id', 'tag_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('contact_tags');
  await knex.schema.dropTableIfExists('tags');
}
```

---

## 2.6 Migration: `006_create_custom_fields.ts`

**File:** `server/src/db/migrations/20260227000006_create_custom_fields.ts`

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('custom_field_definitions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.string('field_type', 20).notNullable(); // text, number, date, select, multi_select, url, boolean
    table.jsonb('options').defaultTo('[]');         // for select/multi_select types
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
```

---

## 2.7 Migration: `007_create_reminders.ts`

**File:** `server/src/db/migrations/20260227000007_create_reminders.ts`

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('reminders', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('contact_id').notNullable().references('id').inTable('contacts').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('type', 20).defaultTo('keep_in_touch'); // keep_in_touch | one_time
    table.integer('interval_days');                        // for keep_in_touch
    table.date('due_date');
    table.text('note');
    table.boolean('is_completed').defaultTo(false);
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());

    table.index(['user_id', 'due_date'], 'idx_reminders_due');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('reminders');
}
```

---

## 2.8 Migration: `008_add_fulltext_search.ts`

**File:** `server/src/db/migrations/20260227000008_add_fulltext_search.ts`

Add a generated tsvector column on `contacts` for full-text search:

```typescript
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add tsvector column for contacts full-text search
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

  // Add tsvector column for notes full-text search
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
```

---

## 2.9 Seed File

**File:** `server/src/db/seeds/001_demo_data.ts`

Create a demo user (email: `demo@example.com`, password: `demo1234`) and 5 sample contacts with relationships between them. Use `bcryptjs` to hash the password.

```typescript
import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Clean existing data (in reverse dependency order)
  await knex('reminders').del();
  await knex('custom_field_values').del();
  await knex('custom_field_definitions').del();
  await knex('contact_tags').del();
  await knex('tags').del();
  await knex('notes').del();
  await knex('relationships').del();
  await knex('contacts').del();
  await knex('users').del();

  // Create demo user
  const passwordHash = await bcrypt.hash('demo1234', 10);
  const [user] = await knex('users').insert({
    email: 'demo@example.com',
    password_hash: passwordHash,
    display_name: 'Demo User',
  }).returning('*');

  // Create 5 contacts
  const contactsData = [
    { first_name: 'Alice', last_name: 'Chen', company: 'Acme Corp', job_title: 'CTO', birthday: '1990-03-15', emails: JSON.stringify([{ value: 'alice@acme.com', label: 'work', primary: true }]), phones: JSON.stringify([{ value: '+1-555-0101', label: 'mobile', primary: true }]) },
    { first_name: 'Bob', last_name: 'Martinez', company: 'StartupXYZ', job_title: 'Founder', birthday: '1988-07-22', emails: JSON.stringify([{ value: 'bob@startupxyz.com', label: 'work', primary: true }]) },
    { first_name: 'Carol', last_name: 'Johnson', company: 'Acme Corp', job_title: 'Engineer', emails: JSON.stringify([{ value: 'carol@acme.com', label: 'work', primary: true }]) },
    { first_name: 'David', last_name: 'Kim', company: 'BigTech Inc', job_title: 'PM', birthday: '1992-11-05', emails: JSON.stringify([{ value: 'david.kim@bigtech.com', label: 'work', primary: true }]) },
    { first_name: 'Eve', last_name: 'Nakamura', company: 'DesignStudio', job_title: 'Lead Designer', emails: JSON.stringify([{ value: 'eve@designstudio.io', label: 'work', primary: true }]) },
  ];

  const contacts = await knex('contacts').insert(
    contactsData.map((c) => ({ ...c, user_id: user.id }))
  ).returning('*');

  // Create relationships
  await knex('relationships').insert([
    { user_id: user.id, from_contact_id: contacts[0].id, to_contact_id: contacts[2].id, type: 'colleague' },
    { user_id: user.id, from_contact_id: contacts[2].id, to_contact_id: contacts[0].id, type: 'colleague' },
    { user_id: user.id, from_contact_id: contacts[0].id, to_contact_id: contacts[1].id, type: 'friend' },
    { user_id: user.id, from_contact_id: contacts[1].id, to_contact_id: contacts[0].id, type: 'friend' },
    { user_id: user.id, from_contact_id: contacts[3].id, to_contact_id: contacts[4].id, type: 'colleague' },
    { user_id: user.id, from_contact_id: contacts[0].id, to_contact_id: contacts[3].id, type: 'mentor' },
  ]);

  // Create tags
  const [familyTag, investorTag, uniTag] = await knex('tags').insert([
    { user_id: user.id, name: 'Family', color: '#ef4444' },
    { user_id: user.id, name: 'Investors', color: '#22c55e' },
    { user_id: user.id, name: 'Uni Friends', color: '#3b82f6' },
  ]).returning('*');

  // Assign tags
  await knex('contact_tags').insert([
    { contact_id: contacts[0].id, tag_id: uniTag.id },
    { contact_id: contacts[1].id, tag_id: investorTag.id },
    { contact_id: contacts[0].id, tag_id: investorTag.id },
  ]);

  // Create notes
  await knex('notes').insert([
    { contact_id: contacts[0].id, user_id: user.id, body: '# Met at TechConf 2025\n\nAlice presented on distributed systems. Very knowledgeable about Kubernetes.', format: 'markdown' },
    { contact_id: contacts[1].id, user_id: user.id, body: 'Bob is raising Series A. Interested in AI tooling space.', format: 'markdown' },
  ]);

  // Create a custom field definition
  await knex('custom_field_definitions').insert([
    { user_id: user.id, name: 'Met at', field_type: 'text', sort_order: 1 },
    { user_id: user.id, name: 'Dietary preferences', field_type: 'select', options: JSON.stringify(['Vegetarian', 'Vegan', 'Gluten-free', 'None']), sort_order: 2 },
  ]);
}
```

---

## Verification
1. Start a local Postgres instance (or use Docker: `docker run -d --name crm-pg -e POSTGRES_USER=crm -e POSTGRES_PASSWORD=crm_secret -e POSTGRES_DB=personal_crm -p 5432:5432 postgres:16`)
2. Run `cd server && npm run migrate` — all 8 migrations apply without error
3. Run `cd server && npm run seed` — demo data inserted
4. Connect with `psql` and verify: `\dt` shows all 9 tables, `SELECT count(*) FROM contacts` returns 5
