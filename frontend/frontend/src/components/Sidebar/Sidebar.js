import React from 'react';

// Minimal sidebar: Dashboard, Completed, Remaining
// currentView highlights the active button
export default function Sidebar({ currentView, onSelect, onAddItem }) {
  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r bg-white">
      <div className="px-6 py-6 border-b">
        <div className="text-2xl font-semibold tracking-wide flex items-center gap-2">
          <span className="inline-block">BookVault</span>
          <span className="text-gray-400">📚</span>
        </div>
      </div>
      <nav className="p-3 space-y-1">
        <button
          type="button"
          onClick={() => onSelect && onSelect('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${currentView==='dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'}`}
        >
          <span className="text-lg">📊</span>
          <span>Dashboard</span>
        </button>
        <button
          type="button"
          onClick={() => onSelect && onSelect('completed')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${currentView==='completed' ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'}`}
        >
          <span className="text-lg">✅</span>
          <span>Completed Books</span>
        </button>
        <button
          type="button"
          onClick={() => onSelect && onSelect('remaining')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${currentView==='remaining' ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'}`}
        >
          <span className="text-lg">📖</span>
          <span>Remaining Books</span>
        </button>

        {/* Keep add item accessible from sidebar if desired */}
        {onAddItem && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onAddItem}
              className="w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <span className="text-lg">➕</span>
              <span>Add Book</span>
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
}
