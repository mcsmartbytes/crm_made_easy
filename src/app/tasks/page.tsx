'use client';

import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>
        <p className="text-slate-600 mt-1">Manage your follow-ups and to-dos</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <CheckSquare size={48} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Task Management</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          Never miss a follow-up. Create tasks linked to contacts, companies, and deals.
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="p-4 bg-yellow-50 rounded-lg">
            <Clock className="mx-auto text-yellow-500 mb-2" size={24} />
            <p className="text-sm font-medium text-yellow-700">Pending</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <AlertCircle className="mx-auto text-blue-500 mb-2" size={24} />
            <p className="text-sm font-medium text-blue-700">In Progress</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <CheckSquare className="mx-auto text-green-500 mb-2" size={24} />
            <p className="text-sm font-medium text-green-700">Completed</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-6">Coming soon - full task management</p>
      </div>
    </div>
  );
}
