import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
<<<<<<< HEAD
import { ToggleLeft, ToggleRight, Settings as SettingsIcon, ShieldCheck, RefreshCw, Sun, Moon } from 'lucide-react';
=======
import { ToggleLeft, ToggleRight, Settings as SettingsIcon, ShieldCheck, RefreshCw, Sun, Moon, Bell, Zap, Clock, User, Lock, Globe } from 'lucide-react';
>>>>>>> wind-breathing
import Button from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { triggerToast } = useAuth();
  const { sidebarOpen } = useOutletContext();

  // Simulated configurations states
  const [autoSave, setAutoSave] = useState(true);
  const [syncSpeed, setSyncSpeed] = useState('15s');
  const [emailAlerts, setEmailAlerts] = useState(false);
<<<<<<< HEAD
=======
  const [autoSync, setAutoSync] = useState(true);
>>>>>>> wind-breathing

  const handleSaveConfigs = () => {
    triggerToast('System settings saved successfully!', 'success');
  };

  return (
<<<<<<< HEAD
    <div className="p-5 md:p-6 space-y-6 max-w-3xl w-full mx-auto">
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
    </div>
  );
}
=======
    <div className="p-5 md:p-8 space-y-8 max-w-4xl w-full mx-auto">
      {/* Header */}
      <div className="text-left border-b-2 border-gradient-to-r from-[#0D6EFD] to-[#6C63FF] pb-4 transition-all duration-300 select-none relative">
        <div className="absolute bottom-0 left-0 w-24 h-0.5 bg-gradient-to-r from-[#0D6EFD] to-[#6C63FF] rounded-full"></div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#0D6EFD]/10 to-[#6C63FF]/10 rounded-xl">
            <SettingsIcon size={20} className="text-[#0D6EFD] dark:text-[#6C63FF]" />
          </div>
          <div>
            <h2 className="font-sans font-extrabold text-lg md:text-xl text-[#081B3A] dark:text-white tracking-tight">
              System Settings
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-medium mt-0.5 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-[#0D6EFD] rounded-full inline-block"></span>
              Configure your editor workspace synchronizers and alerts
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Theme Settings */}
        <div className="glass-card p-6 border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-lg shadow-[#0D6EFD]/5 dark:shadow-[#6C63FF]/5 rounded-2xl text-left space-y-4 transition-all duration-300 hover:shadow-xl hover:shadow-[#0D6EFD]/10 dark:hover:shadow-[#6C63FF]/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg">
              <Sun size={14} className="text-white" />
            </div>
            <h4 className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider">
              Workspace Theme Selection
            </h4>
            <div className="flex-1 border-b border-dashed border-[#E5E7EB] dark:border-white/5"></div>
          </div>
          
          <div className="flex items-center justify-between text-sm py-1">
            <div>
              <p className="font-bold text-[#081B3A] dark:text-[#E5E7EB] text-base">Theme Canvas</p>
              <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5">Toggle between standard light and bright blue dark modes</p>
            </div>

            <div className="flex bg-[#F3F4F6] dark:bg-[#070B14] p-1 rounded-xl border border-[#E5E7EB] dark:border-white/10 shadow-inner transition-all">
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                  theme === 'light' 
                    ? 'bg-white text-[#0D6EFD] shadow-md shadow-[#0D6EFD]/20' 
                    : 'text-[#6B7280] hover:text-[#081B3A] dark:hover:text-white'
                }`}
              >
                <Sun size={13} className={theme === 'light' ? 'text-[#0D6EFD]' : ''} />
                <span>Light</span>
              </button>
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                  theme === 'dark' 
                    ? 'bg-[#0F172A] text-[#6C63FF] shadow-md shadow-[#6C63FF]/20 border border-[#6C63FF]/20' 
                    : 'text-[#6B7280] hover:text-[#081B3A] dark:hover:text-white'
                }`}
              >
                <Moon size={13} className={theme === 'dark' ? 'text-[#6C63FF]' : ''} />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Editor Settings */}
        <div className="glass-card p-6 border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-lg shadow-[#0D6EFD]/5 dark:shadow-[#6C63FF]/5 rounded-2xl text-left space-y-4 transition-all duration-300 hover:shadow-xl hover:shadow-[#0D6EFD]/10 dark:hover:shadow-[#6C63FF]/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg">
              <Zap size={14} className="text-white" />
            </div>
            <h4 className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider">
              Editor Parameters
            </h4>
            <div className="flex-1 border-b border-dashed border-[#E5E7EB] dark:border-white/5"></div>
          </div>
          
          <div className="space-y-3">
            {/* Auto Save */}
            <div className="flex items-center justify-between text-sm py-1.5 px-3 bg-[#F8FAFC] dark:bg-[#0A0F1A] rounded-xl border border-[#E5E7EB] dark:border-white/5 hover:border-[#0D6EFD]/20 dark:hover:border-[#6C63FF]/20 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1 bg-[#0D6EFD]/10 rounded-lg">
                  <RefreshCw size={14} className="text-[#0D6EFD] dark:text-[#6C63FF]" />
                </div>
                <div>
                  <p className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">Auto-Save Drafts</p>
                  <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5">Automatically save document changes back to persistence layers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoSave(!autoSave)}
                className={`p-1 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                  autoSave ? 'text-[#0D6EFD] dark:text-[#6C63FF]' : 'text-[#6B7280]'
                }`}
              >
                {autoSave ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>

            {/* Sync Speeds */}
            <div className="flex items-center justify-between text-sm py-1.5 px-3 bg-[#F8FAFC] dark:bg-[#0A0F1A] rounded-xl border border-[#E5E7EB] dark:border-white/5 hover:border-[#0D6EFD]/20 dark:hover:border-[#6C63FF]/20 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1 bg-purple-500/10 rounded-lg">
                  <Clock size={14} className="text-purple-500" />
                </div>
                <div>
                  <p className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">Live Socket Sync Rate</p>
                  <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5">Define coordinates and logs synchronization cycles</p>
                </div>
              </div>
              <select
                value={syncSpeed}
                onChange={(e) => setSyncSpeed(e.target.value)}
                className="px-3 py-1.5 text-[10px] font-bold rounded-lg border-2 border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]/20 dark:focus:ring-[#6C63FF]/20 focus:border-[#0D6EFD] dark:focus:border-[#6C63FF] transition-all cursor-pointer"
              >
                <option value="5s" className="text-[#0D6EFD] dark:text-[#6C63FF]">⚡ Fast Socket (5s)</option>
                <option value="15s" className="text-emerald-500">🔄 Live Room (15s)</option>
                <option value="30s" className="text-gray-500">⏱️ Standard Sync (30s)</option>
              </select>
            </div>

            {/* Auto Sync */}
            <div className="flex items-center justify-between text-sm py-1.5 px-3 bg-[#F8FAFC] dark:bg-[#0A0F1A] rounded-xl border border-[#E5E7EB] dark:border-white/5 hover:border-[#0D6EFD]/20 dark:hover:border-[#6C63FF]/20 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1 bg-cyan-500/10 rounded-lg">
                  <Globe size={14} className="text-cyan-500" />
                </div>
                <div>
                  <p className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">Auto-Sync Across Devices</p>
                  <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5">Synchronize settings across all your devices automatically</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoSync(!autoSync)}
                className={`p-1 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                  autoSync ? 'text-[#0D6EFD] dark:text-[#6C63FF]' : 'text-[#6B7280]'
                }`}
              >
                {autoSync ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Notification Settings */}
        <div className="glass-card p-6 border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-lg shadow-[#0D6EFD]/5 dark:shadow-[#6C63FF]/5 rounded-2xl text-left space-y-4 transition-all duration-300 hover:shadow-xl hover:shadow-[#0D6EFD]/10 dark:hover:shadow-[#6C63FF]/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg">
              <Bell size={14} className="text-white" />
            </div>
            <h4 className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider">
              Alerts & Security
            </h4>
            <div className="flex-1 border-b border-dashed border-[#E5E7EB] dark:border-white/5"></div>
          </div>
          
          <div className="space-y-3">
            {/* Email Alerts */}
            <div className="flex items-center justify-between text-sm py-1.5 px-3 bg-[#F8FAFC] dark:bg-[#0A0F1A] rounded-xl border border-[#E5E7EB] dark:border-white/5 hover:border-[#0D6EFD]/20 dark:hover:border-[#6C63FF]/20 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1 bg-blue-500/10 rounded-lg">
                  <User size={14} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">Co-author Invite Alerts</p>
                  <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5">Receive email notifications when you are invited to edit blueprints</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`p-1 rounded-lg transition-all hover:scale-110 active:scale-95 ${
                  emailAlerts ? 'text-[#0D6EFD] dark:text-[#6C63FF]' : 'text-[#6B7280]'
                }`}
              >
                {emailAlerts ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-3 py-1.5 px-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border border-green-200 dark:border-green-800/30">
              <div className="p-1.5 bg-green-500 rounded-lg">
                <Lock size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-green-700 dark:text-green-400">Secure Connection</p>
                <p className="text-[9px] text-green-600 dark:text-green-500">All settings are encrypted and securely stored</p>
              </div>
              <ShieldCheck size={18} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Save Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB] dark:border-white/10">
          <Button 
            onClick={handleSaveConfigs} 
            icon={ShieldCheck}
            className="bg-gradient-to-r from-[#0D6EFD] to-[#6C63FF] hover:shadow-lg hover:shadow-[#0D6EFD]/30 dark:hover:shadow-[#6C63FF]/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} />
              Save Configs
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
>>>>>>> wind-breathing
