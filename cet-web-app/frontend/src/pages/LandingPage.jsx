import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Award, BarChart3, TrendingUp, Users, Shield, Zap, Play, Clock, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showMockTest, setShowMockTest] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const observerRef = useRef(null);

  const handleNavigation = (path) => {
    // This preserves your navigation logic - you can integrate with your router
    console.log('Navigate to:', path);
    window.location.href = path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-2xl shadow-blue-500/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                🎓 CETInsights
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Testimonials</a>
              <button onClick={() => handleNavigation('/login')} className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                Login
              </button>
              <button onClick={() => handleNavigation('/signup')} className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-900">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded transition">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded transition">How It Works</a>
              <button onClick={() => handleNavigation('/login')} className="w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 rounded transition">Login</button>
              <button onClick={() => handleNavigation('/signup')} className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition">Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Immersive Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          />
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)',
            }}
          />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              transform: `translateY(${scrollY * 0.2}px) scale(${1 + scrollY * 0.0002})`,
              backgroundImage: 'radial-gradient(circle at 60% 30%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)',
            }}
          />
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-500 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Glassmorphic Floating Card */}
        <div 
          className="relative z-10 w-full max-w-5xl mx-auto px-4"
        >
          <div className="flex flex-col items-center justify-center">
            <div 
              className="backdrop-blur-2xl bg-white/90 border border-gray-200 rounded-3xl py-12 px-8 md:py-16 md:px-16 shadow-2xl w-full"
              style={{
                animation: 'floatIn 1s ease-out forwards',
                boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.2), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                  Your Gateway to <br />
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                    Top Engineering Colleges
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
                  AI-powered college predictions for MHT-CET 2025. Get personalized recommendations, build your option form, and secure your dream college.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => handleNavigation('/signup')} 
                    className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
                  >
                    <span className="relative z-10">Start Free Trial</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button className="group border-2 border-blue-600 text-blue-600 px-10 py-5 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300 backdrop-blur-sm flex items-center gap-2">
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Stats Bubbles */}
            <div className="mt-16 relative w-full max-w-4xl">
              <div className="relative h-48">
                <StatBubble number="10,000+" label="Students Helped" delay="0s" position="left-[5%] top-0" />
                <StatBubble number="500+" label="Colleges Covered" delay="0.2s" position="left-[30%] top-8" />
                <StatBubble number="95%" label="Accuracy Rate" delay="0.4s" position="right-[30%] top-4" />
                <StatBubble number="4.8/5" label="User Rating" delay="0.6s" position="right-[5%] top-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-blue-600/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-600/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section - Diagonal Staggered Layout */}
      <section id="features" className="py-32 px-4 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden" data-animate>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to make the right college choice</p>
          </div>

          {/* Diagonal Staggered Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="md:translate-y-0">
              <FeatureCard 
                icon={<Award className="w-12 h-12 text-blue-600" />}
                title="AI-Powered Predictions"
                description="Get accurate college predictions based on historical data and ML algorithms"
                delay="0s"
              />
            </div>
            <div className="md:translate-y-12">
              <FeatureCard 
                icon={<BarChart3 className="w-12 h-12 text-indigo-600" />}
                title="Smart Option Form"
                description="Build and optimize your CAP option form with intelligent recommendations"
                delay="0.1s"
              />
            </div>
            <div className="md:translate-y-24">
              <FeatureCard 
                icon={<TrendingUp className="w-12 h-12 text-purple-600" />}
                title="Analytics Dashboard"
                description="Visualize trends, cutoffs, and admission probabilities with interactive charts"
                delay="0.2s"
              />
            </div>
            <div className="md:translate-y-8">
              <FeatureCard 
                icon={<Users className="w-12 h-12 text-pink-600" />}
                title="Expert Guidance"
                description="Get personalized counseling from admission experts"
                delay="0.3s"
              />
            </div>
            <div className="md:translate-y-20">
              <FeatureCard 
                icon={<Shield className="w-12 h-12 text-green-600" />}
                title="100% Secure"
                description="Your data is encrypted and stored securely on Firebase"
                delay="0.4s"
              />
            </div>
            <div className="md:translate-y-32">
              <FeatureCard 
                icon={<Zap className="w-12 h-12 text-yellow-600" />}
                title="Real-Time Updates"
                description="Stay updated with latest cutoffs and admission notifications"
                delay="0.5s"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Scroll Reveal */}
      <section id="how-it-works" className="py-32 px-4 bg-blue-50 relative" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600">Simple 4-step process to find your perfect college</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard number="1" title="Sign Up" description="Create your free account in seconds" delay="0s" />
            <StepCard number="2" title="Enter Details" description="Provide your CET rank and preferences" delay="0.15s" />
            <StepCard number="3" title="Get Predictions" description="Receive AI-powered college recommendations" delay="0.3s" />
            <StepCard number="4" title="Build Option Form" description="Create optimized CAP option form" delay="0.45s" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Find Your Dream College?</h2>
          <p className="text-xl text-blue-100 mb-10">Join thousands of students who trusted CETInsights</p>
          <button 
            onClick={() => handleNavigation('/signup')} 
            className="bg-white text-blue-600 px-12 py-5 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-white/30 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">CETInsights</h3>
            <p className="text-gray-400">Your trusted partner for engineering college admissions</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2025 CETInsights. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Mock Test Launcher */}
      <button 
        onClick={() => setShowMockTest(true)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl shadow-blue-500/50 hover:scale-110 transition-all duration-300 group"
        style={{ animation: 'float 3s ease-in-out infinite' }}
      >
        <div className="relative">
          <Play className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
        </div>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Start Mock Test
        </span>
      </button>

      {/* Mock Test Modal */}
      {showMockTest && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl border border-gray-200"
            style={{ animation: 'scaleIn 0.3s ease-out' }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">CET Mock Test</h3>
                <p className="text-gray-600">Sample Question</p>
              </div>
              <button 
                onClick={() => setShowMockTest(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 flex items-center gap-4 text-gray-700">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-mono">45:00</span>
              </div>
              <div className="text-sm">Question 1 of 100</div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
              <p className="text-gray-900 text-lg mb-6">
                What is the value of the expression: <span className="font-mono text-blue-600">log₂(64) + log₃(27)</span>?
              </p>

              <div className="space-y-3">
                {['A) 8', 'B) 9', 'C) 10', 'D) 12'].map((option, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-6 py-4 bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-500 rounded-xl transition-all duration-300 text-gray-900 group"
                  >
                    <span className="group-hover:translate-x-2 inline-block transition-transform">{option}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-xl transition-colors">
                Skip
              </button>
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 group">
                Submit
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

function StatBubble({ number, label, delay, position }) {
  return (
    <div 
      className={`absolute ${position} animate-pulse`}
      style={{
        animation: `floatIn 0.8s ease-out ${delay} forwards, float 3s ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      <div className="backdrop-blur-xl bg-white/80 border border-blue-200 rounded-2xl px-6 py-4 shadow-xl hover:scale-110 transition-transform duration-300">
        <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{number}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <div 
      className="group p-8 backdrop-blur-xl bg-white/80 border border-gray-200 rounded-3xl hover:bg-white hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-rotate-1 relative overflow-hidden"
      style={{
        animation: `floatIn 0.8s ease-out ${delay} forwards`,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
      <div className="relative z-10">
        <div className="mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
}

function StepCard({ number, title, description, delay }) {
  return (
    <div 
      className="text-center group"
      style={{
        animation: `floatIn 0.8s ease-out ${delay} forwards`,
      }}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-xl shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative">
        {number}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}