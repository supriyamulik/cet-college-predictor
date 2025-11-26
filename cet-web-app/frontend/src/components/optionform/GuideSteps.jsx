import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '../config/firebase';
import { 
  ArrowLeft, Target, AlertTriangle, CheckCircle, 
  Clock, Zap, TrendingUp, Shield, BookOpen,
  ChevronRight, Play, Pause, FastForward
} from 'lucide-react';

export default function GuideSteps() {
  //const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('strategy');

  const strategySections = [
    {
      id: 'strategy',
      title: '🎯 CAP Strategy Framework',
      icon: Target,
      content: {
        intro: 'The 3-Tier Approach to maximize your admission chances',
        tiers: [
          {
            name: 'TIER 1: Dream Colleges (20-30 options)',
            description: 'Your aspirational choices - slightly above your percentile range',
            color: 'red',
            examples: ['COEP Computer', 'PICT IT', 'VJTI Electronics'],
            tips: [
              'Include colleges where cutoff is 2-5% above your percentile',
              'Focus on premium locations and top-ranked institutes',
              'Perfect for "what if" scenarios in later rounds'
            ]
          },
          {
            name: 'TIER 2: Perfect Match (60-80 options)',
            description: 'Colleges perfectly aligned with your percentile range',
            color: 'blue',
            examples: ['DYPIT Computer', 'JSPM Mechanical', 'MMCOE Electronics'],
            tips: [
              'These should form the core of your option form',
              'Include multiple branches from same colleges',
              'Balance between location preference and college quality'
            ]
          },
          {
            name: 'TIER 3: Safety Net (40-50 options)',
            description: 'Secure backups ensuring you get admission somewhere',
            color: 'green',
            examples: ['Local private colleges', 'Newer institutes', 'Less competitive branches'],
            tips: [
              'Crucial for Round 3 and spot rounds',
              'Include colleges 5-10% below your percentile',
              'Don\'t skip this - it\'s your admission insurance'
            ]
          }
        ]
      }
    },
    {
      id: 'timeline',
      title: '⏰ CAP Timeline & Rounds',
      icon: Clock,
      content: {
        phases: [
          {
            stage: 'ROUND 1',
            duration: '3-4 days',
            focus: 'Dream colleges + Strategic positioning',
            action: 'Freeze if you get Tier 1, otherwise Float',
            warning: 'Never freeze in Round 1 unless absolutely sure'
          },
          {
            stage: 'ROUND 2',
            duration: '2-3 days',
            focus: 'Perfect match colleges + Revised strategy',
            action: 'Re-evaluate based on Round 1 cutoffs',
            warning: 'This is where most students get their final allotment'
          },
          {
            stage: 'ROUND 3+',
            duration: '1-2 days each',
            focus: 'Safety net + Remaining options',
            action: 'Freeze when you get acceptable college',
            warning: 'Don\'t wait too long - seats fill quickly'
          }
        ]
      }
    },
    {
      id: 'mistakes',
      title: '🚫 Common Fatal Mistakes',
      icon: AlertTriangle,
      content: {
        mistakes: [
          {
            mistake: 'Not using all 150 choices',
            impact: 'Reduces admission chances significantly',
            solution: 'Fill all slots strategically across tiers'
          },
          {
            mistake: 'Wrong priority order',
            impact: 'Might miss better college in same round',
            solution: 'Always prioritize college > branch > location'
          },
          {
            mistake: 'Freezing too early',
            impact: 'Missing better options in later rounds',
            solution: 'Use Float option until you get satisfactory college'
          },
          {
            mistake: 'Ignoring location preferences',
            impact: 'Might get stuck with inconvenient location',
            solution: 'Create location-wise clusters in your form'
          }
        ]
      }
    },
    {
      id: 'advanced',
      title: '⚡ Advanced Tactics',
      icon: Zap,
      content: {
        tactics: [
          {
            title: 'Branch vs College Priority',
            description: 'Always prioritize college reputation over branch preference for better career opportunities',
            example: 'COEP Mechanical > Private College Computer'
          },
          {
            title: 'The 20-60-70 Rule',
            description: 'Fill first 20 with dreams, next 60 with perfect matches, last 70 with safety nets',
            example: 'Creates optimal distribution across tiers'
          },
          {
            title: 'Location Clustering',
            description: 'Group colleges by city to manage reporting and travel',
            example: 'All Pune colleges together, then Mumbai, etc.'
          }
        ]
      }
    }
  ];

  const startBuilding = () => {
    navigate('/builder/form');
  };

  const goToPredictor = () => {
    navigate('/predictor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  CAP Option Form Master Guide
                </h1>
                <p className="text-sm text-gray-600">Strategic framework for 150 choices</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={goToPredictor}
                className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
              >
                Find Colleges
              </button>
              <button
                onClick={startBuilding}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Start Building
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 border-2 border-red-200 rounded-xl bg-red-50">
              <div className="text-2xl font-bold text-red-600">20-30</div>
              <div className="text-sm text-red-700 font-medium">Dream Colleges</div>
              <div className="text-xs text-red-600 mt-1">Tier 1</div>
            </div>
            <div className="p-4 border-2 border-blue-200 rounded-xl bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">60-80</div>
              <div className="text-sm text-blue-700 font-medium">Perfect Match</div>
              <div className="text-xs text-blue-600 mt-1">Tier 2</div>
            </div>
            <div className="p-4 border-2 border-green-200 rounded-xl bg-green-50">
              <div className="text-2xl font-bold text-green-600">40-50</div>
              <div className="text-sm text-green-700 font-medium">Safety Net</div>
              <div className="text-xs text-green-600 mt-1">Tier 3</div>
            </div>
            <div className="p-4 border-2 border-purple-200 rounded-xl bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">150</div>
              <div className="text-sm text-purple-700 font-medium">Total Options</div>
              <div className="text-xs text-purple-600 mt-1">Maximum</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
          {strategySections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          {activeSection === 'strategy' && <StrategySection data={strategySections[0].content} />}
          {activeSection === 'timeline' && <TimelineSection data={strategySections[1].content} />}
          {activeSection === 'mistakes' && <MistakesSection data={strategySections[2].content} />}
          {activeSection === 'advanced' && <AdvancedSection data={strategySections[3].content} />}
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Play className="w-8 h-8" />
              <div>
                <h3 className="text-xl font-bold">Ready to Build?</h3>
                <p className="text-blue-100">Start creating your optimized option form</p>
              </div>
            </div>
            <button
              onClick={startBuilding}
              className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              Launch Form Builder
              <FastForward className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8" />
              <div>
                <h3 className="text-xl font-bold">Need Colleges?</h3>
                <p className="text-gray-300">Find colleges matching your percentile</p>
              </div>
            </div>
            <button
              onClick={goToPredictor}
              className="w-full bg-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              Open Predictor
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Strategy Section Component
function StrategySection({ data }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{data.intro}</h2>
      <div className="space-y-6">
        {data.tiers.map((tier, index) => (
          <div key={index} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600">{tier.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                tier.color === 'red' ? 'bg-red-100 text-red-700' :
                tier.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {tier.color === 'red' ? 'ASPIRATIONAL' : 
                 tier.color === 'blue' ? 'OPTIMAL' : 'SECURE'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Examples
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {tier.examples.map((example, i) => (
                    <li key={i}>• {example}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  Pro Tips
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {tier.tips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Timeline Section Component
function TimelineSection({ data }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">CAP Admission Timeline Strategy</h2>
      <div className="space-y-4">
        {data.phases.map((phase, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-xl">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{phase.stage}</h3>
                <p className="text-sm text-gray-600">{phase.duration}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Primary Focus:</p>
                <p className="text-gray-600">{phase.focus}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Recommended Action:</p>
                <p className="text-gray-600">{phase.action}</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Warning:</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">{phase.warning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mistakes Section Component
function MistakesSection({ data }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Avoid These Critical Mistakes</h2>
      <div className="space-y-4">
        {data.mistakes.map((mistake, index) => (
          <div key={index} className="border-2 border-red-200 rounded-xl p-5 bg-red-50 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                ⚠️
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">{mistake.mistake}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Impact:</p>
                    <p className="text-gray-600">{mistake.impact}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Solution:</p>
                    <p className="text-gray-600">{mistake.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Advanced Section Component
function AdvancedSection({ data }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced CAP Strategies</h2>
      <div className="space-y-6">
        {data.tactics.map((tactic, index) => (
          <div key={index} className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-900 mb-2">{tactic.title}</h3>
                <p className="text-gray-700 mb-3">{tactic.description}</p>
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-sm font-semibold text-purple-800 mb-1">Example:</p>
                  <p className="text-purple-700">{tactic.example}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}