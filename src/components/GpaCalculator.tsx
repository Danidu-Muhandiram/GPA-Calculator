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
    <div className="space-y-6">
      {/* Add Module Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
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
        <div className="mt-8">
          <button
            onClick={addModule}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
          >
            ➕ Add Course
          </button>
        </div>
      </div>

      {/* Modules Summary */}
      {modules.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
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
                <div key={module.id} className={`flex items-center justify-between p-5 rounded-lg border-l-4 ${getGradeColor(module.grade)} hover:shadow-sm transition-all duration-200`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="font-semibold text-lg text-text">{module.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        gradePoint >= 3.7 ? 'bg-green-500 text-white' :
                        gradePoint >= 3.0 ? 'bg-primary text-white' :
                        gradePoint >= 2.0 ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {module.grade}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
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

          {/* Summary Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors duration-200">
                <div className="text-2xl mb-2">📚</div>
                <p className="text-2xl font-bold text-text">{modules.length}</p>
                <p className="text-sm font-medium text-text-secondary">Courses</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors duration-200">
                <div className="text-2xl mb-2">⚖️</div>
                <p className="text-2xl font-bold text-text">
                  {modules.reduce((sum, module) => sum + module.credits, 0)}
                </p>
                <p className="text-sm font-medium text-text-secondary">Credits</p>
              </div>
              <div className={`rounded-lg p-6 text-center transition-colors duration-200 ${
                calculateGPA() >= 3.7 ? 'bg-green-50 hover:bg-green-100' :
                calculateGPA() >= 3.0 ? 'bg-orange-50 hover:bg-orange-100' :
                calculateGPA() >= 2.0 ? 'bg-yellow-50 hover:bg-yellow-100' :
                'bg-red-50 hover:bg-red-100'
              }`}>
                <div className="text-2xl mb-2">🎯</div>
                <p className={`text-2xl font-bold ${
                  calculateGPA() >= 3.7 ? 'text-green-600' :
                  calculateGPA() >= 3.0 ? 'text-primary' :
                  calculateGPA() >= 2.0 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {modules.length > 0 ? calculateGPA().toFixed(2) : '0.00'}
                </p>
                <p className="text-sm font-medium text-text-secondary">GPA</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors duration-200">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-2xl font-bold text-text">
                  {modules.length > 0 ? calculateTotalGradePoints().toFixed(1) : '0.0'}
                </p>
                <p className="text-sm font-medium text-text-secondary">Points</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {modules.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-6">📚</div>
          <h3 className="text-xl font-semibold text-text mb-3 font-display">Ready to calculate your GPA?</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Add your first course above to start tracking your academic progress and see your GPA in real-time!
          </p>
          <div className="inline-flex items-center gap-2 text-primary font-medium bg-primary/10 px-4 py-2 rounded-lg">
            <span>⬆️</span>
            <span>Start by adding a course above</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GpaCalculator;

