import { db, contacts, companies, deals, tasks, activities } from '@/db';
import { count, eq, sql } from 'drizzle-orm';
import { Users, Building2, TrendingUp, CheckSquare, DollarSign, Activity } from 'lucide-react';
import Link from 'next/link';

async function getStats() {
  try {
    const [contactCount] = await db.select({ count: count() }).from(contacts);
    const [companyCount] = await db.select({ count: count() }).from(companies);
    const [dealCount] = await db.select({ count: count() }).from(deals);
    const [taskCount] = await db.select({ count: count() }).from(tasks).where(eq(tasks.status, 'pending'));

    const [dealValue] = await db
      .select({ total: sql<number>`COALESCE(SUM(value), 0)` })
      .from(deals)
      .where(eq(deals.stage, 'won'));

    const recentActivities = await db
      .select()
      .from(activities)
      .orderBy(sql`${activities.createdAt} DESC`)
      .limit(5);

    return {
      contacts: contactCount?.count || 0,
      companies: companyCount?.count || 0,
      deals: dealCount?.count || 0,
      pendingTasks: taskCount?.count || 0,
      wonDealsValue: dealValue?.total || 0,
      recentActivities,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      contacts: 0,
      companies: 0,
      deals: 0,
      pendingTasks: 0,
      wonDealsValue: 0,
      recentActivities: [],
    };
  }
}

export default async function Dashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: 'Total Contacts',
      value: stats.contacts,
      icon: Users,
      color: 'bg-blue-500',
      href: '/contacts'
    },
    {
      title: 'Companies',
      value: stats.companies,
      icon: Building2,
      color: 'bg-purple-500',
      href: '/companies'
    },
    {
      title: 'Active Deals',
      value: stats.deals,
      icon: TrendingUp,
      color: 'bg-green-500',
      href: '/deals'
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: CheckSquare,
      color: 'bg-orange-500',
      href: '/tasks'
    },
    {
      title: 'Won Deals Value',
      value: `$${stats.wonDealsValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      href: '/deals'
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome to CRM Made Easy</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/contacts?new=true"
              className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Users size={20} />
              <span className="font-medium">Add Contact</span>
            </Link>
            <Link
              href="/companies?new=true"
              className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
            >
              <Building2 size={20} />
              <span className="font-medium">Add Company</span>
            </Link>
            <Link
              href="/deals?new=true"
              className="flex items-center gap-3 p-4 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              <TrendingUp size={20} />
              <span className="font-medium">Create Deal</span>
            </Link>
            <Link
              href="/tasks?new=true"
              className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
            >
              <CheckSquare size={20} />
              <span className="font-medium">Add Task</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
          {stats.recentActivities.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                  <Activity size={18} className="text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{activity.subject}</p>
                    <p className="text-xs text-slate-500">{activity.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Activity size={40} className="mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm mt-1">Activities will appear here as you work</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
