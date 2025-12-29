// // src/components/auth/Login.js
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   signInWithEmailAndPassword, 
//   signInWithPopup, 
//   GoogleAuthProvider 
// } from 'firebase/auth';
// import { auth, db } from '../../config/firebase';
// import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
// import toast from 'react-hot-toast';
// import { Mail, Lock, Eye, EyeOff, LogIn, Chrome } from 'lucide-react';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const checkOnboardingStatus = async (uid, userEmail, userName) => {
//     const userDocRef = doc(db, 'users', uid);
//     const docSnap = await getDoc(userDocRef);

//     if (!docSnap.exists()) {
//       await setDoc(userDocRef, {
//         fullName: userName || '',
//         email: userEmail || '',
//         phone: '',
//         branch: '',
//         year: '',
//         college: '',
//         onboardingComplete: false,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp()
//       });
//       return '/onboarding';
//     }

//     const data = docSnap.data();
//     return data.onboardingComplete ? '/dashboard' : '/onboarding';
//   };

//   const handleEmailLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await signInWithEmailAndPassword(auth, email, password);
//       toast.success('Welcome back! 🎉');

//       const destination = await checkOnboardingStatus(res.user.uid, res.user.email, res.user.displayName);
//       navigate(destination, { replace: true });

//     } catch (error) {
//       console.error(error);
//       if (error.code === 'auth/user-not-found') {
//         toast.error('No account found with this email');
//       } else if (error.code === 'auth/wrong-password') {
//         toast.error('Incorrect password');
//       } else if (error.code === 'auth/invalid-email') {
//         toast.error('Invalid email address');
//       } else {
//         toast.error('Failed to login. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     const provider = new GoogleAuthProvider();

//     try {
//       const res = await signInWithPopup(auth, provider);
//       toast.success('Welcome! 🎉');

//       const destination = await checkOnboardingStatus(res.user.uid, res.user.email, res.user.displayName);
//       navigate(destination, { replace: true });

//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to login with Google');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo at Top Center */}
//         <div className="flex justify-center mb-8">
//           <div className="cursor-pointer" onClick={() => navigate('/')}>
//             <img 
//               src="/logo.png" 
//               alt="CET Insights" 
//               className="h-20 w-auto object-contain"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = '/logo.svg';
//               }}
//             />
//           </div>
//         </div>

//         {/* Main Login Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
//             <p className="text-gray-600 mt-2">Sign in to your account</p>
//           </div>

//           {/* Google Login Button */}
//           <button
//             onClick={handleGoogleLogin}
//             disabled={loading}
//             className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-3 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Chrome className="w-5 h-5" />
//             Continue with Google
//           </button>

//           {/* Divider */}
//           <div className="relative flex items-center justify-center mb-6">
//             <div className="border-t border-gray-300 w-full"></div>
//             <span className="bg-white px-4 text-gray-500 text-sm absolute">or</span>
//           </div>

//           {/* Email Login Form */}
//           <form onSubmit={handleEmailLogin} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//               <div className="relative">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="your.email@example.com"
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password"
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition pr-12"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             <div className="text-right">
//               <button type="button" className="text-sm text-blue-600 hover:text-blue-700">
//                 Forgot Password?
//               </button>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Signing in...
//                 </>
//               ) : (
//                 <>
//                   <LogIn className="w-5 h-5" />
//                   Sign In
//                 </>
//               )}
//             </button>
//           </form>

//           <p className="text-center text-gray-600 mt-6">
//             Don't have an account?{' '}
//             <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
//               Sign Up
//             </Link>
//           </p>
//         </div>

//         <div className="text-center mt-6 text-sm text-gray-500">
//           Secured by Firebase Authentication
//         </div>
//       </div>
//     </div>
//   );
// src/components/auth/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { 
  Mail, Lock, Eye, EyeOff, LogIn, Chrome, 
  Shield, Key, UserCheck, Sparkles, Zap, 
  ArrowRight, GraduationCap, Brain, Rocket 
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const navigate = useNavigate();

  const checkOnboardingStatus = async (uid, userEmail, userName) => {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        fullName: userName || '',
        email: userEmail || '',
        phone: '',
        branch: '',
        year: '',
        college: '',
        onboardingComplete: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return '/onboarding';
    }

    const data = docSnap.data();
    return data.onboardingComplete ? '/dashboard' : '/onboarding';
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back! 🎉', {
        icon: '👋',
        style: {
          borderRadius: '12px',
          background: '#4F46E5',
          color: '#fff',
        }
      });

      const destination = await checkOnboardingStatus(res.user.uid, res.user.email, res.user.displayName);
      navigate(destination, { replace: true });

    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else {
        toast.error('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const res = await signInWithPopup(auth, provider);
      toast.success('Welcome! 🎉', {
        icon: '🚀',
        style: {
          borderRadius: '12px',
          background: '#4F46E5',
          color: '#fff',
        }
      });

      const destination = await checkOnboardingStatus(res.user.uid, res.user.email, res.user.displayName);
      navigate(destination, { replace: true });

    } catch (error) {
      console.error(error);
      toast.error('Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden relative">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Main Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-indigo-50/80 to-purple-50/90" />
        
        {/* Animated Orbs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full filter blur-3xl animate-orb-float"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full filter blur-3xl animate-orb-float-slow animation-delay-1000"></div>
          <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full filter blur-3xl animate-orb-float animation-delay-500"></div>
        </div>
        
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25px 25px, rgba(120, 119, 198, 0.3) 2px, transparent 2px),
              radial-gradient(circle at 75px 75px, rgba(120, 119, 198, 0.3) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px',
          }} />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
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
                animationDuration: `${4 + Math.random() * 3}s`,
                opacity: 0.4,
              }}
            />
          ))}
        </div>
        
        {/* Connection Lines */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="50%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            <path
              d="M0,100 Q200,50 400,150 T800,50"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-dash"
            />
            <path
              d="M100,0 Q300,100 500,50 T900,100"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-dash animation-delay-1000"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left Side - Welcome & Features */}
          <div className="lg:w-1/2 max-w-lg">
            {/* Logo */}
            <div className="mb-8">
              <div 
                className="flex items-center gap-3 cursor-pointer group" 
                onClick={() => navigate('/')}
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-text">
                    CETInsights
                  </h1>
                  <p className="text-gray-600 font-medium">Your Smart College Companion</p>
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-10">
              <h2 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Welcome Back to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Success</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Access your personalized dashboard, college predictions, and exclusive insights to make informed decisions about your engineering future.
              </p>
              
              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { icon: GraduationCap, label: 'College Predictions', color: 'blue' },
                  { icon: Sparkles, label: 'AI Insights', color: 'purple' },
                  { icon: Zap, label: 'Fast Analysis', color: 'yellow' },
                  { icon: Shield, label: 'Secure Data', color: 'green' }
                ].map((feature, index) => (
                  <div 
                    key={feature.label} 
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-blue-200 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className={`inline-flex p-2 rounded-lg bg-${feature.color}-100 mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-5 h-5 text-${feature.color}-600`} />
                    </div>
                    <p className="font-medium text-gray-800">{feature.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats & Trust Indicators */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-gray-700">Trusted Platform</span>
                </div>
                <span className="text-xs font-medium px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full">
                  100% Secure
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Join thousands of students who have successfully navigated their college admissions journey with CETInsights.
              </p>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="lg:w-1/2 max-w-md">
            {/* Enhanced Login Card */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 animate-pulse"></div>
              
              {/* Main Card */}
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-2xl p-8">
                {/* Card Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-4">
                    <UserCheck className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                  <p className="text-gray-600 mt-2">Sign in to continue your journey</p>
                </div>

                {/* Google Login Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="group relative w-full bg-white border-2 border-gray-300 text-gray-800 py-3.5 px-4 rounded-xl font-medium hover:border-blue-400 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 mb-6 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <div className="absolute left-4">
                    <Chrome className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">Continue with Google</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                {/* Enhanced Divider */}
                <div className="relative flex items-center justify-center my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
                  </div>
                </div>

                {/* Enhanced Email Login Form */}
                <form onSubmit={handleEmailLogin} className="space-y-6">
                  {/* Email Input */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className={`h-5 w-5 transition-colors duration-300 ${activeInput === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setActiveInput('email')}
                        onBlur={() => setActiveInput(null)}
                        placeholder="your.email@example.com"
                        required
                        className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-gray-50/50 ${
                          activeInput === 'email' 
                            ? 'border-blue-500 ring-2 ring-blue-500/20' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                      {email && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-500" />
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className={`h-5 w-5 transition-colors duration-300 ${activeInput === 'password' ? 'text-purple-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setActiveInput('password')}
                        onBlur={() => setActiveInput(null)}
                        placeholder="Enter your password"
                        required
                        className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-gray-50/50 ${
                          activeInput === 'password' 
                            ? 'border-purple-500 ring-2 ring-purple-500/20' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      {password && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Key className="w-5 h-5 text-blue-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                        Remember me
                      </label>
                    </div>
                    <button 
                      type="button" 
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                    >
                      Forgot Password?
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="group relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Button Content */}
                    <div className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                          <span>Sign In to Dashboard</span>
                          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2" />
                        </>
                      )}
                    </div>
                    
                    {/* Loading Indicator */}
                    {loading && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 animate-progress"></div>
                    )}
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-8 pt-6 border-t border-gray-200/60">
                  <p className="text-center text-gray-600">
                    New to CETInsights?{' '}
                    <Link 
                      to="/signup" 
                      className="font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1 group"
                    >
                      Create an account
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure SSL Connection</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial/Quote Section */}
      <div className="relative z-10 mt-8 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 inline-block">
            <p className="text-gray-700 italic">
              "CETInsights helped me secure admission in my dream college with accurate predictions!"
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Rahul Sharma</p>
                <p className="text-xs text-gray-600">Computer Engineering, COEP</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes orb-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        
        @keyframes orb-float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-40px) scale(1.1); }
        }
        
        @keyframes particle-float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
          33% { transform: translate(15px, -25px) rotate(120deg); opacity: 0.6; }
          66% { transform: translate(-15px, -15px) rotate(240deg); opacity: 0.4; }
        }
        
        @keyframes dash {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradient-text 3s ease infinite;
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
        
        .animate-dash {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 20s linear infinite;
        }
        
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
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
        
        /* Improved focus styles */
        input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a5b4fc;
        }
      `}</style>
    </div>
  );
}// }