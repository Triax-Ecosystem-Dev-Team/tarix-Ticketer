import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import SearchForm from './SearchForm';

const MobileSearchButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-brand-blue-dark to-brand-blue-light text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl active:scale-95 transition-all"
      >
        <Filter className="w-6 h-6" />
      </button>

      {/* Mobile Modal */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative min-h-full flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl shadow-xl transform transition-all">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border-gray">
                <h2 className="text-lg font-bold text-text-dark">
                  Search Filters
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Form */}
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                <SearchForm onSearch={() => setIsOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileSearchButton;
