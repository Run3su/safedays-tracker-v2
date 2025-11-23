import React from 'react';
import { Card, Button, Select } from '../components/UIComponents';
import { CycleData } from '../types';
import { Trash2, Bell, Moon, Sun, Baby } from 'lucide-react';

interface SettingsProps {
  data: CycleData;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateLength: (length: number) => void;
  onUpdatePeriodLength: (length: number) => void;
  onClearData: () => void;
  onTogglePregnancyMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  data, 
  darkMode, 
  onToggleDarkMode, 
  onUpdateLength, 
  onUpdatePeriodLength, 
  onClearData,
  onTogglePregnancyMode
}) => {
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
       <div className="text-center">
        <h2 className="text-xl font-bold text-brand-900 dark:text-brand-100">Settings</h2>
        <p className="text-brand-600 dark:text-brand-300 text-sm">Customize your experience</p>
      </div>

      {/* Pregnancy Mode Card */}
      <Card className={`p-6 border-2 transition-colors ${data.isPregnant ? 'border-purple-200 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-800' : 'border-transparent'}`}>
         <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${data.isPregnant ? 'bg-purple-200 text-purple-700 dark:bg-purple-800 dark:text-purple-200' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <Baby className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">Pregnancy Mode</h3>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm max-w-[70%]">
            <p className="font-medium text-gray-900 dark:text-gray-200">
              {data.isPregnant ? 'Active' : 'Enable Pregnancy Mode'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              {data.isPregnant 
                ? 'Pauses cycle predictions and tracks gestational age.' 
                : 'Switch to due date tracking and weekly updates.'}
            </p>
          </div>
          
           <button 
              onClick={onTogglePregnancyMode}
              className={`w-12 h-7 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none ${data.isPregnant ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm ${data.isPregnant ? 'left-6' : 'left-1'}`}></div>
            </button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {darkMode ? <Moon className="w-5 h-5 text-gray-900 dark:text-gray-100" /> : <Sun className="w-5 h-5 text-gray-900 dark:text-gray-100" />}
          <h3 className="font-bold text-gray-900 dark:text-white">Appearance</h3>
        </div>
        
        <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-gray-200">Dark Mode</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Switch between light and dark themes</p>
            </div>
             <button 
              onClick={onToggleDarkMode}
              className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${darkMode ? 'bg-brand-600' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${darkMode ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>
      </Card>

      {!data.isPregnant && (
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Cycle Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Adjust your cycle length for more accurate predictions</p>
          </div>
          
          <div className="space-y-4">
            <Select 
              label="Average Cycle Length"
              value={data.cycleLength}
              onChange={(e) => onUpdateLength(Number(e.target.value))}
            >
              {Array.from({ length: 15 }, (_, i) => i + 21).map((day) => (
                <option key={day} value={day}>{day} days</option>
              ))}
            </Select>

            <Select 
              label="Period Duration"
              value={data.periodLength || 5}
              onChange={(e) => onUpdatePeriodLength(Number(e.target.value))}
            >
              {Array.from({ length: 8 }, (_, i) => i + 2).map((day) => (
                <option key={day} value={day}>{day} days</option>
              ))}
            </Select>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get reminders about your {data.isPregnant ? 'pregnancy' : 'cycle'}</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-gray-200">Daily Updates</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Tips and insights</p>
            </div>
            <div className="w-11 h-6 bg-gray-800 dark:bg-gray-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Privacy & Data</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
             Your data is securely stored locally on your device. SafeDays prioritizes your privacy.
          </p>
        </div>
        <Button variant="danger" fullWidth onClick={() => {
          if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            onClearData();
          }
        }}>
          <Trash2 className="w-4 h-4" /> Clear All Data
        </Button>
      </Card>

      <div className="text-center text-xs text-gray-400 px-4">
        <h4 className="font-bold text-gray-500 mb-1">About SafeDays</h4>
        <p>SafeDays helps you understand your menstrual cycle using the calendar method. This app is for educational purposes and should not replace professional medical advice.</p>
        <p className="mt-2">Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Settings;