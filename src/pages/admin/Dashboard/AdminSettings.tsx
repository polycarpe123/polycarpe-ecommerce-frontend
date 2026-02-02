import React, { useState } from 'react';
import { 
  Save
} from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

const AdminSettings: React.FC = () => {
  const { user, isAuthenticated } = useApp();
  const [settings, setSettings] = useState({
    siteName: 'Kapee E-commerce',
    siteEmail: 'admin@kapee.com',
    sitePhone: '+1 234 567 8900',
    siteAddress: '123 Main St, New York, NY 10001',
    currency: 'USD',
    timezone: 'America/New_York',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false
  });

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div>Loading...</div>;
  }

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your store settings and preferences</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input type="text" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Email</label>
                <input type="email" value={settings.siteEmail} onChange={(e) => setSettings({...settings, siteEmail: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
