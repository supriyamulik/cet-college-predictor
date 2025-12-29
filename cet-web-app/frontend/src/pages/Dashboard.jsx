// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth, db } from '../config/firebase';
// import { signOut } from 'firebase/auth';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import toast from 'react-hot-toast';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { 
//   Target, FileCheck, MessageSquare, Scale, BookOpen, GraduationCap,
//   ArrowRight, X, Sparkles, Shield, Users, Award, Star,
//   LogOut, User, AlertCircle, Zap
// } from 'lucide-react';

// export default function Dashboard() {
//   const [user, loading] = useAuthState(auth);
//   const [profileCreated, setProfileCreated] = useState(false);
//   const [profileCompletion, setProfileCompletion] = useState(100);
//   const [showProfileBanner, setShowProfileBanner] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const createUserProfile = async () => {
//       if (!user || profileCreated) return;

//       try {
//         const userRef = doc(db, 'users', user.uid);
//         const userSnap = await getDoc(userRef);

//         if (!userSnap.exists()) {
//           await setDoc(userRef, {
//             name: user.displayName || 'Student',
//             email: user.email,
//             phone: '',
//             createdAt: new Date().toISOString(),
//             role: 'student'
//           });
//         }
//         setProfileCreated(true);
//       } catch (error) {
//         console.error('Error creating profile:', error);
//       }
//     };

//     createUserProfile();
//   }, [user, profileCreated]);

//   useEffect(() => {
//     const profile = localStorage.getItem('userProfile');
    
//     if (!profile) {
//       setShowProfileBanner(true);
//       setProfileCompletion(0);
//       return;
//     }

//     const userData = JSON.parse(profile);
    
//     if (!userData.onboardingComplete) {
//       setShowProfileBanner(true);
      
//       const fields = [
//         userData.fullName,
//         userData.gender,
//         userData.dateOfBirth,
//         userData.phone,
//         userData.cetRank,
//         userData.cetPercentile,
//         userData.category,
//         userData.preferredCities?.length > 0,
//         userData.preferredBranches?.length > 0
//       ];
      
//       const completed = fields.filter(Boolean).length;
//       setProfileCompletion(Math.round((completed / fields.length) * 100));
//     }
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       toast.success('Logged out successfully');
//       navigate('/');
//     } catch (error) {
//       toast.error('Failed to logout');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-700 font-medium">Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Animated Background */}
//       <div className="fixed inset-0 z-0">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50" />
//         <div className="absolute inset-0 opacity-30">
//           <div className="absolute top-20 left-20 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl animate-pulse" />
//           <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl animate-pulse delay-1000" />
//           <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-300 rounded-full filter blur-3xl animate-pulse delay-500" />
//         </div>
        
//         {/* Floating Particles */}
//         <div className="absolute inset-0">
//           {[...Array(20)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute rounded-full animate-pulse"
//               style={{
//                 width: `${Math.random() * 4 + 2}px`,
//                 height: `${Math.random() * 4 + 2}px`,
//                 background: i % 3 === 0 ? '#FF9F1C' : '#8c52ff',
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 3}s`,
//                 animationDuration: `${2 + Math.random() * 3}s`,
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Header */}
//       <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-20">
//             {/* Logo */}
//             <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
//               <img 
//                 src="/logo.png" 
//                 alt="CET Insights" 
//                 className="h-20 w-auto object-contain"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = '/logo.svg';
//                 }}
//               />
//             </div>

//             {/* User Menu */}
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => navigate('/profile')}
//                 className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
//               >
//                 <User className="w-5 h-5" />
//                 <span className="hidden md:inline">Profile</span>
//               </button>
              
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
//               >
//                 <LogOut className="w-5 h-5" />
//                 <span className="hidden sm:inline">Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="relative z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Welcome Section */}
//           <div className="mb-8">
//             <div className="text-center">
//               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//                 Welcome to CETInsights !
//               </h1>
//               <p className="text-gray-600 text-lg">
//                 Access all tools for your college admission journey
//               </p>
//             </div>
//           </div>

//           {/* Profile Completion Banner */}
//           {showProfileBanner && profileCompletion < 100 && (
//             <div className="bg-gradient-to-r from-blue-600 via-[#8c52ff] to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex items-start gap-4 flex-1">
//                   <AlertCircle className="w-6 h-6 mt-1 flex-shrink-0" />
//                   <div className="flex-1">
//                     <h3 className="text-xl font-bold mb-2">
//                       Complete Your Profile
//                     </h3>
//                     <p className="text-blue-100 mb-3">
//                       Complete your profile to get personalized college recommendations.
//                     </p>
//                     <div className="w-full bg-white/30 rounded-full h-2 mb-3">
//                       <div 
//                         className="bg-white h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${profileCompletion}%` }}
//                       />
//                     </div>
//                     <button
//                       onClick={() => navigate('/onboarding')}
//                       className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center gap-2"
//                     >
//                       Complete Now
//                       <ArrowRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowProfileBanner(false)}
//                   className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Features Grid */}
//           <div className="mb-12">
//             <div className="text-center mb-10">
//               <div className="inline-flex items-center gap-2 bg-white border-2 border-blue-200 px-6 py-2 rounded-full mb-4">
//                 <Zap className="w-4 h-4 text-orange-500" />
//                 <span className="text-sm font-semibold text-gray-700">6 Core Features</span>
//               </div>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//                 Everything You Need for Admissions
//               </h2>
//               <p className="text-gray-600 max-w-2xl mx-auto">
//                 Access all tools to make informed decisions about your engineering college admissions
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {modules.map((module) => (
//                 <button
//                   key={module.id}
//                   onClick={() => navigate(module.path)}
//                   className="bg-white/90 border-2 border-gray-200 rounded-2xl p-6 text-left hover:shadow-xl hover:border-blue-300 transition-all duration-300 group hover:scale-105"
//                 >
//                   <div className={`mb-6 p-4 bg-gradient-to-br ${module.gradient} text-white rounded-2xl inline-block group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
//                     <module.icon className="w-8 h-8" />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
//                     {module.title}
//                   </h3>
//                   <p className="text-gray-600 leading-relaxed">
//                     {module.description}
//                   </p>
//                   <div className="mt-4 text-blue-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                     Access Feature
//                     <ArrowRight className="w-4 h-4" />
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Quick Stats */}
//           <div className="bg-white/90 border-2 border-gray-200 rounded-2xl p-6 mb-8">
//             <h3 className="text-xl font-bold text-gray-900 mb-6">Your Progress</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               <div className="text-center p-4 bg-blue-50 rounded-xl">
//                 <div className="text-3xl font-bold text-blue-600 mb-2">{profileCompletion}%</div>
//                 <div className="text-sm text-gray-600">Profile Complete</div>
//               </div>
//               <div className="text-center p-4 bg-indigo-50 rounded-xl">
//                 <div className="text-3xl font-bold text-indigo-600 mb-2">0</div>
//                 <div className="text-sm text-gray-600">Predictions Made</div>
//               </div>
//               <div className="text-center p-4 bg-purple-50 rounded-xl">
//                 <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
//                 <div className="text-sm text-gray-600">Forms Created</div>
//               </div>
//               <div className="text-center p-4 bg-green-50 rounded-xl">
//                 <div className="text-3xl font-bold text-green-600 mb-2">0</div>
//                 <div className="text-sm text-gray-600">Colleges Saved</div>
//               </div>
//             </div>
//           </div>

//           {/* Trust Badges */}
//           <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
//             <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
//               <Shield className="w-4 h-4 text-green-600" />
//               <span className="font-medium">100% Secure</span>
//             </div>
//             <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
//               <Users className="w-4 h-4 text-blue-600" />
//               <span className="font-medium">10,000+ Students</span>
//             </div>
//             <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
//               <Award className="w-4 h-4 text-orange-500" />
//               <span className="font-medium">95% Accuracy</span>
//             </div>
//             <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
//               <Star className="w-4 h-4 text-yellow-500" />
//               <span className="font-medium">4.8/5 Rating</span>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="relative z-10 bg-gray-900 text-white mt-16 py-8 px-4">
//         <div className="max-w-7xl mx-auto text-center">
//           <p className="text-sm text-gray-400">
//             © 2025 CETInsights. Made with ❤️ for engineering aspirants
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// const modules = [
//   {
//     id: 'predictor',
//     icon: Target,
//     title: 'SmartPredict',
//     description: 'AI-powered college predictions with 95% accuracy',
//     gradient: 'from-blue-500 to-indigo-500',
//     path: '/predictor'
//   },
//   {
//     id: 'builder',
//     icon: FileCheck,
//     title: 'Option Form Builder',
//     description: 'Intelligent option form builder with recommendations',
//     gradient: 'from-indigo-500 to-purple-500',
//     path: '/builder'
//   },
//   {
//     id: 'assistant',
//     icon: MessageSquare,
//     title: 'AdmitAssist AI',
//     description: '24/7 chatbot support for admission queries',
//     gradient: 'from-purple-500 to-pink-500',
//     path: '/assistant'
//   },
//   {
//     id: 'compare',
//     icon: Scale,
//     title: 'CollegeCompare',
//     description: 'Compare institutions side-by-side',
//     gradient: 'from-pink-500 to-rose-500',
//     path: '/compare'
//   },
//   {
//     id: 'resources',
//     icon: BookOpen,
//     title: 'ResourceVault',
//     description: 'Access study materials and guidance',
//     gradient: 'from-orange-500 to-amber-500',
//     path: '/resources'
//   },
//   {
//     id: 'college-directory',
//     icon: GraduationCap,
//     title: 'CampusFinder',
//     description: 'Complete college encyclopedia database',
//     gradient: 'from-green-500 to-emerald-500',
//     path: '/college-directory'
//   }
// ];
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  Target, FileCheck, MessageSquare, Scale, BookOpen, GraduationCap,
  ArrowRight, X, Sparkles, Shield, Users, Award, Star,
  LogOut, User, AlertCircle, Zap, Home, Settings, Bell,
  TrendingUp, Rocket, Calendar, Clock, CheckCircle,
  BarChart, Search, Filter, Download, Share2, HelpCircle,
  ChevronRight, ChevronLeft, Grid, List, RefreshCw,
  Crown, Trophy, TrendingDown, Eye, Bookmark, Heart
} from 'lucide-react';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [profileCreated, setProfileCreated] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(100);
  const [showProfileBanner, setShowProfileBanner] = useState(false);
  const [activeView, setActiveView] = useState('grid');
  const [stats, setStats] = useState({
    predictions: 0,
    forms: 0,
    saved: 0,
    accuracy: 95
  });
  const navigate = useNavigate();

  useEffect(() => {
    const createUserProfile = async () => {
      if (!user || profileCreated) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.displayName || 'Student',
            email: user.email,
            phone: '',
            createdAt: new Date().toISOString(),
            role: 'student'
          });
        }
        setProfileCreated(true);
      } catch (error) {
        console.error('Error creating profile:', error);
      }
    };

    createUserProfile();
  }, [user, profileCreated]);

  useEffect(() => {
    const profile = localStorage.getItem('userProfile');
    
    if (!profile) {
      setShowProfileBanner(true);
      setProfileCompletion(0);
      return;
    }

    const userData = JSON.parse(profile);
    
    if (!userData.onboardingComplete) {
      setShowProfileBanner(true);
      
      const fields = [
        userData.fullName,
        userData.gender,
        userData.dateOfBirth,
        userData.phone,
        userData.cetRank,
        userData.cetPercentile,
        userData.category,
        userData.preferredCities?.length > 0,
        userData.preferredBranches?.length > 0
      ];
      
      const completed = fields.filter(Boolean).length;
      setProfileCompletion(Math.round((completed / fields.length) * 100));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully', {
        icon: '👋',
        style: {
          borderRadius: '12px',
          background: '#4F46E5',
          color: '#fff',
        }
      });
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-purple-600 border-b-transparent rounded-full animate-spin animation-delay-500"></div>
          </div>
          <p className="text-gray-700 font-medium mt-6 animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-indigo-50/80" />
        
        {/* Animated Orbs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full filter blur-3xl animate-orb-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full filter blur-3xl animate-orb-float-slow animation-delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full filter blur-3xl animate-orb-float animation-delay-500"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-particle-float"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                background: i % 3 === 0 ? '#4F46E5' : i % 3 === 1 ? '#7C3AED' : '#2563EB',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px),
                             linear-gradient(to bottom, #888 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }} />
        </div>
      </div>

      {/* Enhanced Header with Glassmorphism */}
      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Enhanced Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping opacity-60"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CETInsights
                </h1>
                <p className="text-xs text-gray-600">AI-Powered College Predictions</p>
              </div>
            </div>

            {/* User Menu with Enhanced Design */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 group">
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </button>
              
              {/* Settings */}
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 group">
                <Settings className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
              </button>
              
              {/* Profile */}
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:bg-blue-50 rounded-xl group"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">Profile</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              {/* Enhanced Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-red-600 transition-all duration-300 font-medium hover:bg-red-50 rounded-xl group"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section with Enhanced Design */}
          <div className="mb-8">
            <div className="relative">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-8 shadow-lg">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100">
                        <Rocket className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                          Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.displayName || 'Student'}!</span>
                        </h1>
                        <p className="text-gray-600 text-lg">
                          Ready to make informed college decisions?
                        </p>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-4 mt-6">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Achievement Badge */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Beginner Level</p>
                        <p className="text-xs text-gray-600">Complete 5 tasks to level up</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion Banner with Enhanced Design */}
          {showProfileBanner && profileCompletion < 100 && (
            <div className="relative mb-8 group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 animate-pulse"></div>
              
              {/* Main Banner */}
              <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      <AlertCircle className="w-8 h-8 mt-1" />
                      <div className="absolute -inset-2 bg-white/20 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        Complete Your Profile
                        <span className="px-2 py-1 bg-white/20 rounded-full text-sm font-medium">
                          {profileCompletion}% Complete
                        </span>
                      </h3>
                      <p className="text-blue-100 mb-4">
                        Complete your profile to unlock personalized college recommendations and accurate predictions.
                      </p>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Profile Progress</span>
                          <span className="font-bold">{profileCompletion}%</span>
                        </div>
                        <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-white to-blue-100 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${profileCompletion}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowProfileBanner(false)}
                      className="p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
                      title="Dismiss"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate('/onboarding')}
                      className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center gap-2 group shadow-lg hover:shadow-xl"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Complete Now
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                label: 'Profile Completion', 
                value: `${profileCompletion}%`,
                icon: User,
                color: 'blue',
                trend: 'up'
              },
              { 
                label: 'Predictions Made', 
                value: stats.predictions,
                icon: Target,
                color: 'purple',
                trend: 'up'
              },
              { 
                label: 'Forms Created', 
                value: stats.forms,
                icon: FileCheck,
                color: 'green',
                trend: 'same'
              },
              { 
                label: 'Colleges Saved', 
                value: stats.saved,
                icon: Bookmark,
                color: 'orange',
                trend: 'up'
              }
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r from-${stat.color}-100 to-${stat.color}-50`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : stat.trend === 'down' ? (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  ) : null}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                <div className="mt-4 h-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-500 rounded-full transition-all duration-1000`}
                    style={{ width: stat.label === 'Profile Completion' ? `${profileCompletion}%` : '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Features Grid */}
          <div className="mb-12">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Explore Powerful Tools
                  </h2>
                </div>
                <p className="text-gray-600 max-w-2xl">
                  Access all the tools you need to navigate your college admission journey with confidence
                </p>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <button
                  onClick={() => setActiveView('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    activeView === 'grid' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveView('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    activeView === 'list' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className={`grid gap-6 ${activeView === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {modules.map((module) => (
                <div
                  key={module.id}
                  onClick={() => navigate(module.path)}
                  className={`bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer ${
                    activeView === 'grid' 
                      ? 'hover:shadow-2xl hover:scale-105 hover:border-blue-300/50' 
                      : 'hover:shadow-xl hover:border-blue-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-5">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${module.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                        <module.icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        Popular
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {module.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <button className="text-blue-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                        <span>Access Feature</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </button>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>1.2k views</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Border Effect */}
                  <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Trust & Stats Section */}
          <div className="space-y-6">
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Shield, label: '100% Secure', color: 'green' },
                { icon: Users, label: '10,000+ Students', color: 'blue' },
                { icon: Award, label: '95% Accuracy', color: 'orange' },
                { icon: Star, label: '4.8/5 Rating', color: 'yellow' },
                { icon: Crown, label: 'Premium Support', color: 'purple' },
                { icon: CheckCircle, label: 'Verified Data', color: 'emerald' }
              ].map((badge, index) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group hover:scale-105"
                >
                  <div className={`p-2 rounded-lg bg-${badge.color}-100`}>
                    <badge.icon className={`w-4 h-4 text-${badge.color}-600`} />
                  </div>
                  <span className="font-medium text-gray-700">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Need Help?</p>
                  <p className="text-sm text-gray-600">Visit our help center</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </button>
              
              <button className="flex items-center gap-3 p-4 bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 hover:border-purple-300 hover:shadow-lg transition-all duration-300 group">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100">
                  <Share2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Invite Friends</p>
                  <p className="text-sm text-gray-600">Share and earn rewards</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
              </button>
              
              <button className="flex items-center gap-3 p-4 bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 hover:border-green-300 hover:shadow-lg transition-all duration-300 group">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Download Data</p>
                  <p className="text-sm text-gray-600">Export your predictions</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">CETInsights</h3>
                    <p className="text-sm text-gray-600">Your AI College Companion</p>
                  </div>
                </div>
                <p className="text-gray-600 max-w-md">
                  Empowering students with AI-powered insights for smarter college decisions since 2023.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl font-medium hover:from-gray-100 hover:to-gray-200 transition-all duration-300 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Made with ❤️
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Give Feedback
                </button>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200/60 text-center">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} CETInsights. All rights reserved. | Made with passion for engineering aspirants
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes orb-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes orb-float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }
        
        @keyframes particle-float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
          33% { transform: translate(10px, -20px) rotate(120deg); opacity: 0.6; }
          66% { transform: translate(-10px, -10px) rotate(240deg); opacity: 0.4; }
        }
        
        .animate-orb-float {
          animation: orb-float 8s ease-in-out infinite;
        }
        
        .animate-orb-float-slow {
          animation: orb-float-slow 10s ease-in-out infinite;
        }
        
        .animate-particle-float {
          animation: particle-float 6s ease-in-out infinite;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
        }
        
        /* Custom scrollbar */
        .overflow-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .overflow-hidden::-webkit-scrollbar {
          display: none;
        }
        
        /* Glass effect */
        .backdrop-blur-xl {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
}

const modules = [
  {
    id: 'predictor',
    icon: Target,
    title: 'SmartPredict',
    description: 'AI-powered college predictions with 95% accuracy using machine learning algorithms',
    gradient: 'from-blue-500 to-indigo-500',
    path: '/predictor'
  },
  {
    id: 'builder',
    icon: FileCheck,
    title: 'Option Form Builder',
    description: 'Intelligent option form builder with personalized recommendations and rankings',
    gradient: 'from-indigo-500 to-purple-500',
    path: '/builder'
  },
  {
    id: 'assistant',
    icon: MessageSquare,
    title: 'AdmitAssist AI',
    description: '24/7 AI chatbot support for admission queries, cutoff analysis, and guidance',
    gradient: 'from-purple-500 to-pink-500',
    path: '/assistant'
  },
  {
    id: 'compare',
    icon: Scale,
    title: 'CollegeCompare',
    description: 'Compare multiple institutions side-by-side with detailed metrics and analysis',
    gradient: 'from-pink-500 to-rose-500',
    path: '/compare'
  },
  {
    id: 'resources',
    icon: BookOpen,
    title: 'ResourceVault',
    description: 'Access study materials, past papers, and expert guidance for CET preparation',
    gradient: 'from-orange-500 to-amber-500',
    path: '/resources'
  },
  {
    id: 'college-directory',
    icon: GraduationCap,
    title: 'CampusFinder',
    description: 'Complete college encyclopedia database with 500+ institutions and detailed info',
    gradient: 'from-green-500 to-emerald-500',
    path: '/college-directory'
  }
];