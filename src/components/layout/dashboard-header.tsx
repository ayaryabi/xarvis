import React from 'react';

// Placeholder component - can add user info, search, actions later

export function DashboardHeader() {
  return (
    <div className="flex h-full items-center justify-between px-4 md:px-6">
      {/* Left side - Branding or Context */}
      <div>
        <span className="text-lg font-semibold text-gray-900 dark:text-white">XARVIS</span>
        {/* Could show current org name here */}
      </div>

      {/* Right side - Actions, User Menu */}
      <div className="flex items-center space-x-4">
        <button className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          Feedback
        </button>
        {/* Add Notification Icon, User Menu Dropdown etc. later */}
        <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
          U
        </div>
      </div>
    </div>
  );
} 