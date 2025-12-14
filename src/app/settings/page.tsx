'use client';

import { Settings, Database, Palette, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-600 mt-1">Configure your CRM</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Database</h3>
              <p className="text-sm text-slate-500">Turso (LibSQL)</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Your data is stored securely in Turso, a fast edge database powered by SQLite.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Palette className="text-purple-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Appearance</h3>
              <p className="text-sm text-slate-500">Customize your CRM</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Theme customization coming soon.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Bell className="text-orange-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Notifications</h3>
              <p className="text-sm text-slate-500">Email & alerts</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Notification settings coming soon.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Settings className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Pipeline Stages</h3>
              <p className="text-sm text-slate-500">Customize your sales process</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Stage customization coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
