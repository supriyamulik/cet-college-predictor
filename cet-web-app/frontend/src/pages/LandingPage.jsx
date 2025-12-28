import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Target, FileCheck, MessageSquare, Scale, BookOpen, GraduationCap, Sparkles, TrendingUp, Award, Shield, Zap, Users, Star, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const observerRef = useRef(null);

  const handleNavigation = (path) => {
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
      {/* Navbar with Enhanced Logo */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Only */}
            <div className="flex items-center cursor-pointer group" onClick={() => handleNavigation('/')}>
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="CET Insights" 
                  className="h-20 w-auto object-contain drop-shadow-lg transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-[#8c52ff]/10 blur-xl transition-all duration-300" />
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-300 font-medium relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-[#8c52ff] group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-300 font-medium relative group">
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-[#8c52ff] group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-300 font-medium relative group">
                Testimonials
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-[#8c52ff] group-hover:w-full transition-all duration-300"></span>
              </a>
              <button onClick={() => handleNavigation('/login')} className="text-gray-700 hover:text-[#8c52ff] transition-colors duration-300 font-medium relative group">
                Login
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-[#8c52ff] group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => handleNavigation('/signup')} className="relative bg-gradient-to-r from-blue-600 via-[#8c52ff] to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:shadow-[#8c52ff]/50 transition-all duration-300 hover:scale-105 overflow-hidden group">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#8c52ff] to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-900 hover:text-[#8c52ff] transition-colors">
              {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl animate-slideDown">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <div className="flex items-center justify-center px-4 py-3 mb-2">
                <img 
                  src="/logo.png" 
                  alt="CET Insights" 
                  className="h-24 w-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo.svg';
                  }}
                />
              </div>
              <a href="#features" className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg transition font-medium flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                Features
              </a>
              <a href="#how-it-works" className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg transition font-medium flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                How It Works
              </a>
              <a href="#testimonials" className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg transition font-medium flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                Testimonials
              </a>
              <button onClick={() => handleNavigation('/login')} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg transition font-medium flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                Login
              </button>
              <button onClick={() => handleNavigation('/signup')} className="w-full bg-gradient-to-r from-blue-600 via-[#8c52ff] to-purple-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold mt-4 flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(26, 86, 219, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(140, 82, 255, 0.15) 0%, transparent 50%)',
            }}
          />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
              backgroundImage: 'radial-gradient(circle at 60% 30%, rgba(140, 82, 255, 0.1) 0%, transparent 50%)',
            }}
          />
          {/* Purple Particles */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  background: i % 3 === 0 ? '#FF9F1C' : '#8c52ff',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <div className="backdrop-blur-2xl bg-white/90 border-2 border-purple-100 rounded-3xl py-16 px-8 md:py-20 md:px-20 shadow-2xl w-full">
              <div className="text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 border-2 border-purple-200 px-6 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-[#8c52ff]" />
                  <span className="text-sm font-semibold text-[#8c52ff]">AI-Powered College Predictions</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                  Your Gateway to <br />
                  <span className="bg-gradient-to-r from-blue-600 via-[#8c52ff] to-purple-700 bg-clip-text text-transparent animate-gradient">
                    Top Engineering Colleges
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Smart college predictions for <span className="font-bold text-[#8c52ff]">MHT-CET 2025</span>. Get personalized recommendations, build your option form, and secure your dream college with confidence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                  <button 
                    onClick={() => handleNavigation('/signup')} 
                    className="group relative bg-gradient-to-r from-blue-600 via-[#8c52ff] to-purple-600 text-white px-12 py-5 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-[#8c52ff]/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
                  >
                    <span className="relative z-10">Start Free Trial</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8c52ff] to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  <button className="group border-2 border-[#8c52ff] text-[#8c52ff] px-12 py-5 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all duration-300 backdrop-blur-sm flex items-center gap-2">
                    <Award className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    View Demo
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="font-medium">100% Secure</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                    <Users className="w-4 h-4 text-[#8c52ff]" />
                    <span className="font-medium">10,000+ Students</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                    <Award className="w-4 h-4 text-[#8c52ff]" />
                    <span className="font-medium">95% Accuracy</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">4.8/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="mt-20 relative w-full max-w-5xl">
              <div className="relative h-48">
                <StatBubble number="10,000+" label="Students Helped" delay="0s" position="left-[5%] top-0" color="purple" />
                <StatBubble number="500+" label="Colleges Covered" delay="0.2s" position="left-[30%] top-8" color="purple" />
                <StatBubble number="95%" label="Accuracy Rate" delay="0.4s" position="right-[30%] top-4" color="purple" />
                <StatBubble number="4.8/5" label="User Rating" delay="0.6s" position="right-[5%] top-12" color="purple" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#8c52ff]/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-blue-600 to-[#8c52ff] rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-32 px-4 bg-gradient-to-b from-white via-blue-50 to-purple-50 relative overflow-hidden" data-animate>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8c52ff] rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-purple-200 px-6 py-2 rounded-full mb-6 shadow-lg">
              <Zap className="w-4 h-4 text-[#8c52ff]" />
              <span className="text-sm font-semibold text-gray-700">6 Core Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Powerful Tools at Your Fingertips</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to make informed decisions about your engineering college admissions</p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Target className="w-12 h-12" />}
              title="SmartPredict"
              subtitle="AI-Powered College Predictions"
              description="Advanced machine learning algorithms analyze historical data to predict your admission chances with 95% accuracy"
              delay="0s"
              gradient="from-blue-500 via-[#8c52ff] to-purple-500"
            />
            <FeatureCard 
              icon={<FileCheck className="w-12 h-12" />}
              title="Option Form Builder"
              subtitle="Intelligent Option Form Builder"
              description="Build and optimize your CAP option form with smart recommendations based on your preferences and rank"
              delay="0.1s"
              gradient="from-blue-500 via-[#8c52ff] to-purple-500"
            />
            <FeatureCard 
              icon={<MessageSquare className="w-12 h-12" />}
              title="AdmitAssist AI"
              subtitle="24/7 Chatbot Support"
              description="Get instant answers to your admission queries from our intelligent AI assistant trained on CET data"
              delay="0.2s"
              gradient="from-blue-500 via-[#8c52ff] to-purple-500"
            />
            <FeatureCard 
              icon={<Scale className="w-12 h-12" />}
              title="CollegeCompare"
              subtitle="Compare Institutions"
              description="Side-by-side comparison of colleges including placements, infrastructure, cutoffs, and student reviews"
              delay="0.3s"
              gradient="from-blue-500 via-[#8c52ff] to-purple-500"
            />
            <FeatureCard 
              icon={<BookOpen className="w-12 h-12" />}
              title="CampusFinder"
              subtitle="Complete College Encyclopedia"
              description="Comprehensive database with detailed profiles of 500+ engineering colleges across Maharashtra"
              delay="0.4s"
              gradient="from-blue-500 via-[#8c52ff] to-purple-500"
            />
            <FeatureCard 
              icon={<GraduationCap className="w-12 h-12" />}
              title="ResourceVault"
              subtitle="Important Resources"
              description="Access premium study materials, preparation tips, and expert counseling for your admission journey"
              delay="0.5s"
              gradient="from-blue-500 via-[#8c52ff] to-purple-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-4 bg-gradient-to-b from-purple-50 to-white relative" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-purple-200 px-6 py-2 rounded-full mb-6 shadow-lg">
              <TrendingUp className="w-4 h-4 text-[#8c52ff]" />
              <span className="text-sm font-semibold text-gray-700">Simple Process</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get started in just 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-[#8c52ff] to-purple-600 opacity-20" style={{ top: '80px' }} />
            
            <StepCard number="1" title="Sign Up Free" description="Create your account in under 30 seconds with zero cost" delay="0s" icon={<Users className="w-6 h-6" />} />
            <StepCard number="2" title="Enter Details" description="Provide your CET rank, category, and college preferences" delay="0.15s" icon={<FileCheck className="w-6 h-6" />} />
            <StepCard number="3" title="Get Predictions" description="Receive AI-powered college recommendations instantly" delay="0.3s" icon={<Target className="w-6 h-6" />} />
            <StepCard number="4" title="Secure Admission" description="Build optimized option form and track application status" delay="0.45s" icon={<Award className="w-6 h-6" />} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-4 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-purple-200 px-6 py-2 rounded-full mb-6 shadow-lg">
              <Award className="w-4 h-4 text-[#8c52ff]" />
              <span className="text-sm font-semibold text-gray-700">Student Success Stories</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Trusted by Thousands</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">See what our students have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="CETInsights helped me get into my dream college! The predictions were spot-on."
              name="Rahul Sharma"
              college="COEP Pune"
              delay="0s"
              rating={5}
            />
            <TestimonialCard 
              quote="The option form builder saved me hours of work. Highly recommend!"
              name="Priya Desai"
              college="VJTI Mumbai"
              delay="0.2s"
              rating={5}
            />
            <TestimonialCard 
              quote="Best decision I made during my admission process. Worth every minute!"
              name="Arjun Patil"
              college="PICT Pune"
              delay="0.4s"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-r from-blue-600 via-[#8c52ff] to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Sparkles className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Ready to Find Your Dream College?</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">Join 10,000+ students who trusted CETInsights for their admission journey</p>
          <button 
            onClick={() => handleNavigation('/signup')} 
            className="bg-white text-[#8c52ff] px-14 py-6 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-[#8c52ff]/30 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
          >
            Get Started Free
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-blue-100 mt-6">No credit card required • Free forever</p>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 border-t-4 border-[#8c52ff]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Logo Only in Footer */}
            <div>
              <div className="mb-6">
                <img 
                  src="/logo.png" 
                  alt="CET Insights" 
                  className="h-28 w-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo.svg';
                  }}
                />
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Your trusted partner for engineering college admissions in Maharashtra. Empowering students with AI-powered predictions.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.8/5 Rating</span>
                </div>
                <div className="h-4 w-px bg-gray-700"></div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4 text-[#8c52ff]" />
                  <span>10K+ Students</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-gray-200 text-lg flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-[#8c52ff]" />
                Product
              </h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-[#8c52ff] transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#8c52ff] rounded-full opacity-0 group-hover:opacity-100"></div>
                  Features
                </a></li>
                <li><a href="#" className="hover:text-[#8c52ff] transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#8c52ff] rounded-full opacity-0 group-hover:opacity-100"></div>
                  Pricing
                </a></li>
                <li><a href="#" className="hover:text-[#8c52ff] transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#8c52ff] rounded-full opacity-0 group-hover:opacity-100"></div>
                  FAQ
                </a></li>
                <li><a href="#" className="hover:text-[#8c52ff] transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#8c52ff] rounded-full opacity-0 group-hover:opacity-100"></div>
                  Updates
                </a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-gray-200 text-lg flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-[#8c52ff]" />
                Company
              </h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-[#8c52ff] transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#8c52ff] rounded-full opacity-0 group-hover:opacity-100"></div>
                  About Us
                </a></li>
                <li><a href="#" className="hover:text-[#8c52ff] transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#8c52ff] rounded-full opacity-0 group-hover:opacity-100"></div>
                  Blog
                </a></li>
                <li><a href="#" className="hover:text-[#8c52ff] transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#8c52ff] rounded-full opacity-0 group-hover:opacity-100"></div>
                  Contact
                </a></li>
                <li><a href="#" className="hover:text-[#8c52ff] transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#8c52ff] rounded-full opacity-0 group-hover:opacity-100"></div>
                  Careers
                </a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-gray-200 text-lg flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-[#8c52ff]" />
                Legal
              </h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-[#8c52ff] transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#8c52ff] rounded-full opacity-0 group-hover:opacity-100"></div>
                  Privacy Policy
                </a></li>
                <li><a href="#" className="hover:text-[#8c52ff] transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#8c52ff] rounded-full opacity-0 group-hover:opacity-100"></div>
                  Terms of Service
                </a></li>
                <li><a href="#" className="hover:text-[#8c52ff] transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-[#8c52ff] rounded-full opacity-0 group-hover:opacity-100"></div>
                  Cookie Policy
                </a></li>
              </ul>
            </div>
          </div>

          {/* Simplified Developed By Section */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="text-center">
              <h4 className="text-gray-300 font-medium mb-6">Developed By</h4>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-[#8c52ff] rounded-full flex items-center justify-center text-white font-bold">
                    SM
                  </div>
                  <div>
                    <div className="text-gray-200 font-medium">Supriya Mulik</div>
                    <div className="text-sm text-gray-400">VIT Pune</div>
                  </div>
                </div>
                
                <div className="hidden md:block w-px h-10 bg-gray-700"></div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#8c52ff] to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    PP
                  </div>
                  <div>
                    <div className="text-gray-200 font-medium">Prithviraj Patil</div>
                    <div className="text-sm text-gray-400">VIT Pune</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                Vishwakarma Institute of Technology, Pune • 2025
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400 border-t border-gray-800 pt-8">
            <p className="text-sm">
              © 2025 CETInsights. All rights reserved. 
              <span className="mx-2">•</span>
              Made with <span className="text-red-500 animate-pulse">❤️</span> for engineering aspirants
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

function StatBubble({ number, label, delay, position, color }) {
  const colorClasses = {
    blue: 'border-blue-300 bg-blue-50/80',
    indigo: 'border-indigo-300 bg-indigo-50/80',
    orange: 'border-orange-300 bg-orange-50/80',
    purple: 'border-purple-300 bg-purple-50/80'
  };

  const textColors = {
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    orange: 'text-orange-600',
    purple: 'text-[#8c52ff]'
  };

  return (
    <div 
      className={`absolute ${position}`}
      style={{
        animation: `floatIn 0.8s ease-out ${delay} forwards`,
      }}
    >
      <div className={`backdrop-blur-xl ${colorClasses[color]} border-2 rounded-2xl px-8 py-5 shadow-2xl hover:scale-110 transition-transform duration-300`}>
        <div className={`text-3xl md:text-4xl font-bold ${textColors[color]} mb-1`}>{number}</div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, subtitle, description, delay, gradient }) {
  return (
    <div 
      className="group p-8 backdrop-blur-xl bg-white/90 border-2 border-gray-200 rounded-3xl hover:bg-white hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden"
      style={{
        animation: `floatIn 0.8s ease-out ${delay} forwards`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-all duration-500`} />
      <div className="relative z-10">
        <div className={`mb-6 p-4 bg-gradient-to-br ${gradient} text-white rounded-2xl inline-block group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#8c52ff] transition-colors">{title}</h3>
        <p className="text-sm font-semibold text-gray-500 mb-3">{subtitle}</p>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
    </div>
  );
}

function StepCard({ number, title, description, delay, icon }) {
  return (
    <div 
      className="text-center group relative"
      style={{
        animation: `floatIn 0.8s ease-out ${delay} forwards`,
      }}
    >
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-[#8c52ff] to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-2xl shadow-[#8c52ff]/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10">
          {number}
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-[#8c52ff] to-purple-400 opacity-0 group-hover:opacity-30 blur-2xl transition-opacity scale-150" />
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#8c52ff] to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed px-4">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, name, college, delay, rating }) {
  return (
    <div 
      className="bg-white border-2 border-purple-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
      style={{
        animation: `floatIn 0.8s ease-out ${delay} forwards`,
      }}
    >
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-current text-yellow-500" />
        ))}
      </div>
      <div className="text-[#8c52ff] text-5xl mb-4">"</div>
      <p className="text-gray-700 mb-6 leading-relaxed italic">{quote}</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-[#8c52ff] to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{college}</p>
        </div>
      </div>
    </div>
  );
}