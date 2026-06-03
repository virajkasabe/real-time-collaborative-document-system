import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Settings as SettingsIcon, ShieldCheck, RefreshCw, Sun, Moon } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { triggerToast } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Simulated configurations states
  const [autoSave, setAutoSave] = useState(true);
  const [syncSpeed, setSyncSpeed] = useState('15s');
  const [emailAlerts, setEmailAlerts] = useState(false);

  const handleSaveConfigs = () => {
    triggerToast('System settings saved successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] transition-colors duration-300 flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'pl-44' : 'pl-12'}`}>
        <Navbar />

        <main className="flex-1 p-5 md:p-6 space-y-6 max-w-3xl w-full mx-auto overflow-y-auto">
          {/* Header */}
          <div className="text-left border-b border-[#E5E7EB] dark:border-white/10 pb-4 transition-all duration-300 select-none">
            <h2 className="font-sans font-extrabold text-base md:text-lg text-[#081B3A] dark:text-white uppercase tracking-wider">
              System Settings
            </h2>
            <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] font-bold mt-1">
              Configure your editor workspace synchronizers and alerts
            </p>
          </div>

          <div className="glass-card p-5 border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-sm rounded-2xl text-left space-y-5 transition-all duration-300">
            
            {/* 1. Theme Settings */}
            <div className="space-y-2 select-none">
              <h4 className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider border-b border-[#E5E7EB] dark:border-white/10 pb-1.5 transition-colors">
                Workspace Theme Selection
              </h4>
              <div className="flex items-center justify-between text-xs py-1">
                <div>
                  <p className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">Theme Canvas</p>
                  <p className="text-[9px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5">Toggle between standard light and bright blue dark modes</p>
                </div>

                <div className="flex bg-[#E5E7EB] dark:bg-[#070B14] p-0.75 rounded-lg border border-[#E5E7EB] dark:border-white/10 shadow-sm transition-all">
                  <button
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`p-1 px-2.5 rounded-md text-[9px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 ${theme === 'light' ? 'bg-white text-[#0D6EFD] shadow-sm' : 'text-[#6B7280]'}`}
                  >
                    <Sun size={11} />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`p-1 px-2.5 rounded-md text-[9px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 ${theme === 'dark' ? 'bg-white dark:bg-[#0F172A] text-[#0D6EFD] shadow-sm' : 'text-[#6B7280]'}`}
                  >
                    <Moon size={11} />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Editor Settings */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider border-b border-[#E5E7EB] dark:border-white/10 pb-1.5 transition-colors">
                Editor Parameters
              </h4>
              
              {/* Auto Save */}
              <div className="flex items-center justify-between text-xs py-1 select-none">
                <div>
                  <p className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">Auto-Save Drafts</p>
                  <p className="text-[9px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5">Automatically save document changes back to persistence layers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoSave(!autoSave)}
                  className="text-[#0D6EFD] hover:scale-105 active:scale-95 transition-transform"
                >
                  {autoSave ? <ToggleRight size={24} /> : <ToggleLeft size={24} className="text-[#6B7280]" />}
                </button>
              </div>

              {/* Sync Speeds */}
              <div className="flex items-center justify-between text-xs py-2">
                <div>
                  <p className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">Live Socket Sync Rate</p>
                  <p className="text-[9px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5">Define coordinates and logs synchronization cycles</p>
                </div>
                <select
                  value={syncSpeed}
                  onChange={(e) => setSyncSpeed(e.target.value)}
                  className="px-2 py-1.5 text-[10px] font-bold rounded-lg border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] focus:outline-none"
                >
                  <option value="5s">Fast Socket (5s)</option>
                  <option value="15s">Live Room (15s)</option>
                  <option value="30s">Standard Sync (30s)</option>
                </select>
              </div>
            </div>

            {/* 3. Notification Settings */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider border-b border-[#E5E7EB] dark:border-white/10 pb-1.5 transition-colors">
                Alerts & Security
              </h4>
              
              {/* Email Alerts */}
              <div className="flex items-center justify-between text-xs py-1 select-none">
                <div>
                  <p className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">Co-author Invite Alerts</p>
                  <p className="text-[9px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5">Receive email notifications when you are invited to edit blueprints</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className="text-[#0D6EFD] hover:scale-105 active:scale-95 transition-transform"
                >
                  {emailAlerts ? <ToggleRight size={24} /> : <ToggleLeft size={24} className="text-[#6B7280]" />}
                </button>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-2 flex justify-end">
              <Button onClick={handleSaveConfigs} icon={ShieldCheck}>
                Save Configs
              </Button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
