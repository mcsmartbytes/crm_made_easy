import { NextRequest, NextResponse } from 'next/server';
import { db, contacts, companies } from '@/db';
import { eq, desc, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  // Require authentication
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json([]);
  }

  try {
    const result = await db
      .select({
        id: contacts.id,
        firstName: contacts.firstName,
        lastName: contacts.lastName,
        email: contacts.email,
        phone: contacts.phone,
        mobile: contacts.mobile,
        jobTitle: contacts.jobTitle,
        status: contacts.status,
        source: contacts.source,
        companyId: contacts.companyId,
        notes: contacts.notes,
        createdAt: contacts.createdAt,
        company: {
          id: companies.id,
          name: companies.name,
        },
      })
      .from(contacts)
      .leftJoin(companies, eq(contacts.companyId, companies.id))
      .where(eq(contacts.userId, user.id)) // Filter by user
      .orderBy(desc(contacts.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  // Require authentication
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }

  try {
    const body = await request.json();

    const result = await db.insert(contacts).values({
      userId: user.id, // Associate with user
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email || null,
      phone: body.phone || null,
      mobile: body.mobile || null,
      jobTitle: body.jobTitle || null,
      status: body.status || 'lead',
      source: body.source || null,
      companyId: body.companyId || null,
      notes: body.notes || null,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}
