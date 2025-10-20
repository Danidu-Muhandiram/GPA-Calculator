import React, { useState } from 'react';
import './App.css';
import GpaCalculator from './components/GpaCalculator';

// Main app component with navbar and content sections
function App() {
  const [activeTab, setActiveTab] = useState('calculator'); // track which tab is active

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo/brand */}
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-text">🎓 GPA Tools</h1>
              </div>
              
              {/* Navigation tabs */}
              <div className="ml-10 flex space-x-8">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'calculator'
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text hover:bg-gray-50'
                  }`}
                >
                  GPA Calculator
                </button>
                <button
                  onClick={() => setActiveTab('planner')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'planner'
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text hover:bg-gray-50'
                  }`}
                >
                  GPA Planner
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {activeTab === 'calculator' && (
          <div>
            <h2 className="text-3xl font-bold text-text mb-8">GPA Calculator</h2>
            <p className="text-text-secondary mb-8">
              Add your modules and grades to calculate your GPA
            </p>
            {/* GPA Calculator component */}
            <GpaCalculator />
          </div>
        )}
        
        {activeTab === 'planner' && (
          <div>
            <h2 className="text-3xl font-bold text-text mb-8">GPA Planner</h2>
            <p className="text-text-secondary mb-8">
              Plan your future grades to reach your target GPA
            </p>
            {/* GPA Planner component will go here */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-text-secondary">GPA Planner form coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
