import React, { useState } from 'react';

// Interface for a single module
interface Module {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

// Main GPA Calculator component
const GpaCalculator: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Module>({
    id: '',
    name: '',
    credits: 0,
    grade: ''
  });

  // Add a new module to the list
  const addModule = () => {
    if (currentModule.name && currentModule.credits > 0 && currentModule.grade) {
      const newModule = {
        ...currentModule,
        id: Date.now().toString() // simple ID generation
      };
      setModules([...modules, newModule]);
      setCurrentModule({ id: '', name: '', credits: 0, grade: '' }); // reset form
    }
  };

  // Remove a module from the list
  const removeModule = (id: string) => {
    setModules(modules.filter(module => module.id !== id));
  };

  // Handle input changes
  const handleInputChange = (field: keyof Module, value: string | number) => {
    setCurrentModule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate GPA based on modules
  const calculateGPA = () => {
    if (modules.length === 0) return 0;
    
    let totalGradePoints = 0;
    let totalCredits = 0;
    
    modules.forEach(module => {
      const gradePoint = getGradePoint(module.grade);
      totalGradePoints += gradePoint * module.credits;
      totalCredits += module.credits;
    });
    
    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  };

  // Get grade point value for a grade
  const getGradePoint = (grade: string): number => {
    const gradePoints: { [key: string]: number } = {
      'A+': 4.0,
      'A': 4.0,
      'A-': 3.7,
      'B+': 3.3,
      'B': 3.0,
      'B-': 2.7,
      'C+': 2.3,
      'C': 2.0,
      'C-': 1.7,
      'D+': 1.3,
      'D': 1.0,
      'F': 0.0
    };
    return gradePoints[grade] || 0;
  };

  // Calculate total grade points
  const calculateTotalGradePoints = () => {
    return modules.reduce((sum, module) => {
      return sum + (getGradePoint(module.grade) * module.credits);
    }, 0);
  };

  return (
    <div className="space-y-8">
      {/* Full Width Add Course Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">📚</span>
          <h3 className="text-xl font-semibold text-text font-display">Add New Course</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Module Name Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-text mb-3">
              Course Name
            </label>
            <input
              type="text"
              value={currentModule.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Mathematics 101"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Credits Input */}
          <div>
            <label className="block text-sm font-semibold text-text mb-3">
              Credits
            </label>
            <input
              type="number"
              value={currentModule.credits || ''}
              onChange={(e) => handleInputChange('credits', parseInt(e.target.value) || 0)}
              placeholder="3"
              min="1"
              max="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Grade Select */}
          <div>
            <label className="block text-sm font-semibold text-text mb-3">
              Grade
            </label>
            <select
              value={currentModule.grade}
              onChange={(e) => handleInputChange('grade', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              <option value="">Select Grade</option>
              <option value="A+">A+ (4.0)</option>
              <option value="A">A (4.0)</option>
              <option value="A-">A- (3.7)</option>
              <option value="B+">B+ (3.3)</option>
              <option value="B">B (3.0)</option>
              <option value="B-">B- (2.7)</option>
              <option value="C+">C+ (2.3)</option>
              <option value="C">C (2.0)</option>
              <option value="C-">C- (1.7)</option>
              <option value="D+">D+ (1.3)</option>
              <option value="D">D (1.0)</option>
              <option value="F">F (0.0)</option>
            </select>
          </div>
        </div>

        {/* Add Module Button */}
        <div className="mt-6">
          <button
            onClick={addModule}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
          >
            ➕ Add Course
          </button>
        </div>
      </div>

      {/* Two Column Layout for Empty State and GPA Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Empty State */}
        {modules.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-semibold text-text mb-4 font-display">Ready to calculate your GPA?</h3>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Add your first course above to start tracking your academic progress and see your GPA in real-time!
            </p>
            <div className="inline-flex items-center gap-2 text-primary font-medium bg-primary/10 px-4 py-2 rounded-lg">
              <span>⬆️</span>
              <span>Start by adding a course above</span>
            </div>
          </div>
        )}

        {/* Modules Summary */}
        {modules.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">📊</span>
              <h3 className="text-xl font-semibold text-text font-display">Your Courses</h3>
            </div>
            
            <div className="space-y-4">
              {modules.map((module) => {
                const gradePoint = getGradePoint(module.grade);
                const getGradeColor = (grade: string) => {
                  const point = getGradePoint(grade);
                  if (point >= 3.7) return 'border-l-green-500 bg-green-50';
                  if (point >= 3.0) return 'border-l-primary bg-orange-50';
                  if (point >= 2.0) return 'border-l-yellow-500 bg-yellow-50';
                  return 'border-l-red-500 bg-red-50';
                };
                
                return (
                  <div key={module.id} className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${getGradeColor(module.grade)} hover:shadow-sm transition-all duration-200`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-text">{module.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          gradePoint >= 3.7 ? 'bg-green-500 text-white' :
                          gradePoint >= 3.0 ? 'bg-primary text-white' :
                          gradePoint >= 2.0 ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {module.grade}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-text-secondary">
                        <span>{module.credits} credits</span>
                        <span>•</span>
                        <span>{gradePoint.toFixed(1)} GPA points</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeModule(module.id)}
                      className="text-text-secondary hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GPA Circular Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🎯</span>
            <h3 className="text-xl font-semibold text-text font-display">GPA Overview</h3>
          </div>
          
          <div className="flex flex-col items-center">
            {/* Circular Progress */}
            <div className="relative w-40 h-40 mb-6">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={
                    calculateGPA() >= 3.7 ? '#22C55E' :
                    calculateGPA() >= 3.0 ? '#F88A22' :
                    calculateGPA() >= 2.0 ? '#F59E0B' :
                    '#EF4444'
                  }
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(calculateGPA() / 4.0) * 251.2} 251.2`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-3xl font-bold font-display ${
                  calculateGPA() >= 3.7 ? 'text-green-600' :
                  calculateGPA() >= 3.0 ? 'text-primary' :
                  calculateGPA() >= 2.0 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {modules.length > 0 ? calculateGPA().toFixed(2) : '0.00'}
                </div>
                <div className="text-sm font-medium text-text-secondary">Cumulative GPA</div>
              </div>
            </div>
            
            {/* GPA Range */}
            <div className="flex justify-between w-full max-w-40 mb-6">
              <span className="text-sm text-text-secondary">0.0</span>
              <span className="text-sm text-text-secondary">4.0</span>
            </div>

            {/* Summary Stats */}
            {modules.length > 0 && (
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-text">{modules.length}</div>
                  <div className="text-xs font-medium text-text-secondary">Courses</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-text">
                    {modules.reduce((sum, module) => sum + module.credits, 0)}
                  </div>
                  <div className="text-xs font-medium text-text-secondary">Credits</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-text">
                    {modules.length > 0 ? calculateTotalGradePoints().toFixed(1) : '0.0'}
                  </div>
                  <div className="text-xs font-medium text-text-secondary">Points</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GpaCalculator;

