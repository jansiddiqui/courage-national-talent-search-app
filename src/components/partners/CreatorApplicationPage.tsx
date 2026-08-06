'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Camera, 
  Video, 
  MessageSquare, 
  Share2, 
  Globe, 
  FileText, 
  Plus, 
  Trash2,
  Zap,
  Check,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { PartnerReferralEngine } from '@/domains/partner-referral/PartnerReferralEngine';

interface PlatformDetail {
  platform: string;
  handleOrUrl: string;
  followerCount: number | '';
  proofScreenshotUrl?: string;
}

interface CreatorApplicationPageProps {
  onSubmitted: (data: any) => void;
  onCancel: () => void;
}

export const CreatorApplicationPage: React.FC<CreatorApplicationPageProps> = ({
  onSubmitted,
  onCancel
}) => {
  const [step, setStep] = useState<number>(1);
  const [profileImage, setProfileImage] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [availabilityCheck, setAvailabilityCheck] = useState<{ available: boolean; message: string }>({ available: true, message: '' });
  const [codeSuggestions, setCodeSuggestions] = useState<string[]>([]);

  // ALL FORM FIELDS INITIALIZED EMPTY FOR REAL CREATOR INPUT
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    niche: 'Infotainment & Knowledge Content',
    contentLanguage: 'Hinglish',
    bio: '',
    referralCode: '',
    customSlug: '',
    password: '',
    confirmPassword: '',
    missionPledge: false
  });

  const allNicheCategories = [
    'School Education (Class 1-12)',
    'Competitive Exams (JEE, NEET, UPSC, SSC, Banking)',
    'Mathematics, Science & Logic',
    'Language Learning & English Speaking',
    'Coding, Tech & AI Education',
    'Tech Reviews, Gadgets & Hardware',
    'Software Engineering & Web Development',
    'AI, Data Science & Machine Learning',
    'Career Guidance, Jobs & Mentorship',
    'Personal Finance, Investing & Money',
    'Entrepreneurship, Startups & Business',
    'Productivity, Self-Improvement & Mindset',
    'Infotainment & Knowledge Content',
    'Storytelling, History & Geopolitics',
    'Book Reviews & Educational Podcasts',
    'Vlogging, Lifestyle & Daily Motion',
    'Gaming, Esports & Live Streaming',
    'Motivational & Inspirational Voice',
    'School Teacher / Principal / Coordinator',
    'College Student / Campus Leader',
    'Parent & Guardian Community Admin',
    'NGO & Social Impact Group',
    'Other Creator Niche'
  ];

  const allIndianLanguages = [
    'Hinglish',
    'Hindi (हिंदी)',
    'English',
    'Bengali (বাংলা)',
    'Marathi (मराठी)',
    'Telugu (తెలుగు)',
    'Tamil (தமிழ்)',
    'Gujarati (ગુજરાતી)',
    'Urdu (اردو)',
    'Kannada (కన్నడ)',
    'Odia (ଓଡ଼ିଆ)',
    'Malayalam (മലയാളം)',
    'Punjabi (ਪੰਜਾਬੀ)',
    'Bhojpuri (भोजपुरी)',
    'Maithili (मैथिली)',
    'Assamese (অসমীয়া)',
    'Santali (ᱥᱟᱱᱛᱟᱲᱤ)',
    'Kashmiri (کٲشُر)',
    'Nepali (नेपाली)',
    'Konkani (कोंकणी)',
    'Sindhi (سنڌي / सिंधी)',
    'Dogri (डोगरी)',
    'Manipuri / Meitei (ꯃꯩꯇꯩꯂꯣꯟ)',
    'Bodo (बर\')',
    'Sanskrit (संस्कृतम्)'
  ];

  const availablePlatforms = [
    'YouTube Channel',
    'Instagram Profile',
    'LinkedIn Network',
    'Telegram Channel',
    'WhatsApp Community',
    'Facebook Page/Group',
    'X (Twitter)',
    'Website / Blog',
    'Newsletter',
    'Podcast'
  ];

  // INITIALIZED AS EMPTY ARRAY — NO PRE-FILLED DUMMY DATA
  const [platformDetails, setPlatformDetails] = useState<PlatformDetail[]>([]);

  // Update suggestions whenever name changes
  useEffect(() => {
    if (formData.fullName) {
      const suggestions = PartnerReferralEngine.generateCodeSuggestions(formData.fullName);
      setCodeSuggestions(suggestions);
      if (!formData.referralCode && suggestions.length > 0) {
        setFormData(prev => ({ ...prev, referralCode: suggestions[0], customSlug: suggestions[0].toLowerCase() }));
      }
    }
  }, [formData.fullName]);

  // Live availability check when referralCode changes
  useEffect(() => {
    if (formData.referralCode) {
      const check = PartnerReferralEngine.checkCodeAvailability(formData.referralCode);
      setAvailabilityCheck(check);
    } else {
      setAvailabilityCheck({ available: true, message: '' });
    }
  }, [formData.referralCode]);

  const togglePlatformSelect = (platformName: string) => {
    const exists = platformDetails.find(p => p.platform === platformName);
    if (exists) {
      setPlatformDetails(prev => prev.filter(p => p.platform !== platformName));
    } else {
      setPlatformDetails(prev => [...prev, { platform: platformName, handleOrUrl: '', followerCount: '', proofScreenshotUrl: '' }]);
    }
  };

  const updatePlatformField = (platformName: string, field: keyof PlatformDetail, value: any) => {
    setPlatformDetails(prev => prev.map(p => {
      if (p.platform === platformName) {
        return { 
          ...p, 
          [field]: field === 'followerCount' ? (value === '' ? '' : Math.max(0, Number(value) || 0)) : value 
        };
      }
      return p;
    }));
  };

  const handleProofScreenshotUpload = (platformName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePlatformField(platformName, 'proofScreenshotUrl', reader.result as string);
        setErrors(prev => {
          const next = { ...prev };
          delete next[`proof_${platformName}`];
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate total combined reach
  const totalReach = platformDetails.reduce((sum, p) => sum + (typeof p.followerCount === 'number' ? p.followerCount : 0), 0);

  // Determine reach scale string
  const getReachScaleString = (reach: number) => {
    if (reach >= 250000) return '250k+';
    if (reach >= 50000) return '50k - 250k';
    if (reach >= 10000) return '10k - 50k';
    if (reach >= 1000) return '1k - 10k';
    return '< 1k';
  };

  const currentScale = getReachScaleString(totalReach);
  const assignedTier = PartnerReferralEngine.calculateCreatorTier(currentScale);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setErrors(prev => ({ ...prev, profileImage: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  // VALIDATION CHECKERS FOR STEP 1
  const validateStep1 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!profileImage) {
      newErrors.profileImage = 'Profile Photo is required. Please upload your photo.';
    }

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name is required (minimum 3 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const phoneRegex = /^[0-9+\s-]{10,15}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid WhatsApp mobile number.';
    }

    if (!formData.city || formData.city.trim().length < 2) {
      newErrors.city = 'Please enter your City and State.';
    }

    if (!formData.bio || formData.bio.trim().length < 10) {
      newErrors.bio = 'Please enter a short bio (at least 10 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // VALIDATION CHECKERS FOR STEP 2
  const validateStep2 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (platformDetails.length === 0) {
      newErrors.platforms = 'Please select at least 1 active platform channel.';
      setErrors(newErrors);
      return false;
    }

    platformDetails.forEach(p => {
      if (!p.handleOrUrl || p.handleOrUrl.trim().length < 3) {
        newErrors[`handle_${p.platform}`] = 'Please enter your profile / channel link.';
      }
      if (!p.followerCount || p.followerCount <= 0) {
        newErrors[`followers_${p.platform}`] = 'Please enter your follower / subscriber count.';
      }
      if (!p.proofScreenshotUrl) {
        newErrors[`proof_${p.platform}`] = 'Please upload a verification screenshot for this channel.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // VALIDATION CHECKERS FOR STEP 3
  const validateStep3 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const codeToTest = formData.referralCode || (formData.fullName ? PartnerReferralEngine.generateReferralCode(formData.fullName) : '');
    if (!codeToTest || codeToTest.length < 4) {
      newErrors.referralCode = 'Referral Code must be at least 4 characters (e.g. CNTS01).';
    } else if (codeToTest.length > 6) {
      newErrors.referralCode = 'Referral Code MUST be maximum 6 characters long (e.g. CNTS01 or CNTSJN).';
    } else if (!codeToTest.toUpperCase().includes('CNTS')) {
      newErrors.referralCode = 'Referral Code MUST contain "CNTS" (e.g. CNTS01 or CNTSJN).';
    } else if (!availabilityCheck.available) {
      newErrors.referralCode = availabilityCheck.message;
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.missionPledge) {
      newErrors.missionPledge = 'You must accept the Courage Partner Code of Conduct.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setErrors({});
      setStep(2);
    }
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      setErrors({});
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep3()) {
      const finalRefCode = formData.referralCode || (formData.fullName ? PartnerReferralEngine.generateReferralCode(formData.fullName) : 'CNTS01');
      const finalSlug = formData.customSlug || (formData.fullName ? formData.fullName.toLowerCase().replace(/\s+/g, '') : 'creator');

      const payload = {
        ...formData,
        profileImage,
        referralCode: finalRefCode,
        customSlug: finalSlug,
        platformDetails,
        totalReach,
        audienceScale: currentScale
      };

      try {
        const res = await fetch('/api/partner/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.partner) {
          onSubmitted(data.partner);
        } else {
          onSubmitted(payload);
        }
      } catch (err) {
        console.error('Error submitting application:', err);
        onSubmitted(payload);
      }
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-indigo-50/70 via-[#F8FAFF] to-[#F8FAFF] min-h-screen pt-[140px] sm:pt-36 md:pt-40 pb-20 text-[#0F172A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* HEADER BRAND & APPLICATION BADGE */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm mb-6 sm:mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
            <Award className="w-4 h-4 text-amber-600" /> Selective Creator Partner Application
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Apply to Become a Courage Partner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Founding Slot #385 Available • Reviewed individually within 24 hours
          </p>
        </div>

        {/* STEP 1: DETAILED CREATOR PROFILE & PHOTO */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <span className="inline-block text-[11px] sm:text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Step 1 of 3 • Identity & Photo
              </span>
              <h2 className="font-display text-2xl font-bold text-slate-900 mt-2">
                Creator Profile Information
              </h2>
              <p className="text-slate-500 text-sm">
                Provide your real creator identity to personalize your official Courage Partner profile page.
              </p>
            </div>

            {/* Profile Photo Uploader */}
            <div className="space-y-1">
              <div className={`flex flex-row items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-slate-50/80 border ${errors.profileImage ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200/90'}`}>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-indigo-600 shadow-md shrink-0 flex items-center justify-center">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1.5 text-left flex-1 min-w-0">
                  <label className="block text-xs font-extrabold text-slate-900 truncate">Upload Creator Profile Photo *</label>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <label className="text-xs py-2 px-3.5 sm:px-4 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl flex items-center gap-1.5 transition-all shadow-xs shrink-0">
                      <Camera className="w-3.5 h-3.5" /> Upload Photo
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {profileImage && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 shrink-0"><Check className="w-3.5 h-3.5" /> Photo Added</span>}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">JPG or PNG. Will be saved to Supabase Storage.</p>
                </div>
              </div>
              {errors.profileImage && (
                <p className="text-xs text-rose-600 font-bold flex items-center gap-1 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.profileImage}
                </p>
              )}
            </div>

            {/* Basic Info Fields with Direct Inline Errors Below */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your real full name"
                  value={formData.fullName}
                  onChange={e => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-600 ${errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'}`}
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-600 mt-1 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={e => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-600 ${errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'}`}
                />
                {errors.email && (
                  <p className="text-xs text-rose-600 mt-1 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  placeholder="+91 Mobile Number"
                  value={formData.phone}
                  onChange={e => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-600 ${errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'}`}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-600 mt-1 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City & State *</label>
                <input
                  type="text"
                  placeholder="e.g. Patna, Bihar"
                  value={formData.city}
                  onChange={e => {
                    setFormData({ ...formData, city: e.target.value });
                    if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-600 ${errors.city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'}`}
                />
                {errors.city && (
                  <p className="text-xs text-rose-600 mt-1 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.city}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Creator Niche *</label>
                <select
                  value={formData.niche}
                  onChange={e => setFormData({ ...formData, niche: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-600 bg-white font-medium"
                >
                  {allNicheCategories.map((n, idx) => (
                    <option key={idx} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Content Language *</label>
                <select
                  value={formData.contentLanguage}
                  onChange={e => setFormData({ ...formData, contentLanguage: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-600 bg-white font-medium"
                >
                  {allIndianLanguages.map((lang, idx) => (
                    <option key={idx} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Creator Bio / Mission Statement *</label>
              <textarea
                rows={3}
                placeholder="Describe your audience, channel vision, and goals..."
                value={formData.bio}
                onChange={e => {
                  setFormData({ ...formData, bio: e.target.value });
                  if (errors.bio) setErrors(prev => ({ ...prev, bio: '' }));
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-600 ${errors.bio ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'}`}
              ></textarea>
              {errors.bio && (
                <p className="text-xs text-rose-600 mt-1 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.bio}
                </p>
              )}
            </div>

            <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer text-center"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Next: Channels & Verification <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: MULTI-PLATFORM HANDLES, FOLLOWER COUNTS & PROOF SCREENSHOTS */}
        {step === 2 && (
          <form onSubmit={handleNextStep2} className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <span className="inline-block text-[11px] sm:text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Step 2 of 3 • Channels & Verification
              </span>
              <h2 className="font-display text-2xl font-bold text-slate-900 mt-2">
                Add Your Channels & Verification Screenshots
              </h2>
              <p className="text-slate-500 text-sm">
                Select your active platforms. Enter your real handle link, follower count, and upload a profile/analytics screenshot for verification.
              </p>
            </div>

            {/* LIVE COMBINED REACH SUMMARY BOX */}
            <div className="bg-[#0F172A] text-white p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-mono font-extrabold tracking-wider block">Combined Creator Reach</span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-400">
                  {totalReach.toLocaleString()} Total Reach
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">Across {platformDetails.length} active platforms</span>
              </div>

              <div className="bg-slate-900 border border-slate-700/80 px-4 py-2.5 rounded-xl text-left sm:text-right shrink-0">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Assigned Creator Rate</span>
                <span className="font-mono text-xs sm:text-sm font-black text-amber-300">
                  {assignedTier.sharePercent}% Share (₹{assignedTier.perRegistrationAmount}/reg)
                </span>
              </div>
            </div>

            {/* PLATFORM SELECT CHIPS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select All Platforms You Use *</label>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {availablePlatforms.map(plt => {
                  const selected = platformDetails.some(p => p.platform === plt);
                  return (
                    <button
                      key={plt}
                      type="button"
                      onClick={() => {
                        togglePlatformSelect(plt);
                        if (errors.platforms) setErrors(prev => ({ ...prev, platforms: '' }));
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 truncate ${
                        selected 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {selected ? <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                      <span className="truncate">{plt}</span>
                    </button>
                  );
                })}
              </div>
              {errors.platforms && (
                <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.platforms}
                </p>
              )}
            </div>

            {/* EMPTY STATE IF NO PLATFORM IS SELECTED YET */}
            {platformDetails.length === 0 && (
              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 space-y-2">
                <Globe className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-bold text-sm text-slate-800">No Channels Selected Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the platform buttons above (e.g. YouTube, Instagram, Telegram) to enter your handle links, follower counts, and proof screenshots.
                </p>
              </div>
            )}

            {/* DETAILS & SCREENSHOT UPLOADER FOR EACH SELECTED PLATFORM */}
            <div className="space-y-4 pt-2">
              {platformDetails.map((pltItem, idx) => {
                const handleErr = errors[`handle_${pltItem.platform}`];
                const followersErr = errors[`followers_${pltItem.platform}`];
                const proofErr = errors[`proof_${pltItem.platform}`];

                return (
                  <div key={idx} className={`p-5 rounded-2xl border space-y-4 relative ${
                    handleErr || followersErr || proofErr 
                      ? 'bg-slate-50 border-rose-300'
                      : 'bg-slate-50 border-slate-200/90'
                  }`}>
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                      <span className="font-bold text-sm text-indigo-900 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-500" /> {pltItem.platform}
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePlatformSelect(pltItem.platform)}
                        className="text-rose-500 hover:text-rose-700 p-1 text-xs flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove Channel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Handle / Profile Link *</label>
                        <input
                          type="text"
                          placeholder={
                            pltItem.platform.includes('YouTube') ? 'e.g. youtube.com/@yourchannel' :
                            pltItem.platform.includes('Instagram') ? 'e.g. instagram.com/yourhandle' :
                            pltItem.platform.includes('Telegram') ? 'e.g. t.me/yourchannel' :
                            'e.g. yourprofilelink.com'
                          }
                          value={pltItem.handleOrUrl}
                          onChange={e => {
                            updatePlatformField(pltItem.platform, 'handleOrUrl', e.target.value);
                            if (handleErr) setErrors(prev => { const n = { ...prev }; delete n[`handle_${pltItem.platform}`]; return n; });
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white font-medium ${handleErr ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'}`}
                        />
                        {handleErr && (
                          <p className="text-xs text-rose-600 font-bold mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {handleErr}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Real Subscribers / Followers Count *</label>
                        <input
                          type="number"
                          min={1}
                          placeholder="e.g. 25000"
                          value={pltItem.followerCount}
                          onChange={e => {
                            updatePlatformField(pltItem.platform, 'followerCount', e.target.value);
                            if (followersErr) setErrors(prev => { const n = { ...prev }; delete n[`followers_${pltItem.platform}`]; return n; });
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white font-mono font-bold text-indigo-900 ${followersErr ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'}`}
                        />
                        {followersErr && (
                          <p className="text-xs text-rose-600 font-bold mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {followersErr}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* PROOF SCREENSHOT UPLOADER WITH INLINE ERROR DIRECTLY BELOW */}
                    <div className="pt-2 border-t border-slate-200/60">
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Upload Channel / Studio Verification Screenshot *
                      </label>
                      <div className={`flex flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border ${proofErr ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'}`}>
                        {pltItem.proofScreenshotUrl ? (
                          <div className="relative w-14 h-12 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-xs shrink-0">
                            <img src={pltItem.proofScreenshotUrl} alt="Proof Screenshot" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-12 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          </div>
                        )}

                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                          <div className="min-w-0">
                            <span className={`text-xs font-extrabold block truncate ${pltItem.proofScreenshotUrl ? 'text-emerald-700' : 'text-slate-800'}`}>
                              {pltItem.proofScreenshotUrl ? '✓ Screenshot Attached' : 'Attach Studio Screenshot'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium block truncate">Shows studio analytics</span>
                          </div>

                          <label className="text-[11px] font-extrabold py-1.5 px-3 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center gap-1.5 shrink-0 w-fit transition-all shadow-xs">
                            <Upload className="w-3.5 h-3.5 text-amber-300" />
                            {pltItem.proofScreenshotUrl ? 'Change' : 'Upload'}
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleProofScreenshotUpload(pltItem.platform, e)} 
                              className="hidden" 
                            />
                          </label>
                        </div>
                      </div>
                      {proofErr && (
                        <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {proofErr}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-1/2 sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Next: Custom Referral Code <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: REFERRAL CODE CUSTOMIZATION, SUGGESTIONS, UNIQUENESS & PLEDGE */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <span className="inline-block text-[11px] sm:text-xs font-mono font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Step 3 of 3 • Referral Code & Pledge
              </span>
              <h2 className="font-display text-2xl font-bold text-slate-900 mt-2">
                Customize Your Official Referral Code
              </h2>
              <p className="text-slate-500 text-sm">
                Your referral link will use your production domain and custom 6-character referral code containing "CNTS".
              </p>
            </div>

            {/* OFFICIAL REFERRAL CODE RULES BOX */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 text-xs text-indigo-950">
              <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" /> Official Courage Partner Referral Code Rules:
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-medium text-slate-700 text-[11px] pt-1">
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" /> Must be <strong>4 to 6 characters</strong> long.</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" /> MUST contain <strong>"CNTS"</strong> (e.g. CNTSJN).</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" /> Only <strong>Letters (A-Z) & Numbers (0-9)</strong>.</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" /> Must be <strong>100% Unique</strong> in database.</li>
              </ul>
            </div>

            {/* CODE INPUT & LIVE AVAILABILITY CHECK */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Desired Referral Code * (Max 6 Chars)
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                <span className="px-3.5 py-3 text-xs text-slate-500 font-mono border-r border-slate-200 bg-slate-100 font-semibold shrink-0">
                  thecouragelibrary.com/register?ref=
                </span>
                <input
                  type="text"
                  maxLength={6}
                  placeholder={formData.fullName ? PartnerReferralEngine.generateReferralCode(formData.fullName) : 'CNTS01'}
                  value={formData.referralCode}
                  onChange={e => {
                    setFormData({ 
                      ...formData, 
                      referralCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6),
                      customSlug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6)
                    });
                    if (errors.referralCode) setErrors(prev => ({ ...prev, referralCode: '' }));
                  }}
                  className="w-full px-3 py-2.5 text-sm bg-white focus:outline-none font-mono text-indigo-900 font-bold tracking-wider"
                />
              </div>

              {/* Live Availability Badge */}
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs">
                  {availabilityCheck.message && (
                    <span className={`font-bold inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] ${
                      availabilityCheck.available 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {availabilityCheck.available ? <Check className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-rose-600" />}
                      {availabilityCheck.message}
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
                  {formData.referralCode.length}/6 characters
                </span>
              </div>

              {errors.referralCode && (
                <p className="text-xs text-rose-600 font-bold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.referralCode}
                </p>
              )}
            </div>

            {/* SMART CODE SUGGESTIONS CHIPS */}
            {codeSuggestions.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Suggested Unique Referral Codes for You:
                </label>
                <div className="flex flex-wrap gap-2">
                  {codeSuggestions.map(sugCode => (
                    <button
                      key={sugCode}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, referralCode: sugCode, customSlug: sugCode.toLowerCase() });
                        if (errors.referralCode) setErrors(prev => ({ ...prev, referralCode: '' }));
                      }}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                        formData.referralCode === sugCode
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-indigo-900 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {sugCode}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PARTNER ACCOUNT PASSWORD SETUP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Partner Account Password *
                </label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={e => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-600 ${errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'}`}
                />
                {errors.password && (
                  <p className="text-xs text-rose-600 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={e => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-600 ${errors.confirmPassword ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'}`}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-600 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* ASSIGNED RATE RECAP */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                <span className="font-bold text-xs flex items-center gap-1.5 text-amber-900">
                  <Zap className="w-4 h-4 text-amber-600" /> Assigned Creator Tier Result
                </span>
                <span className="font-mono text-xs font-bold bg-amber-200/80 px-2 py-0.5 rounded text-amber-950">
                  {assignedTier.tierName}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-amber-900">
                Based on your total combined reach of <strong>{totalReach.toLocaleString()}</strong> across {platformDetails.length} platforms in <strong>{formData.niche}</strong> ({formData.contentLanguage}), you qualify for <strong>{assignedTier.sharePercent}% Revenue Share (₹{assignedTier.perRegistrationAmount} per verified CNTS registration)</strong> + ₹{assignedTier.milestoneBonus.toLocaleString()} milestone bonus.
              </p>
            </div>

            {/* INTEGRITY PLEDGE */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Courage Creator Code of Conduct
              </div>
              <p className="text-slate-600 leading-relaxed">
                "I commit to representing Courage Library with honesty, accuracy, and dignity. I will prioritize student benefit and educational access above commercial gains."
              </p>
              <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.missionPledge}
                  onChange={e => {
                    setFormData({ ...formData, missionPledge: e.target.checked });
                    if (errors.missionPledge) setErrors(prev => ({ ...prev, missionPledge: '' }));
                  }}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="font-semibold text-slate-900">
                  I accept the Courage Partner Integrity Pledge & Code of Conduct.
                </span>
              </label>
              {errors.missionPledge && (
                <p className="text-xs text-rose-600 font-bold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.missionPledge}
                </p>
              )}
            </div>

            <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-1/2 sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/2 sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Submit Application <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
