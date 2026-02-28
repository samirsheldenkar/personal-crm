import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  await knex('contact_tags').del();
  await knex('tags').del();
  await knex('notes').del();
  await knex('reminders').del();
  await knex('relationships').del();
  await knex('custom_field_values').del();
  await knex('custom_field_definitions').del();
  await knex('contacts').del();
  await knex('users').del();

  const passwordHash = await bcrypt.hash('demo1234', 10);
  
  const [user] = await knex('users')
    .insert({
      email: 'demo@example.com',
      password_hash: passwordHash,
      display_name: 'Demo User',
    })
    .returning('id');

  const userId = user.id;

  const tags = await knex('tags')
    .insert([
      { user_id: userId, name: 'Family', color: '#ef4444' },
      { user_id: userId, name: 'Work', color: '#3b82f6' },
      { user_id: userId, name: 'Friends', color: '#10b981' },
      { user_id: userId, name: 'Networking', color: '#f59e0b' },
    ])
    .returning('*');

  const contacts = await knex('contacts')
    .insert([
      {
        user_id: userId,
        first_name: 'Alice',
        last_name: 'Chen',
        company: 'Tech Corp',
        job_title: 'Engineering Manager',
        emails: JSON.stringify([{ value: 'alice@techcorp.com', label: 'work', primary: true }]),
        phones: JSON.stringify([{ value: '+1-555-0101', label: 'mobile', primary: true }]),
      },
      {
        user_id: userId,
        first_name: 'Bob',
        last_name: 'Smith',
        company: 'Design Studio',
        job_title: 'UX Designer',
        emails: JSON.stringify([{ value: 'bob@designstudio.com', label: 'work', primary: true }]),
        phones: JSON.stringify([{ value: '+1-555-0102', label: 'mobile', primary: true }]),
      },
      {
        user_id: userId,
        first_name: 'Carol',
        last_name: 'Williams',
        company: 'Startup Inc',
        job_title: 'CEO',
        emails: JSON.stringify([{ value: 'carol@startup.com', label: 'work', primary: true }]),
        phones: JSON.stringify([{ value: '+1-555-0103', label: 'mobile', primary: true }]),
      },
      {
        user_id: userId,
        first_name: 'David',
        last_name: 'Johnson',
        company: 'Consulting Group',
        job_title: 'Senior Consultant',
        emails: JSON.stringify([{ value: 'david@consulting.com', label: 'work', primary: true }]),
        phones: JSON.stringify([{ value: '+1-555-0104', label: 'mobile', primary: true }]),
      },
      {
        user_id: userId,
        first_name: 'Emma',
        last_name: 'Davis',
        company: 'Marketing Pro',
        job_title: 'Marketing Director',
        emails: JSON.stringify([{ value: 'emma@marketing.com', label: 'work', primary: true }]),
        phones: JSON.stringify([{ value: '+1-555-0105', label: 'mobile', primary: true }]),
      },
    ])
    .returning('*');

  await knex('contact_tags').insert([
    { contact_id: contacts[0].id, tag_id: tags[1].id },
    { contact_id: contacts[0].id, tag_id: tags[3].id },
    { contact_id: contacts[1].id, tag_id: tags[1].id },
    { contact_id: contacts[2].id, tag_id: tags[3].id },
    { contact_id: contacts[3].id, tag_id: tags[1].id },
    { contact_id: contacts[4].id, tag_id: tags[2].id },
  ]);

  await knex('notes').insert([
    {
      contact_id: contacts[0].id,
      user_id: userId,
      body: 'Met Alice at the tech conference. Great conversation about engineering leadership.',
      format: 'markdown',
      tags: JSON.stringify(['conference', 'leadership']),
    },
    {
      contact_id: contacts[0].id,
      user_id: userId,
      body: 'Follow-up call scheduled for next week to discuss collaboration opportunities.',
      format: 'markdown',
      tags: JSON.stringify(['follow-up']),
    },
    {
      contact_id: contacts[1].id,
      user_id: userId,
      body: 'Bob has excellent UX portfolio. Recommended for the redesign project.',
      format: 'markdown',
      tags: JSON.stringify(['portfolio', 'recommendation']),
    },
  ]);

  await knex('relationships').insert([
    {
      user_id: userId,
      from_contact_id: contacts[0].id,
      to_contact_id: contacts[1].id,
      type: 'colleague',
      metadata: JSON.stringify({}),
    },
    {
      user_id: userId,
      from_contact_id: contacts[0].id,
      to_contact_id: contacts[2].id,
      type: 'introduced_by',
      metadata: JSON.stringify({}),
    },
    {
      user_id: userId,
      from_contact_id: contacts[2].id,
      to_contact_id: contacts[3].id,
      type: 'friend',
      metadata: JSON.stringify({}),
    },
  ]);

  await knex('reminders').insert([
    {
      contact_id: contacts[0].id,
      user_id: userId,
      type: 'keep_in_touch',
      interval_days: 30,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      note: 'Check in on project progress',
      is_completed: false,
    },
    {
      contact_id: contacts[1].id,
      user_id: userId,
      type: 'keep_in_touch',
      interval_days: 60,
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      note: 'Follow up on design proposal',
      is_completed: false,
    },
  ]);

  await knex('custom_field_definitions').insert([
    {
      user_id: userId,
      name: 'Met At',
      field_type: 'text',
      options: JSON.stringify([]),
      sort_order: 0,
    },
    {
      user_id: userId,
      name: 'Priority',
      field_type: 'select',
      options: JSON.stringify(['High', 'Medium', 'Low']),
      sort_order: 1,
    },
  ]);
}
