import React, { useState } from 'react';
import GpaCalculator from './components/GpaCalculator';

// Main app component with navbar and content sections
function App() {
  const [activeTab, setActiveTab] = useState('calculator'); // track which tab is active

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              {/* Logo/brand */}
              <h1 className="text-2xl font-semibold text-text flex items-center gap-2">
                <span className="text-primary">🎓</span>
                GPA Calculator
              </h1>
            </div>
            
            {/* Navigation tabs */}
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-w-[140px] ${
                  activeTab === 'calculator'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text hover:bg-gray-100'
                }`}
              >
                GPA Calculator
              </button>
              <button
                onClick={() => setActiveTab('planner')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-w-[140px] ${
                  activeTab === 'planner'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text hover:bg-gray-100'
                }`}
              >
                GPA Planner
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main className="max-w-6xl mx-auto py-8 px-6">
        {activeTab === 'calculator' && (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-text mb-3">Calculate your GPA</h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Track your academic progress and calculate your GPA with our intuitive grade calculator
              </p>
            </div>
            {/* GPA Calculator component */}
            <GpaCalculator />
          </div>
        )}
        
        {activeTab === 'planner' && (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-text mb-3">Plan your GPA</h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Plan your future grades to reach your target GPA
              </p>
            </div>
            {/* GPA Planner component will go here */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-text mb-2">GPA Planner Coming Soon</h3>
              <p className="text-text-secondary">Advanced planning features are in development!</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
