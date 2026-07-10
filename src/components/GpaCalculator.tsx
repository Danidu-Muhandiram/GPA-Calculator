import React, { useState } from 'react';

type ActiveView = 'modules' | 'overall';

interface Module {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

// Interface for form sets
interface FormSet {
  id: string;
  module: Module;
}

interface GpaCalculatorProps {
  activeView: ActiveView;
}

// Main GPA Calculator component
const GpaCalculator: React.FC<GpaCalculatorProps> = ({ activeView }) => {
  // Module GPA state
  const [modules, setModules] = useState<Module[]>([]);
  const [formSets, setFormSets] = useState<FormSet[]>([
    {
      id: 'default',
      module: { id: '', name: '', credits: 0, grade: '' },
    },
  ]);
  const [cumulativeCredits, setCumulativeCredits] = useState('');
  const [cumulativeGradePoints, setCumulativeGradePoints] = useState('');
  const [showTheoryFaq, setShowTheoryFaq] = useState(false);
  const [showExampleFaq, setShowExampleFaq] = useState(false);
  const [showGradingSystem, setShowGradingSystem] = useState(false);

  // Create another module form
  const addNewFormSet = () => {
    const newFormSet: FormSet = {
      id: Date.now().toString(),
      module: { id: '', name: '', credits: 0, grade: '' },
    };
    setFormSets([...formSets, newFormSet]);
  };

  // Delete a module form
  const removeFormSet = (formSetId: string) => {
    if (formSets.length > 1) {
      setModules((prevModules) => prevModules.filter((module) => module.id !== formSetId));
      setFormSets(formSets.filter((fs) => fs.id !== formSetId));
    }
  };

  // Handle input changes
  const updateFormSet = (formSetId: string, field: keyof Module, value: string | number) => {
    const updatedFormSets = formSets.map((fs) =>
      fs.id === formSetId ? { ...fs, module: { ...fs.module, [field]: value } } : fs
    );

    setFormSets(updatedFormSets);

    const updatedFormSet = updatedFormSets.find((fs) => fs.id === formSetId);
    const isComplete = Boolean(
      updatedFormSet?.module.name &&
        updatedFormSet.module.credits > 0 &&
        updatedFormSet.module.grade
    );

    setModules((prevModules) => {
      const existingIndex = prevModules.findIndex((module) => module.id === formSetId);

      if (isComplete && updatedFormSet) {
        const nextModule = { ...updatedFormSet.module, id: formSetId };

        if (existingIndex >= 0) {
          const nextModules = [...prevModules];
          nextModules[existingIndex] = nextModule;
          return nextModules;
        }

        return [...prevModules, nextModule];
      }

      if (!isComplete && existingIndex >= 0) {
        return prevModules.filter((module) => module.id !== formSetId);
      }

      return prevModules;
    });
  };

  // Get grade point value for a grade
  const getGradePoint = (grade: string): number => {
    const gradePoints: { [key: string]: number } = {
      'A+': 4.0,
      A: 4.0,
      'A-': 3.7,
      'B+': 3.3,
      B: 3.0,
      'B-': 2.7,
      'C+': 2.3,
      C: 2.0,
      'C-': 1.7,
      'D+': 1.3,
      D: 1.0,
      F: 0.0,
    };

    return gradePoints[grade] ?? 0;
  };

  // Calculate GPA based on modules
  const calculateGPA = () => {
    if (modules.length === 0) return 0;

    let totalGradePoints = 0;
    let totalCredits = 0;

    modules.forEach((module) => {
      const gradePoint = getGradePoint(module.grade);
      totalGradePoints += gradePoint * module.credits;
      totalCredits += module.credits;
    });

    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  };

  // Calculate total grade points
  const calculateTotalGradePoints = () => {
    return modules.reduce((sum, module) => sum + getGradePoint(module.grade) * module.credits, 0);
  };

  // Parse overall GPA input values
  const parseOverallInput = (value: string) => {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  };

  // Calculate CGPA from cumulative values
  const calculateOverallGPA = () => {
    const credits = parseOverallInput(cumulativeCredits);
    const gradePoints = parseOverallInput(cumulativeGradePoints);

    if (credits <= 0) return 0;

    return gradePoints / credits;
  };

  const overallCredits = parseOverallInput(cumulativeCredits);
  const overallGradePoints = parseOverallInput(cumulativeGradePoints);
  const overallGpa = calculateOverallGPA();

  const overallFaqItems = [
    'Overall GPA is weighted, not a simple average.',
    'Use total cumulative grade points and total cumulative credits.',
    'Formula: CGPA = Total Grade Points ÷ Total Credits.',
    'Equal credits: (105 + 96) ÷ (30 + 30) = 3.35',
    'Different credits: ((40 × 3.50) + (20 × 3.20)) ÷ 60 = 3.40',
  ];

  const gradingSystemRows = [
    { grade: 'A+', points: '4.00', range: '90 - 100' },
    { grade: 'A', points: '4.00', range: '80 - 89' },
    { grade: 'A-', points: '3.70', range: '75 - 79' },
    { grade: 'B+', points: '3.30', range: '70 - 74' },
    { grade: 'B', points: '3.00', range: '65 - 69' },
    { grade: 'B-', points: '2.70', range: '60 - 64' },
    { grade: 'C+', points: '2.30', range: '55 - 59' },
    { grade: 'C', points: '2.00', range: '45 - 54' },
    { grade: 'C-', points: '1.70', range: '40 - 44' },
    { grade: 'D+', points: '1.30', range: '35 - 39' },
    { grade: 'D', points: '1.00', range: '30 - 34' },
    { grade: 'E', points: '0.00', range: '00 - 29' },
  ];

  // Overall GPA view
  if (activeView === 'overall') {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-[#0F1626] rounded border-2 border-slate-800 p-4 sm:p-8">
          {/* Overall GPA inputs and result */}
          <div className="mb-6 sm:mb-8 border-b border-slate-800/80 pb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">Overall GPA</h3>
            <p className="text-slate-300 text-sm sm:text-base mt-1">Calculate CGPA from cumulative totals</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#131C2E] rounded border border-slate-800 p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2">Cumulative Credits</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cumulativeCredits}
                  onChange={(e) => setCumulativeCredits(e.target.value)}
                  placeholder="e.g. 120 (total credits)"
                  className="w-full px-3 py-2 border border-slate-800 rounded bg-[#0A0E1A] text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2">Cumulative Grade Points</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cumulativeGradePoints}
                  onChange={(e) => setCumulativeGradePoints(e.target.value)}
                  placeholder="e.g. 396 (total grade points)"
                  className="w-full px-3 py-2 border border-slate-800 rounded bg-[#0A0E1A] text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors duration-200 text-sm"
                />
              </div>
            </div>

            <div className="bg-[#131C2E] rounded border border-slate-800 p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400 font-semibold">Overall GPA</div>
              <div className={`text-4xl sm:text-5xl font-bold font-display ${overallGpa >= 3.7 ? 'text-green-500' : 'text-primary'}`}>
                {overallCredits > 0 ? overallGpa.toFixed(2) : '0.00'}
              </div>
              <div className="text-slate-300 text-sm sm:text-base max-w-md">
                Weighted GPA based on cumulative grade points and credits.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-2">
                <div className="bg-[#0A0E1A] rounded border border-slate-800 p-3">
                  <div className="text-xs text-slate-400">Credits</div>
                  <div className="text-lg font-bold text-slate-100">{overallCredits.toFixed(2)}</div>
                </div>
                <div className="bg-[#0A0E1A] rounded border border-slate-800 p-3">
                  <div className="text-xs text-slate-400">Grade Points</div>
                  <div className="text-lg font-bold text-slate-100">{overallGradePoints.toFixed(2)}</div>
                </div>
                <div className="bg-[#0A0E1A] rounded border border-slate-800 p-3">
                  <div className="text-xs text-slate-400">CGPA</div>
                  <div className="text-lg font-bold text-slate-100">{overallCredits > 0 ? overallGpa.toFixed(2) : '0.00'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ / theory section */}
        <div className="bg-[#0F1626] rounded border-2 border-slate-800 p-6 sm:p-8">
          <button
            type="button"
            onClick={() => setShowTheoryFaq((prev) => !prev)}
            className="w-full flex items-center justify-between gap-4 text-left"
            aria-expanded={showTheoryFaq}
          >
            <h3 className="text-xl sm:text-xl font-bold text-slate-100 font-display">Why this formula is correct</h3>
            <span className="text-primary text-sm font-bold uppercase tracking-[0.2em]">
              {showTheoryFaq ? 'Hide' : 'Show'}
            </span>
          </button>

          {showTheoryFaq && (
            <div className="mt-4 space-y-3 text-slate-300 leading-relaxed">
              {overallFaqItems.map((point) => (
                <p key={point} className="bg-[#131C2E] border border-slate-800 rounded p-4">
                  {point}
                </p>
              ))}
            </div>
          )}
        </div>

      </div>
    );
  }

  // Module GPA view
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Add Course Form */}
      <div className="bg-[#0F1626] rounded border-2 border-slate-800 p-4 sm:p-8">
        <div className="mb-6 sm:mb-8 border-b border-slate-800/80 pb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 font-display">Add New Module</h3>
        </div>

        {/* Module Input Table */}
        <div className="bg-[#131C2E] rounded border border-slate-800 p-4">
          {/* Headers */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-7">
              <h4 className="text-sm font-bold text-slate-200">Module Name</h4>
            </div>
            <div className="col-span-2 text-center">
              <h4 className="text-sm font-bold text-slate-200">Credits</h4>
            </div>
            <div className="col-span-2 text-center">
              <h4 className="text-sm font-bold text-slate-200">Grade</h4>
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Module Rows */}
          {formSets.map((formSet) => (
            <div key={formSet.id} className="grid grid-cols-12 mb-4 items-center">
              {/* Module Name Input */}
              <div className="col-span-7 pr-4">
                <input
                  type="text"
                  value={formSet.module.name}
                  onChange={(e) => updateFormSet(formSet.id, 'name', e.target.value)}
                  placeholder="Module name (required)"
                  required
                  className="w-full px-3 py-2 border border-slate-800 rounded bg-[#0A0E1A] text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors duration-200 text-sm"
                />
              </div>

              {/* Credits Input */}
              <div className="col-span-2 px-2">
                <input
                  type="number"
                  value={formSet.module.credits || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (value >= 0) {
                      updateFormSet(formSet.id, 'credits', value);
                    }
                  }}
                  placeholder="0"
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-slate-800 rounded bg-[#0A0E1A] text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors duration-200 text-sm text-center"
                />
              </div>

              {/* Grade Select */}
              <div className="col-span-2 px-2">
                <select
                  value={formSet.module.grade}
                  onChange={(e) => updateFormSet(formSet.id, 'grade', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-800 rounded bg-[#0A0E1A] text-white focus:outline-none focus:border-primary transition-colors duration-200 text-sm text-center"
                >
                  <option value="" className="bg-[#0A0E1A]">Select Grade</option>
                  <option value="A+" className="bg-[#0A0E1A]">A+</option>
                  <option value="A" className="bg-[#0A0E1A]">A</option>
                  <option value="A-" className="bg-[#0A0E1A]">A-</option>
                  <option value="B+" className="bg-[#0A0E1A]">B+</option>
                  <option value="B" className="bg-[#0A0E1A]">B</option>
                  <option value="B-" className="bg-[#0A0E1A]">B-</option>
                  <option value="C+" className="bg-[#0A0E1A]">C+</option>
                  <option value="C" className="bg-[#0A0E1A]">C</option>
                  <option value="C-" className="bg-[#0A0E1A]">C-</option>
                  <option value="D+" className="bg-[#0A0E1A]">D+</option>
                  <option value="D" className="bg-[#0A0E1A]">D</option>
                  <option value="E" className="bg-[#0A0E1A]">F</option>
                </select>
              </div>

              {/* Remove Button */}
              <div className="col-span-1 flex justify-center">
                {formSets.length > 1 && (
                  <button
                    onClick={() => removeFormSet(formSet.id)}
                    className="w-8 h-8 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center font-bold"
                  >
                    <span className="text-lg">−</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add Module Button */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={addNewFormSet}
                className="bg-primary text-black px-6 py-2.5 rounded hover:bg-primary/95 transition-colors font-bold flex items-center gap-2 text-sm border-2 border-primary"
              >
                <span className="text-base font-extrabold">+</span>
                Add Module
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Empty State and GPA Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Empty State */}
        {modules.length === 0 && (
          <div className="bg-[#0F1626] rounded border-2 border-slate-800 p-8 sm:p-16 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4 sm:mb-6 font-display">Ready to calculate your GPA?</h3>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Add your first module above to start tracking your academic progress and see your GPA in real-time!
            </p>
            <div className="inline-flex items-center gap-3 text-primary font-bold bg-primary/10 px-6 sm:px-8 py-4 sm:py-5 rounded border-2 border-primary/20 text-base sm:text-lg">
              <span>Start by adding a module above</span>
            </div>
          </div>
        )}

        {/* Modules Summary */}
        {modules.length > 0 && (
          <div className="bg-[#0F1626] rounded border-2 border-slate-800 p-6 sm:p-10">
            <div className="mb-8 border-b border-slate-800/80 pb-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">Your Modules</h3>
              <p className="text-slate-300 text-sm sm:text-base mt-1">Track your academic progress</p>
            </div>

            <div className="space-y-3">
              {modules.map((module, index) => {
                const gradePoint = getGradePoint(module.grade);
                const getGradeColor = (grade: string) => {
                  const point = getGradePoint(grade);
                  if (point >= 3.7) return 'border-l-green-500 bg-[#131C2E]';
                  if (point >= 3.0) return 'border-l-primary bg-[#131C2E]';
                  if (point >= 2.0) return 'border-l-orange-400 bg-[#131C2E]';
                  return 'border-l-red-500 bg-[#131C2E]';
                };

                return (
                  <div key={module.id} className={`group flex items-center gap-4 p-4 rounded border-2 border-slate-800 border-l-4 ${getGradeColor(module.grade)}`}>
                    <div className="w-8 h-8 bg-slate-800 text-white rounded flex items-center justify-center text-sm font-bold flex-shrink-0 border border-slate-700">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-slate-200 text-base truncate">{module.name}</h4>
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-bold ${
                            gradePoint >= 3.7
                              ? 'bg-green-500 text-black'
                              : gradePoint >= 3.0
                              ? 'bg-primary text-black'
                              : gradePoint >= 2.0
                              ? 'bg-orange-400 text-black'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {module.grade}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                        <span>{module.credits} Credits</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GPA Circular Progress */}
        <div className="bg-[#0F1626] rounded border-2 border-slate-800 p-6 sm:p-10">
          <div className="mb-8 border-b border-slate-800/80 pb-4">
            <h3 className="text-2xl sm:text-2xl font-bold text-slate-100 mb-4 sm:mb-6 font-display">GPA Overview</h3>
            <p className="text-slate-300 text-sm sm:text-base mt-1">Track your academic performance</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-36 h-24 sm:w-48 sm:h-32 mb-4 sm:mb-6">
              <svg className="w-36 h-24 sm:w-48 sm:h-32" viewBox="0 0 200 100">
                <path d="M 20 80 A 80 80 0 0 1 180 80" stroke="#1E293B" strokeWidth="12" fill="none" strokeLinecap="round" />
                <path
                  d="M 20 80 A 80 80 0 0 1 180 80"
                  stroke={calculateGPA() >= 3.7 ? '#22C55E' : '#FF7A00'}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(calculateGPA() / 4.0) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 sm:pt-8">
                <div className={`text-2xl sm:text-4xl font-bold font-display ${calculateGPA() >= 3.7 ? 'text-green-500' : 'text-primary'}`}>
                  {modules.length > 0 ? calculateGPA().toFixed(2) : '0.00'}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-300">Cumulative GPA</div>
              </div>
            </div>

            <div className="flex justify-between w-full max-w-36 sm:max-w-48 mb-4 sm:mb-6 px-2 sm:px-4">
              <span className="text-xs sm:text-sm text-slate-300">0.0</span>
              <span className="text-xs sm:text-sm text-slate-300">4.0</span>
            </div>

            {modules.length > 0 && (
              <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full">
                <div className="bg-[#131C2E] rounded border border-slate-800 p-4 sm:p-6 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-100">{modules.length}</div>
                  <div className="text-sm sm:text-base font-bold text-slate-300">Modules</div>
                </div>
                <div className="bg-[#131C2E] rounded border border-slate-800 p-4 sm:p-6 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-100">
                    {modules.reduce((sum, module) => sum + module.credits, 0)}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-300">Credits</div>
                </div>
                <div className="bg-[#131C2E] rounded border border-slate-800 p-4 sm:p-6 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-100">
                    {calculateTotalGradePoints().toFixed(1)}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-300">Points</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grading system reference */}
        <div className="bg-[#0F1626] rounded border-2 border-slate-800 p-6 sm:p-8 lg:col-span-2">
          <button
            type="button"
            onClick={() => setShowGradingSystem((prev) => !prev)}
            className="w-full flex items-center justify-between gap-4 text-left"
            aria-expanded={showGradingSystem}
          >
            <h3 className="text-lg sm:text-lg font-bold text-slate-100 font-display">Grading System</h3>
            <span className="text-primary text-sm font-bold uppercase tracking-[0.2em]">
              {showGradingSystem ? 'Hide' : 'Show'}
            </span>
          </button>

          {showGradingSystem && (
            <div className="mt-4 overflow-hidden rounded border border-slate-800 bg-[#131C2E]">
              <div className="grid grid-cols-3 gap-0 bg-[#0A0E1A] text-slate-100 text-xs sm:text-sm font-bold uppercase tracking-[0.15em]">
                <div className="px-4 py-3 border-r border-slate-800">Grade</div>
                <div className="px-4 py-3 border-r border-slate-800 text-center">Grade Pts.</div>
                <div className="px-4 py-3 text-center">Marks Range</div>
              </div>

              <div className="divide-y divide-slate-800">
                {gradingSystemRows.map((row) => (
                  <div key={row.grade} className="grid grid-cols-3 text-sm sm:text-base text-slate-200">
                    <div className="px-4 py-3 border-r border-slate-800 font-semibold">{row.grade}</div>
                    <div className="px-4 py-3 border-r border-slate-800 text-center">{row.points}</div>
                    <div className="px-4 py-3 text-center">{row.range}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GpaCalculator;

