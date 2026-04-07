"use client";

interface Tab {
  key: string;
  label: string;
  icon?: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex border-b-2 border-[var(--border-light)] overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex items-center gap-1.5 px-4 sm:px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px] whitespace-nowrap shrink-0 ${
            activeTab === tab.key
              ? "text-[var(--primary)] border-[var(--primary)]"
              : "text-[var(--text-muted)] border-transparent hover:text-[var(--foreground)]"
          }`}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
