
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Chrome, Phone } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailSignup = async (e) => {
  e.preventDefault();
  
  // Validation
  if (formData.password !== formData.confirmPassword) {
    toast.error('Passwords do not match!');
    return;
  }

  if (formData.password.length < 6) {
    toast.error('Password must be at least 6 characters');
    return;
  }

  setLoading(true);

  try {
    // Create user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    // Update profile (keep this - it's fast)
    await updateProfile(userCredential.user, {
      displayName: formData.name
    });

    // ✅ REMOVED FIRESTORE WRITE - We'll do it on Dashboard first visit
    
    toast.success('Account created successfully! 🎉');
    navigate('/dashboard');
  } catch (error) {
    console.error(error);
    if (error.code === 'auth/email-already-in-use') {
      toast.error('This email is already registered');
    } else if (error.code === 'auth/invalid-email') {
      toast.error('Invalid email address');
    } else if (error.code === 'auth/weak-password') {
      toast.error('Password is too weak');
    } else {
      toast.error('Failed to create account. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  const handleGoogleSignup = async () => {
  setLoading(true);
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
    
    // ✅ REMOVED FIRESTORE WRITE
    
    toast.success('Welcome to CETInsights! 🎉');
    navigate('/dashboard');
  } catch (error) {
    console.error(error);
    toast.error('Failed to sign up with Google');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2 transition"
        >
          ← Back to Home
        </button>

        {/* Signup Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-95">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-3 hover:rotate-3 transition-transform">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600 mt-2">Join thousands of students</p>
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-3 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome className="w-5 h-5 text-red-500" />
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="bg-white px-4 text-gray-500 text-sm absolute">or</span>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 1234567890"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1" />
              <p className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-purple-600 hover:underline">Terms & Conditions</a>
                {' '}and{' '}
                <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
              </p>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>

        {/* Security Badge */}
        <div className="text-center mt-6 text-sm text-gray-600">
          🔒 Your data is encrypted and secure
        </div>
      </div>
    </div>
  );
}