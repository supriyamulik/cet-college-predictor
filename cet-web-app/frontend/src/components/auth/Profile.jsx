// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft, Save, Edit, Mail, Phone, Calendar, Award,
//   Check, X, User, Shield, LogOut
// } from 'lucide-react';
// import { auth, db } from '../../config/firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import toast from 'react-hot-toast';
// import { doc, getDoc, setDoc } from 'firebase/firestore';

// const BRANCHES = [
//   'Computer Engineering', 'Information Technology', 'Electronics and Telecommunication',
//   'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
//   'Artificial Intelligence and Data Science', 'Computer Science and Engineering (Data Science)',
//   'Electronics and Computer Engineering', 'Instrumentation Engineering',
//   'Chemical Engineering', 'Production Engineering', 'Automobile Engineering', 'Textile Engineering'
// ];

// const CITIES = [
//   'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Amravati', 'Kolhapur', 'Solapur',
//   'Ahmednagar', 'Akola', 'Latur', 'Dhule', 'Jalgaon', 'Chandrapur', 'Parbhani', 'Nanded',
//   'Satara', 'Ratnagiri', 'Sangli', 'Thane'
// ];

// const CATEGORIES = ['OPEN', 'OBC', 'SC', 'ST', 'EWS'];

// export default function Profile() {
//   const [user, loading] = useAuthState(auth);
//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);
//   const [activeTab, setActiveTab] = useState('personal');
//   const [isSaving, setIsSaving] = useState(false);
//   const [loadingProfile, setLoadingProfile] = useState(true);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     gender: 'Male',
//     dateOfBirth: '',
//     cetRank: '',
//     cetPercentile: '',
//     category: 'OPEN',
//     preferredCities: [],
//     preferredBranches: []
//   });

//   /* ✅ LOAD PROFILE DATA FROM FIRESTORE */
//   useEffect(() => {
//     if (!user) return;

//     const loadProfile = async () => {
//       try {
//         const docRef = doc(db, 'users', user.uid);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setFormData({
//             fullName: data.fullName || '',
//             email: data.email || user.email || '',
//             phone: data.phone || '',
//             gender: data.gender || 'Male',
//             dateOfBirth: data.dateOfBirth || '',
//             cetRank: data.cetRank || '',
//             cetPercentile: data.cetPercentile || '',
//             category: data.category || 'OPEN',
//             preferredCities: data.preferredCities || [],
//             preferredBranches: data.preferredBranches || []
//           });
//         } else {
//           setFormData(prev => ({
//             ...prev,
//             email: user.email || ''
//           }));
//         }
//       } catch (err) {
//         console.error('Error loading profile:', err);
//         toast.error('Failed to load profile');
//       } finally {
//         setLoadingProfile(false);
//       }
//     };

//     loadProfile();
//   }, [user]);

//   const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
//   const toggleArrayField = (field, value) =>
//     setFormData(prev => ({
//       ...prev,
//       [field]: prev[field]?.includes(value)
//         ? prev[field].filter(v => v !== value)
//         : [...(prev[field] || []), value]
//     }));

//   /* ✅ SAVE PROFILE TO FIRESTORE */
//   const handleSave = async () => {
//     if (!user) return;
    
//     // Validation
//     if (!formData.fullName) {
//       toast.error('Please enter your full name');
//       return;
//     }
    
//     setIsSaving(true);
//     try {
//       const docRef = doc(db, 'users', user.uid);
//       await setDoc(docRef, { ...formData, lastUpdated: new Date().toISOString() }, { merge: true });
//       toast.success('Profile updated successfully!');
//       setIsEditing(false);
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to save profile');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   if (loading || loadingProfile) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Animated Celebration Background */}
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

//             {/* Navigation */}
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => navigate('/dashboard')}
//                 className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//                 Back to Dashboard
//               </button>
              
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
//               >
//                 <LogOut className="w-5 h-5" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="relative z-10">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Profile Header */}
//           <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 p-6 mb-8 shadow-lg">
//             <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
//               <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-4xl text-white">
//                 {user?.photoURL ? (
//                   <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
//                 ) : (
//                   '👤'
//                 )}
//               </div>
              
//               <div className="flex-1">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div>
//                     <h1 className="text-2xl font-bold text-gray-900 mb-1">{formData.fullName || 'Your Name'}</h1>
//                     <p className="text-gray-600 mb-4">{formData.email}</p>
//                     <div className="flex flex-wrap gap-3">
//                       {formData.cetRank && (
//                         <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
//                           Rank: {formData.cetRank}
//                         </span>
//                       )}
//                       {formData.cetPercentile && (
//                         <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm">
//                           Percentile: {formData.cetPercentile}%
//                         </span>
//                       )}
//                       {formData.category && (
//                         <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">
//                           {formData.category}
//                         </span>
//                       )}
//                     </div>
//                   </div>
                  
//                   <button
//                     onClick={() => setIsEditing(!isEditing)}
//                     className={`px-6 py-3 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2 ${
//                       isEditing 
//                         ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
//                         : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
//                     }`}
//                   >
//                     {isEditing ? <X size={18} /> : <Edit size={18} />}
//                     {isEditing ? 'Cancel' : 'Edit Profile'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Tabs Content */}
//           <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
//             {/* Tabs */}
//             <div className="border-b border-gray-200">
//               <div className="flex">
//                 {[
//                   { id: 'personal', label: 'Personal Info', icon: User },
//                   { id: 'academic', label: 'Academic', icon: Award },
//                   { id: 'preferences', label: 'Preferences', icon: Shield }
//                 ].map(tab => (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`flex-1 px-6 py-4 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
//                       activeTab === tab.id
//                         ? 'text-blue-600 border-b-2 border-blue-600'
//                         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                     }`}
//                   >
//                     <tab.icon size={18} />
//                     {tab.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Tab Content */}
//             <div className="p-6 md:p-8">
//               {/* Personal Info */}
//               {activeTab === 'personal' && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//                       <input
//                         type="text"
//                         value={formData.fullName}
//                         onChange={e => handleChange('fullName', e.target.value)}
//                         disabled={!isEditing}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
//                         placeholder="Enter your full name"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                       <input
//                         type="email"
//                         value={formData.email}
//                         onChange={e => handleChange('email', e.target.value)}
//                         disabled={!isEditing}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
//                         placeholder="your.email@example.com"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//                       <input
//                         type="tel"
//                         value={formData.phone}
//                         onChange={e => handleChange('phone', e.target.value)}
//                         disabled={!isEditing}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
//                         placeholder="+91 1234567890"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
//                       <input
//                         type="date"
//                         value={formData.dateOfBirth}
//                         onChange={e => handleChange('dateOfBirth', e.target.value)}
//                         disabled={!isEditing}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
//                       />
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
//                       <div className="flex gap-2">
//                         {['Male', 'Female', 'Other'].map(g => (
//                           <button
//                             key={g}
//                             onClick={() => isEditing && handleChange('gender', g)}
//                             disabled={!isEditing}
//                             className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
//                               formData.gender === g
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
//                           >
//                             {g}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Academic */}
//               {activeTab === 'academic' && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold text-gray-900">Academic Details</h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">CET Rank</label>
//                       <input
//                         type="number"
//                         value={formData.cetRank}
//                         onChange={e => handleChange('cetRank', e.target.value)}
//                         disabled={!isEditing}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
//                         placeholder="Enter your CET rank"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">CET Percentile</label>
//                       <input
//                         type="number"
//                         value={formData.cetPercentile}
//                         onChange={e => handleChange('cetPercentile', e.target.value)}
//                         disabled={!isEditing}
//                         step="0.01"
//                         max="100"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
//                         placeholder="Enter percentile (e.g., 98.5)"
//                       />
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                       <div className="flex flex-wrap gap-2">
//                         {CATEGORIES.map(cat => (
//                           <button
//                             key={cat}
//                             onClick={() => isEditing && handleChange('category', cat)}
//                             disabled={!isEditing}
//                             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                               formData.category === cat
//                                 ? 'bg-green-600 text-white'
//                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
//                           >
//                             {cat}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Preferences */}
//               {activeTab === 'preferences' && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-semibold text-gray-900">College Preferences</h3>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Preferred Cities ({formData.preferredCities?.length || 0} selected)
//                     </label>
//                     <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
//                       <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                         {CITIES.map(city => (
//                           <button
//                             key={city}
//                             onClick={() => isEditing && toggleArrayField('preferredCities', city)}
//                             disabled={!isEditing}
//                             className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                               formData.preferredCities?.includes(city)
//                                 ? 'bg-purple-600 text-white'
//                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                             } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
//                           >
//                             {formData.preferredCities?.includes(city) && <Check size={14} className="inline mr-1" />}
//                             {city}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Preferred Branches ({formData.preferredBranches?.length || 0} selected)
//                     </label>
//                     <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
//                       {BRANCHES.map(branch => (
//                         <button
//                           key={branch}
//                           onClick={() => isEditing && toggleArrayField('preferredBranches', branch)}
//                           disabled={!isEditing}
//                           className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-colors ${
//                             formData.preferredBranches?.includes(branch)
//                               ? 'bg-blue-600 text-white'
//                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                           } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
//                         >
//                           {formData.preferredBranches?.includes(branch) && <Check size={16} className="inline mr-2" />}
//                           {branch}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Save Button */}
//           {isEditing && (
//             <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
//               <div className="flex flex-col sm:flex-row gap-3 justify-end">
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   disabled={isSaving}
//                   className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   disabled={isSaving}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                 >
//                   {isSaving ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save size={16} />
//                       Save Changes
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Footer */}
//       {/* <footer className="relative z-10 bg-gray-900 text-white mt-16 py-8 px-4">
//         <div className="max-w-7xl mx-auto text-center">
//         </div>
//       </footer> */}

//       <style>{`
//         .animate-gradient {
//           background-size: 200% 200%;
//           animation: gradient 3s ease infinite;
//         }

//         @keyframes gradient {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//       `}</style>
//     </div>
//   );
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Edit, Mail, Phone, Calendar, Award,
  Check, X, User, Shield, LogOut, ChevronRight, Star,
  Upload, Bell, Settings, GraduationCap, MapPin
} from 'lucide-react';
import { auth, db } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const BRANCHES = [
  'Computer Engineering', 'Information Technology', 'Electronics and Telecommunication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Artificial Intelligence and Data Science', 'Computer Science and Engineering (Data Science)',
  'Electronics and Computer Engineering', 'Instrumentation Engineering',
  'Chemical Engineering', 'Production Engineering', 'Automobile Engineering', 'Textile Engineering'
];

const CITIES = [
  'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Amravati', 'Kolhapur', 'Solapur',
  'Ahmednagar', 'Akola', 'Latur', 'Dhule', 'Jalgaon', 'Chandrapur', 'Parbhani', 'Nanded',
  'Satara', 'Ratnagiri', 'Sangli', 'Thane'
];

const CATEGORIES = ['OPEN', 'OBC', 'SC', 'ST', 'EWS'];

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    cetRank: '',
    cetPercentile: '',
    category: 'OPEN',
    preferredCities: [],
    preferredBranches: []
  });

  /* ✅ Calculate Profile Completion */
  useEffect(() => {
    let filled = 0;
    const requiredFields = ['fullName', 'email', 'phone', 'cetRank', 'cetPercentile'];
    requiredFields.forEach(field => {
      if (formData[field] && formData[field].toString().trim()) filled++;
    });
    setProfileCompletion(Math.round((filled / requiredFields.length) * 100));
  }, [formData]);

  /* ✅ LOAD PROFILE DATA FROM FIRESTORE */
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            fullName: data.fullName || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            gender: data.gender || 'Male',
            dateOfBirth: data.dateOfBirth || '',
            cetRank: data.cetRank || '',
            cetPercentile: data.cetPercentile || '',
            category: data.category || 'OPEN',
            preferredCities: data.preferredCities || [],
            preferredBranches: data.preferredBranches || []
          });
        } else {
          setFormData(prev => ({
            ...prev,
            email: user.email || ''
          }));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        toast.error('Failed to load profile');
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const toggleArrayField = (field, value) =>
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.includes(value)
        ? prev[field].filter(v => v !== value)
        : [...(prev[field] || []), value]
    }));

  /* ✅ SAVE PROFILE TO FIRESTORE */
  const handleSave = async () => {
    if (!user) return;
    
    // Validation
    if (!formData.fullName) {
      toast.error('Please enter your full name');
      return;
    }
    
    setIsSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { ...formData, lastUpdated: new Date().toISOString() }, { merge: true });
      toast.success('Profile updated successfully!', {
        icon: '🎉',
        style: {
          borderRadius: '12px',
          background: '#4F46E5',
          color: '#fff',
        }
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-purple-600 border-b-transparent rounded-full animate-spin animation-delay-500"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full filter blur-3xl animate-pulse animate-float-slow" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full filter blur-3xl animate-pulse delay-1000 animate-float" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full filter blur-3xl animate-pulse delay-500 animate-float-slow" />
        </div>
        
        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                background: `radial-gradient(circle, ${i % 3 === 0 ? '#FF9F1C' : i % 3 === 1 ? '#8c52ff' : '#4F46E5'}, transparent)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                animationName: 'float-particle',
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Header with Glass Effect */}
      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo with Animation */}
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => navigate('/')}
            >
              <img 
                src="/logo.png" 
                alt="CET Insights" 
                className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo.svg';
                }}
              />
              <div className="ml-4 hidden md:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CET Insights
                </span>
              </div>
            </div>

            {/* Navigation with Enhanced Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-2 px-5 py-2.5 text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium rounded-xl hover:bg-blue-50 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-5 py-2.5 text-gray-700 hover:text-red-600 transition-all duration-300 font-medium rounded-xl hover:bg-red-50 active:scale-95"
              >
                <LogOut className="w-5 h-5 transition-transform group-hover:rotate-12" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header with Enhanced Design */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 mb-8 shadow-xl shadow-blue-500/5 animate-slide-up">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Enhanced Profile Avatar with Upload Option */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-4xl text-white shadow-lg overflow-hidden ring-4 ring-white ring-offset-2 ring-offset-blue-50">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-full h-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-4xl">
                      {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : '👤'}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95">
                    <Upload size={16} className="text-blue-600" />
                  </button>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {formData.fullName || 'Your Name'}
                      </h1>
                      {formData.category && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-xs font-semibold border border-green-200">
                          <Shield size={12} />
                          {formData.category}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-blue-500" />
                        <span className="text-sm">{formData.email}</span>
                      </div>
                      {formData.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-green-500" />
                          <span className="text-sm">{formData.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Profile Completion Progress */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">Profile Completion</span>
                        <span className="text-sm font-bold text-blue-600">{profileCompletion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${profileCompletion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Edit Button */}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`group relative overflow-hidden px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                      isEditing 
                        ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <X size={18} className="transition-transform group-hover:rotate-90" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit size={18} className="transition-transform group-hover:rotate-12" />
                          Edit Profile
                        </>
                      )}
                    </span>
                    {!isEditing && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Quick Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats Cards */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="text-blue-500" size={20} />
                  Your Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <span className="text-gray-600">CET Rank</span>
                    <span className="font-bold text-lg text-blue-600">
                      {formData.cetRank || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <span className="text-gray-600">Percentile</span>
                    <span className="font-bold text-lg text-purple-600">
                      {formData.cetPercentile ? `${formData.cetPercentile}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <span className="text-gray-600">Preferences</span>
                    <span className="font-bold text-lg text-green-600">
                      {formData.preferredCities?.length + formData.preferredBranches?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="text-gray-500" size={20} />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Bell size={16} className="text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">Notifications</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <GraduationCap size={16} className="text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-700">College Predictor</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-purple-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/60 overflow-hidden shadow-xl animate-slide-up animation-delay-100">
                {/* Enhanced Tabs */}
                <div className="border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex">
                    {[
                      { id: 'personal', label: 'Personal Info', icon: User, color: 'blue' },
                      { id: 'academic', label: 'Academic', icon: Award, color: 'purple' },
                      { id: 'preferences', label: 'Preferences', icon: Shield, color: 'green' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex-1 px-6 py-4 font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                          activeTab === tab.id
                            ? `text-${tab.color}-600`
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                        }`}
                      >
                        <tab.icon 
                          size={18} 
                          className={`transition-transform duration-300 ${
                            activeTab === tab.id ? 'scale-110' : ''
                          }`}
                        />
                        {tab.label}
                        {activeTab === tab.id && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content with Enhanced Animations */}
                <div className="p-6 md:p-8">
                  {/* Personal Info */}
                  {activeTab === 'personal' && (
                    <div className="space-y-6 animate-fade-in">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="text-blue-500" />
                        Personal Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                          { label: 'Full Name', field: 'fullName', type: 'text', placeholder: 'Enter your full name', icon: User },
                          { label: 'Email', field: 'email', type: 'email', placeholder: 'your.email@example.com', icon: Mail },
                          { label: 'Phone Number', field: 'phone', type: 'tel', placeholder: '+91 1234567890', icon: Phone },
                          { label: 'Date of Birth', field: 'dateOfBirth', type: 'date', icon: Calendar }
                        ].map(({ label, field, type, placeholder, icon: Icon }) => (
                          <div key={field} className="relative group">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Icon size={16} className="text-blue-500" />
                              {label}
                            </label>
                            <div className="relative">
                              <input
                                type={type}
                                value={formData[field]}
                                onChange={e => handleChange(field, e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500 hover:border-gray-400"
                                placeholder={placeholder}
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Icon size={18} />
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                          <div className="flex gap-3">
                            {['Male', 'Female', 'Other'].map(g => (
                              <button
                                key={g}
                                onClick={() => isEditing && handleChange('gender', g)}
                                disabled={!isEditing}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                                  formData.gender === g
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } ${!isEditing && 'opacity-60 cursor-not-allowed'} group`}
                              >
                                {formData.gender === g && <Check size={16} />}
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Academic */}
                  {activeTab === 'academic' && (
                    <div className="space-y-6 animate-fade-in">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Award className="text-purple-500" />
                        Academic Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">CET Rank</label>
                          <input
                            type="number"
                            value={formData.cetRank}
                            onChange={e => handleChange('cetRank', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500 hover:border-gray-400"
                            placeholder="Enter your CET rank"
                          />
                        </div>

                        <div className="group">
                          <label className="block text-sm font-medium text-gray-700 mb-2">CET Percentile</label>
                          <input
                            type="number"
                            value={formData.cetPercentile}
                            onChange={e => handleChange('cetPercentile', e.target.value)}
                            disabled={!isEditing}
                            step="0.01"
                            max="100"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500 hover:border-gray-400"
                            placeholder="Enter percentile (e.g., 98.5)"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <div className="flex flex-wrap gap-3">
                            {CATEGORIES.map(cat => (
                              <button
                                key={cat}
                                onClick={() => isEditing && handleChange('category', cat)}
                                disabled={!isEditing}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                                  formData.category === cat
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } ${!isEditing && 'opacity-60 cursor-not-allowed'} group`}
                              >
                                {formData.category === cat && <Check size={14} />}
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences */}
                  {activeTab === 'preferences' && (
                    <div className="space-y-6 animate-fade-in">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Shield className="text-green-500" />
                        College Preferences
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <MapPin size={16} className="text-blue-500" />
                            Preferred Cities
                            <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {formData.preferredCities?.length || 0} selected
                            </span>
                          </label>
                          <div className="border border-gray-300 rounded-xl p-4 max-h-64 overflow-y-auto bg-gray-50/50">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {CITIES.map(city => (
                                <button
                                  key={city}
                                  onClick={() => isEditing && toggleArrayField('preferredCities', city)}
                                  disabled={!isEditing}
                                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                                    formData.preferredCities?.includes(city)
                                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md transform scale-105'
                                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300'
                                  } ${!isEditing && 'opacity-60 cursor-not-allowed'} group`}
                                >
                                  {formData.preferredCities?.includes(city) ? (
                                    <>
                                      <Check size={14} />
                                      <span>{city}</span>
                                    </>
                                  ) : city}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <GraduationCap size={16} className="text-purple-500" />
                            Preferred Branches
                            <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                              {formData.preferredBranches?.length || 0} selected
                            </span>
                          </label>
                          <div className="border border-gray-300 rounded-xl p-4 max-h-64 overflow-y-auto bg-gray-50/50 space-y-3">
                            {BRANCHES.map(branch => (
                              <button
                                key={branch}
                                onClick={() => isEditing && toggleArrayField('preferredBranches', branch)}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-all duration-300 flex items-center gap-3 ${
                                  formData.preferredBranches?.includes(branch)
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md transform scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-purple-300'
                                } ${!isEditing && 'opacity-60 cursor-not-allowed'} group`}
                              >
                                <div className={`w-2 h-2 rounded-full ${formData.preferredBranches?.includes(branch) ? 'bg-white' : 'bg-gray-300'}`}></div>
                                {formData.preferredBranches?.includes(branch) && <Check size={14} className="ml-auto" />}
                                <span className="flex-1 text-left">{branch}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Save Button Section */}
          {isEditing && (
            <div className="mt-8 animate-fade-in">
              <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="group px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 hover:border-gray-400 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <X size={16} className="transition-transform group-hover:rotate-90" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="transition-transform group-hover:scale-110" />
                        Save Changes
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(10px, -20px) rotate(120deg); }
          66% { transform: translate(-10px, -10px) rotate(240deg); }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        /* Custom scrollbar */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        
        /* Improved focus styles for accessibility */
        :focus-visible {
          outline: 2px solid #4F46E5;
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}