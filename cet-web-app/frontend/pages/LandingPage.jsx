import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Award, BarChart3, TrendingUp, Users, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                🎓 CETInsights
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">Testimonials</a>
              <button onClick={() => navigate('/login')} className="text-gray-700 hover:text-blue-600 transition">
                Login
              </button>
              <button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">How It Works</a>
              <button onClick={() => navigate('/login')} className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">Login</button>
              <button onClick={() => navigate('/signup')} className="w-full bg-blue-600 text-white px-3 py-2 rounded">Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Your Gateway to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Top Engineering Colleges</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered college predictions for MHT-CET 2025. Get personalized recommendations, build your option form, and secure your dream college.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="10,000+" label="Students Helped" />
            <StatCard number="500+" label="Colleges Covered" />
            <StatCard number="95%" label="Accuracy Rate" />
            <StatCard number="4.8/5" label="User Rating" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to make the right college choice</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Award className="w-12 h-12 text-blue-600" />}
              title="AI-Powered Predictions"
              description="Get accurate college predictions based on historical data and ML algorithms"
            />
            <FeatureCard 
              icon={<BarChart3 className="w-12 h-12 text-indigo-600" />}
              title="Smart Option Form"
              description="Build and optimize your CAP option form with intelligent recommendations"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-12 h-12 text-purple-600" />}
              title="Analytics Dashboard"
              description="Visualize trends, cutoffs, and admission probabilities with interactive charts"
            />
            <FeatureCard 
              icon={<Users className="w-12 h-12 text-pink-600" />}
              title="Expert Guidance"
              description="Get personalized counseling from admission experts"
            />
            <FeatureCard 
              icon={<Shield className="w-12 h-12 text-green-600" />}
              title="100% Secure"
              description="Your data is encrypted and stored securely on Firebase"
            />
            <FeatureCard 
              icon={<Zap className="w-12 h-12 text-yellow-600" />}
              title="Real-Time Updates"
              description="Stay updated with latest cutoffs and admission notifications"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple 4-step process to find your perfect college</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard number="1" title="Sign Up" description="Create your free account in seconds" />
            <StepCard number="2" title="Enter Details" description="Provide your CET rank and preferences" />
            <StepCard number="3" title="Get Predictions" description="Receive AI-powered college recommendations" />
            <StepCard number="4" title="Build Option Form" description="Create optimized CAP option form" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Find Your Dream College?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of students who trusted CETInsights</p>
          <button onClick={() => navigate('/signup')} className="bg-white text-blue-600 px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">CETInsights</h3>
            <p className="text-gray-400">Your trusted partner for engineering college admissions</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2025 CETInsights. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}