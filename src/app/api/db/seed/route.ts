import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export async function POST() {
  try {
    const url = process.env.TURSO_DATABASE_URL?.trim();
    const authToken = process.env.TURSO_AUTH_TOKEN?.trim().replace(/\s+/g, '');

    if (!url || !authToken) {
      return NextResponse.json(
        { success: false, error: 'Database credentials not configured' },
        { status: 500 }
      );
    }

    const client = createClient({ url, authToken });

    // Demo user ID - use existing or create one
    const demoUserId = 'demo-user-001';

    // Seed Companies
    const companies = [
      { name: 'Acme Corporation', industry: 'Technology', website: 'https://acme.com', phone: '(555) 123-4567', email: 'info@acme.com', city: 'San Francisco', state: 'CA' },
      { name: 'GlobalTech Solutions', industry: 'Software', website: 'https://globaltech.io', phone: '(555) 234-5678', email: 'hello@globaltech.io', city: 'Austin', state: 'TX' },
      { name: 'Premier Manufacturing', industry: 'Manufacturing', website: 'https://premier-mfg.com', phone: '(555) 345-6789', email: 'sales@premier-mfg.com', city: 'Detroit', state: 'MI' },
      { name: 'Sunrise Healthcare', industry: 'Healthcare', website: 'https://sunrisehealth.com', phone: '(555) 456-7890', email: 'contact@sunrisehealth.com', city: 'Boston', state: 'MA' },
      { name: 'Metro Real Estate', industry: 'Real Estate', website: 'https://metrorealestate.com', phone: '(555) 567-8901', email: 'info@metrorealestate.com', city: 'Chicago', state: 'IL' },
    ];

    for (const company of companies) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO companies (user_id, name, industry, website, phone, email, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [demoUserId, company.name, company.industry, company.website, company.phone, company.email, company.city, company.state]
      });
    }

    // Seed Contacts
    const contacts = [
      { firstName: 'John', lastName: 'Smith', email: 'john.smith@acme.com', phone: '(555) 111-1111', jobTitle: 'CEO', status: 'customer', companyIndex: 0 },
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@globaltech.io', phone: '(555) 222-2222', jobTitle: 'CTO', status: 'customer', companyIndex: 1 },
      { firstName: 'Michael', lastName: 'Williams', email: 'm.williams@premier-mfg.com', phone: '(555) 333-3333', jobTitle: 'Procurement Manager', status: 'prospect', companyIndex: 2 },
      { firstName: 'Emily', lastName: 'Brown', email: 'emily.brown@sunrisehealth.com', phone: '(555) 444-4444', jobTitle: 'Director of Operations', status: 'lead', companyIndex: 3 },
      { firstName: 'David', lastName: 'Davis', email: 'david@metrorealestate.com', phone: '(555) 555-5555', jobTitle: 'VP Sales', status: 'customer', companyIndex: 4 },
      { firstName: 'Jennifer', lastName: 'Martinez', email: 'j.martinez@acme.com', phone: '(555) 666-6666', jobTitle: 'Product Manager', status: 'prospect', companyIndex: 0 },
      { firstName: 'Robert', lastName: 'Taylor', email: 'r.taylor@globaltech.io', phone: '(555) 777-7777', jobTitle: 'Engineering Lead', status: 'lead', companyIndex: 1 },
      { firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.a@premier-mfg.com', phone: '(555) 888-8888', jobTitle: 'Quality Manager', status: 'inactive', companyIndex: 2 },
    ];

    // Get company IDs first
    const companyResults = await client.execute(`SELECT id, name FROM companies WHERE user_id = '${demoUserId}' ORDER BY id`);
    const companyIds = companyResults.rows.map(r => r.id);

    for (const contact of contacts) {
      const companyId = companyIds[contact.companyIndex] || null;
      await client.execute({
        sql: `INSERT OR IGNORE INTO contacts (user_id, company_id, first_name, last_name, email, phone, job_title, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [demoUserId, companyId, contact.firstName, contact.lastName, contact.email, contact.phone, contact.jobTitle, contact.status]
      });
    }

    // Get contact IDs
    const contactResults = await client.execute(`SELECT id, first_name FROM contacts WHERE user_id = '${demoUserId}' ORDER BY id`);
    const contactIds = contactResults.rows.map(r => r.id);

    // Seed Deals
    const deals = [
      { title: 'Enterprise Software License', value: 75000, stage: 'proposal', probability: 60, contactIndex: 0, companyIndex: 0 },
      { title: 'Cloud Migration Project', value: 120000, stage: 'negotiation', probability: 75, contactIndex: 1, companyIndex: 1 },
      { title: 'Manufacturing Equipment Sale', value: 45000, stage: 'qualified', probability: 40, contactIndex: 2, companyIndex: 2 },
      { title: 'Healthcare Platform Subscription', value: 36000, stage: 'won', probability: 100, contactIndex: 3, companyIndex: 3 },
      { title: 'Property Management System', value: 28000, stage: 'lead', probability: 20, contactIndex: 4, companyIndex: 4 },
      { title: 'Support Contract Renewal', value: 15000, stage: 'won', probability: 100, contactIndex: 0, companyIndex: 0 },
      { title: 'Consulting Services', value: 50000, stage: 'proposal', probability: 50, contactIndex: 5, companyIndex: 0 },
      { title: 'API Integration Project', value: 85000, stage: 'lost', probability: 0, contactIndex: 6, companyIndex: 1 },
    ];

    for (const deal of deals) {
      const contactId = contactIds[deal.contactIndex] || null;
      const companyId = companyIds[deal.companyIndex] || null;
      await client.execute({
        sql: `INSERT OR IGNORE INTO deals (user_id, contact_id, company_id, title, value, stage, probability) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [demoUserId, contactId, companyId, deal.title, deal.value, deal.stage, deal.probability]
      });
    }

    // Get deal IDs
    const dealResults = await client.execute(`SELECT id FROM deals WHERE user_id = '${demoUserId}' ORDER BY id`);
    const dealIds = dealResults.rows.map(r => r.id);

    // Seed Tasks
    const tasks = [
      { title: 'Follow up on proposal', description: 'Send revised pricing to John Smith', priority: 'high', status: 'pending', contactIndex: 0 },
      { title: 'Schedule product demo', description: 'Setup demo for GlobalTech team', priority: 'medium', status: 'in_progress', contactIndex: 1 },
      { title: 'Prepare contract documents', description: 'Legal review needed before sending', priority: 'high', status: 'pending', contactIndex: 2 },
      { title: 'Send welcome package', description: 'New customer onboarding materials', priority: 'low', status: 'completed', contactIndex: 3 },
      { title: 'Quarterly business review', description: 'Prepare QBR presentation', priority: 'medium', status: 'pending', contactIndex: 4 },
      { title: 'Update CRM records', description: 'Add notes from last meeting', priority: 'low', status: 'completed', contactIndex: 0 },
    ];

    for (const task of tasks) {
      const contactId = contactIds[task.contactIndex] || null;
      await client.execute({
        sql: `INSERT OR IGNORE INTO tasks (user_id, contact_id, title, description, priority, status) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [demoUserId, contactId, task.title, task.description, task.priority, task.status]
      });
    }

    // Seed Activities
    const activities = [
      { type: 'call', subject: 'Discovery call with Acme Corp', description: 'Discussed their needs for Q2', outcome: 'Positive - scheduling follow-up', contactIndex: 0 },
      { type: 'email', subject: 'Sent proposal to GlobalTech', description: 'Cloud migration project proposal', outcome: 'Awaiting response', contactIndex: 1 },
      { type: 'meeting', subject: 'On-site visit - Premier Manufacturing', description: 'Toured facility, met with team', outcome: 'Good fit for our solution', contactIndex: 2 },
      { type: 'note', subject: 'Contact info updated', description: 'Emily got promoted to Director', outcome: null, contactIndex: 3 },
      { type: 'call', subject: 'Check-in call with Metro RE', description: 'Monthly account review', outcome: 'Interested in add-on services', contactIndex: 4 },
      { type: 'email', subject: 'Contract renewal reminder', description: 'Sent 30-day reminder', outcome: 'Confirmed renewal', contactIndex: 0 },
      { type: 'meeting', subject: 'Demo presentation', description: 'Product demo for engineering team', outcome: 'Very impressed with features', contactIndex: 6 },
    ];

    for (const activity of activities) {
      const contactId = contactIds[activity.contactIndex] || null;
      await client.execute({
        sql: `INSERT OR IGNORE INTO activities (user_id, contact_id, type, subject, description, outcome) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [demoUserId, contactId, activity.type, activity.subject, activity.description, activity.outcome]
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully',
      data: {
        companies: companies.length,
        contacts: contacts.length,
        deals: deals.length,
        tasks: tasks.length,
        activities: activities.length,
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to seed demo data',
    warning: 'This will add sample companies, contacts, deals, tasks, and activities',
  });
}
