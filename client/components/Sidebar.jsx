import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Settings,
  Trash2,
  Database,
  Plus,
} from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className='w-64 bg-slate-900 text-slate-300 h-screen flex flex-col border-r border-slate-800 flex-shrink-0'>
      <div className='p-6 flex items-center space-x-3 text-white'>
        <div className='bg-indigo-600 p-2 rounded-lg'>
          <Database size={20} className='text-white' />
        </div>
        <span className='text-xl font-bold tracking-tight'>Vault.ai</span>
      </div>

      <NavItem
        icon={<LayoutDashboard size={18} />}
        label='All Documents'
        active
      />
    </div>
  );
};

const NavItem = ({ icon, label, active }) => (
  <button
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
      active
        ? 'bg-slate-800 text-white font-medium'
        : 'hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
