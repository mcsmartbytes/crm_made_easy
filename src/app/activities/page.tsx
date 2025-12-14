'use client';

import { Activity, Phone, Mail, Calendar, FileText } from 'lucide-react';

export default function ActivitiesPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Activities</h1>
        <p className="text-slate-600 mt-1">Track calls, emails, meetings, and notes</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Activity size={48} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Activity Tracking</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          Log all your customer interactions - calls, emails, meetings, and notes - in one place.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-blue-50 rounded-lg">
            <Phone className="mx-auto text-blue-500 mb-2" size={24} />
            <p className="text-sm font-medium text-blue-700">Calls</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <Mail className="mx-auto text-green-500 mb-2" size={24} />
            <p className="text-sm font-medium text-green-700">Emails</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <Calendar className="mx-auto text-purple-500 mb-2" size={24} />
            <p className="text-sm font-medium text-purple-700">Meetings</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <FileText className="mx-auto text-orange-500 mb-2" size={24} />
            <p className="text-sm font-medium text-orange-700">Notes</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-6">Coming soon - full activity logging</p>
      </div>
    </div>
  );
}
