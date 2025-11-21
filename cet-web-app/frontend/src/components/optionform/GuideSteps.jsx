import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

export default function GuideSteps({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('optionFormGuideProgress');
    if (savedProgress) {
      const { step, completed } = JSON.parse(savedProgress);
      setCurrentStep(step);
      setCompletedSteps(completed);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (step, completed) => {
    localStorage.setItem('optionFormGuideProgress', JSON.stringify({
      step,
      completed,
      lastUpdated: new Date().toISOString()
    }));
  };

  const steps = [
    {
      id: 'intro',
      title: 'What is an Option Form?',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            An <strong>Option Form</strong> (also called CAP - Centralized Admission Process) is your prioritized list of college-branch combinations you want to apply to.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Why is it important?
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>The system allots you a seat based on your rank and your option form order</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>You can fill up to 150 options (college + branch combinations)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>The order matters - list your dream colleges first!</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5">
            <p className="text-sm text-gray-700">
              <strong>Pro Tip:</strong> Once you're allotted a seat, the system stops checking options below that. So always prioritize carefully!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'seat-types',
      title: 'Understanding Seat Types',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Colleges have different <strong>seat categories</strong> based on reservation policies:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-600 mb-2">GOPEN (General Open)</h4>
              <p className="text-sm text-gray-600">Open to all candidates. Most competitive.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-600 mb-2">TFWS (Tuition Fee Waiver)</h4>
              <p className="text-sm text-gray-600">Free tuition for eligible students. Income criteria applies.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-purple-600 mb-2">GSCS / GSTS / GOBC</h4>
              <p className="text-sm text-gray-600">Reserved categories for SC/ST/OBC candidates.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-orange-600 mb-2">GOPENS / LOBCS</h4>
              <p className="text-sm text-gray-600">Open seats for ladies (gender-specific).</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-red-600 mb-2">PWDOPENS / DEFOPENS</h4>
              <p className="text-sm text-gray-600">Reserved for differently-abled candidates.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-indigo-600 mb-2">EWS (Economically Weaker)</h4>
              <p className="text-sm text-gray-600">10% reservation for economically weaker sections.</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-900">
              <strong>Important:</strong> You can only apply for seat types that match your eligibility. Check your caste/income certificates before filling.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'rounds',
      title: 'CAP Rounds & Freeze/Float',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-5">
            <h4 className="font-bold text-lg mb-3">📅 CAP has 3 rounds of allotment</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Round 1:</strong> First allotment based on your option form</p>
              <p><strong>Round 2:</strong> If you "float", you may get upgraded to a better option</p>
              <p><strong>Round 3:</strong> Final round for remaining seats</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-xl">
              <h5 className="font-semibold text-green-900 mb-2">✅ FREEZE</h5>
              <p className="text-sm text-green-800">
                Accept the allotted seat and exit CAP. You won't participate in future rounds. Choose this if you're satisfied with your allotment.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-xl">
              <h5 className="font-semibold text-blue-900 mb-2">🔄 FLOAT</h5>
              <p className="text-sm text-blue-800">
                Accept the seat BUT remain in CAP for better options. If you get upgraded, great! If not, you keep this seat.
              </p>
            </div>

            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-xl">
              <h5 className="font-semibold text-red-900 mb-2">❌ REJECT</h5>
              <p className="text-sm text-red-800">
                Reject the seat and wait for next round. <strong>Risky!</strong> You might not get any seat later.
              </p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-purple-900">
              <strong>Strategy:</strong> Most students choose "Float" in Round 1 to see if they get upgraded in Round 2.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'strategy',
      title: 'Filling Strategy',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            How you order your options determines your success. Here are <strong>3 proven strategies</strong>:
          </p>

          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                🎯 Safety-First Strategy (Conservative)
              </h4>
              <p className="text-sm text-green-800 mb-3">Best for students who want guaranteed admission</p>
              <div className="space-y-2 text-sm text-green-700">
                <p><strong>70% Backup colleges</strong> - Colleges where your percentile is well above cutoff</p>
                <p><strong>20% Moderate colleges</strong> - Colleges matching your percentile</p>
                <p><strong>10% Dream colleges</strong> - Stretch goals</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                ⚖️ Balanced Strategy (Recommended)
              </h4>
              <p className="text-sm text-blue-800 mb-3">Best for most students - balanced risk/reward</p>
              <div className="space-y-2 text-sm text-blue-700">
                <p><strong>15% Dream colleges</strong> - Top stretch goals</p>
                <p><strong>50% Moderate colleges</strong> - Perfect matches</p>
                <p><strong>35% Backup colleges</strong> - Safety net</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-5">
              <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                🚀 Ambitious Strategy (Aggressive)
              </h4>
              <p className="text-sm text-orange-800 mb-3">For students willing to take calculated risks</p>
              <div className="space-y-2 text-sm text-orange-700">
                <p><strong>40% Dream colleges</strong> - Aim high!</p>
                <p><strong>40% Moderate colleges</strong> - Realistic options</p>
                <p><strong>20% Backup colleges</strong> - Minimum safety</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-900">
              <strong>Remember:</strong> You can always adjust your strategy based on Round 1 results before Round 2!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'mistakes',
      title: 'Common Mistakes to Avoid',
      icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            Learn from others' mistakes! Here are the <strong>top 5 errors</strong> students make:
          </p>

          <div className="space-y-3">
            {[
              {
                title: '❌ Filling only dream colleges',
                description: 'If your rank doesn\'t match, you get NOTHING. Always add backup options.',
                color: 'red'
              },
              {
                title: '❌ Ignoring branch preferences',
                description: 'Don\'t just chase college names. A good branch at a decent college > Poor branch at top college.',
                color: 'orange'
              },
              {
                title: '❌ Not checking eligibility',
                description: 'Filling TFWS/EWS without valid certificates wastes your options.',
                color: 'yellow'
              },
              {
                title: '❌ Random ordering',
                description: 'The order matters! Don\'t randomly shuffle - prioritize strategically.',
                color: 'purple'
              },
              {
                title: '❌ Forgetting to submit',
                description: 'Fill AND submit before deadline. Draft saves don\'t count!',
                color: 'pink'
              }
            ].map((mistake, idx) => (
              <div key={idx} className={`bg-${mistake.color}-50 border border-${mistake.color}-200 rounded-xl p-4`}>
                <h5 className={`font-semibold text-${mistake.color}-900 mb-2`}>{mistake.title}</h5>
                <p className={`text-sm text-${mistake.color}-800`}>{mistake.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
            <h4 className="font-bold text-green-900 mb-2">✅ Pro Checklist</h4>
            <ul className="space-y-1 text-sm text-green-800">
              <li>✓ Verified all eligibility documents</li>
              <li>✓ Filled 100+ options (use all 150 slots)</li>
              <li>✓ Mixed dream, moderate, and backup colleges</li>
              <li>✓ Double-checked college codes before submission</li>
              <li>✓ Taken screenshots of final form</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      const newCompleted = [...new Set([...completedSteps, currentStep])];
      setCurrentStep(newStep);
      setCompletedSteps(newCompleted);
      saveProgress(newStep, newCompleted);
    } else {
      // Mark guide as completed
      localStorage.setItem('optionFormGuideCompleted', 'true');
      onComplete?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      saveProgress(newStep, completedSteps);
    }
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
    saveProgress(stepIndex, completedSteps);
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 shadow-xl mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <StepIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h1>
              <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => goToStep(idx)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  idx === currentStep 
                    ? 'text-blue-600' 
                    : completedSteps.includes(idx)
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === currentStep
                    ? 'bg-blue-600 text-white'
                    : completedSteps.includes(idx)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {completedSteps.includes(idx) ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                <span className="text-xs hidden md:block">{step.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-8 shadow-xl mb-6">
          {currentStepData.content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            {currentStep === steps.length - 1 ? 'Complete Guide' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}