
import React from 'react';
import { Calculator, Users, TrendingUp, FileSpreadsheet, Store } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  setActiveTab,
  setIsMobileMenuOpen
}) => {
  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'vendors', label: 'Vendors', icon: Store },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'export', label: 'Export', icon: FileSpreadsheet }
  ];

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setIsMobileMenuOpen(false);
            }}
            className={`flex-shrink-0 flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-3 font-medium transition-colors min-w-[80px] sm:min-w-0 ${
              activeTab === tab.id
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationTabs;
