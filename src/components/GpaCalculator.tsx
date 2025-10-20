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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-text mb-4">Add New Module</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Module Name Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text mb-2">
              Module Name
            </label>
            <input
              type="text"
              value={currentModule.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Mathematics 101"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Credits Input */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Credits
            </label>
            <input
              type="number"
              value={currentModule.credits || ''}
              onChange={(e) => handleInputChange('credits', parseInt(e.target.value) || 0)}
              placeholder="3"
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Grade Select */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Grade
            </label>
            <select
              value={currentModule.grade}
              onChange={(e) => handleInputChange('grade', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
        <div className="mt-4">
          <button
            onClick={addModule}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors font-medium"
          >
            Add Module
          </button>
        </div>
      </div>

      {/* Modules Summary */}
      {modules.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-text mb-4">Your Modules</h3>
          
          <div className="space-y-3">
            {modules.map((module) => (
              <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-text">{module.name}</h4>
                  <p className="text-sm text-text-secondary">
                    {module.credits} credits • Grade: {module.grade}
                  </p>
                </div>
                <button
                  onClick={() => removeModule(module.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{modules.length}</p>
                <p className="text-sm text-text-secondary">Total Modules</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {modules.reduce((sum, module) => sum + module.credits, 0)}
                </p>
                <p className="text-sm text-text-secondary">Total Credits</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {modules.length > 0 ? calculateGPA().toFixed(2) : '0.00'}
                </p>
                <p className="text-sm text-text-secondary">GPA</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {modules.length > 0 ? calculateTotalGradePoints().toFixed(1) : '0.0'}
                </p>
                <p className="text-sm text-text-secondary">Grade Points</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {modules.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-text mb-2">No modules added yet</h3>
          <p className="text-text-secondary">Add your first module above to get started!</p>
        </div>
      )}
    </div>
  );
};

export default GpaCalculator;

