"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Trophy, 
  User, 
  Calendar, 
  School, 
  Phone, 
  Mail, 
  MapPin, 
  Languages, 
  HelpCircle, 
  Eye, 
  AlertCircle,
  Percent,
  CheckCircle,
  Building,
  ShieldCheck,
  CreditCard,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RegistrationData, RegistrationStep } from "@/types/registration";
import { INDIAN_STATES, STATE_DISTRICTS } from "@/constants/indianStates";
import { saveRegistration, updateRegistrationStatus, updateRegistrationData, uploadCandidatePhoto } from "@/services/supabaseService";
import PhotoUploader from "@/components/registration/PhotoUploader";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Hydrated state flag to prevent server-client mismatch
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  
  // Consent and payment states
  const [parentConsent, setParentConsent] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0); // 0%, 25%, 50%
  const [finalPrice, setFinalPrice] = useState(99);

  // Sandbox modal state
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [sandboxOrderDetails, setSandboxOrderDetails] = useState<any>(null);

  // Mobile verification and registration draft states
  const [draftRegId, setDraftRegId] = useState("");
  const [showDraftSaved, setShowDraftSaved] = useState(false);
  const [whatsappSameAsMobile, setWhatsappSameAsMobile] = useState(false);

  const [formData, setFormData] = useState<RegistrationData>({
    studentName: "",
    dob: "",
    studentClass: "",
    schoolName: "",
    schoolCity: "",
    schoolCode: "",
    parentName: "",
    mobile_number: "",
    whatsapp_number: "",
    parentEmail: "",
    state: "",
    district: "",
    language: "",
    whyParticipating: "",
    howHeard: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    referral_code: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof RegistrationData, boolean>>>({});



  // Restore state from sessionStorage on mount and load query params
  useEffect(() => {
    const savedForm = sessionStorage.getItem("cnts_registration_form");
    const initialData = savedForm ? JSON.parse(savedForm) : {};

    // Get UTMs and Referral codes from query parameters
    const utmSource = searchParams.get("utm_source") || "";
    const utmMedium = searchParams.get("utm_medium") || "";
    const utmCampaign = searchParams.get("utm_campaign") || "";
    const refCode = searchParams.get("ref") || searchParams.get("referral_code") || "";

    const savedStep = sessionStorage.getItem("cnts_registration_step");
    let stepToSet: RegistrationStep | null = null;
    if (savedStep) {
      const step = parseInt(savedStep, 10);
      if (step === 1 || step === 2 || step === 3) {
        stepToSet = step as RegistrationStep;
      }
    }

    const timer = setTimeout(() => {
      setIsHydrated(true);
      
      const cleanMobile = initialData.mobile_number?.startsWith("+91")
        ? initialData.mobile_number.slice(3)
        : (initialData.mobile_number || "");
      const cleanWhatsapp = initialData.whatsapp_number?.startsWith("+91")
        ? initialData.whatsapp_number.slice(3)
        : (initialData.whatsapp_number || "");

      setFormData(prev => ({
        ...prev,
        ...initialData,
        mobile_number: cleanMobile,
        whatsapp_number: cleanWhatsapp,
        utm_source: initialData.utm_source || utmSource,
        utm_medium: initialData.utm_medium || utmMedium,
        utm_campaign: initialData.utm_campaign || utmCampaign,
        referral_code: initialData.referral_code || refCode,
      }));
      if (stepToSet) {
        setCurrentStep(stepToSet);
      }
      
      const savedDraftId = sessionStorage.getItem("cnts_draft_registration_id") || "";
      if (savedDraftId) {
        setDraftRegId(savedDraftId);
      }

      if (cleanMobile && cleanMobile === cleanWhatsapp) {
        setWhatsappSameAsMobile(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Save form data to sessionStorage on change
  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem("cnts_registration_form", JSON.stringify(formData));
    }
  }, [formData, isHydrated]);


  // Save current step to sessionStorage
  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem("cnts_registration_step", currentStep.toString());
    }
  }, [currentStep, isHydrated]);



  // Validation functions
  const validateField = (name: keyof RegistrationData, value: string): string => {
    switch (name) {
      case "photo_base64":
        if (!value) return "Candidate passport photo is required";
        return "";

      case "studentName":
        if (!value.trim()) return "Student name is required";
        if (value.trim().length < 3) return "Name must be at least 3 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Only letters and spaces are allowed";
        return "";

      case "dob":
        if (!value) return "Date of birth is required";
        const dateObj = new Date(value);
        const year = dateObj.getFullYear();
        if (year < 2010 || year > 2018) {
          return "Student must be birth year 2010–2018";
        }
        return "";

      case "studentClass":
        if (!value) return "Please select a class";
        if (!["5", "6", "7", "8"].includes(value)) return "Invalid class selection";
        return "";

      case "schoolName":
        if (!value.trim()) return "School name is required";
        if (value.trim().length < 5) return "School name must be at least 5 characters";
        return "";

      case "schoolCity":
        if (!value.trim()) return "School city is required";
        if (value.trim().length < 3) return "City must be at least 3 characters";
        return "";

      case "schoolCode":
        return ""; // Optional

      case "parentName":
        if (!value.trim()) return "Parent name is required";
        if (value.trim().length < 3) return "Parent name must be at least 3 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Only letters and spaces are allowed";
        return "";

      case "mobile_number":
        if (!value) return "Mobile number is required";
        if (!/^[6-9]\d{9}$/.test(value)) {
          return "Enter a valid 10-digit Indian mobile number (should start with 6-9)";
        }
        return "";

      case "whatsapp_number":
        if (!value) return "WhatsApp number is required";
        if (!/^[6-9]\d{9}$/.test(value)) {
          return "Enter a valid 10-digit Indian WhatsApp number (should start with 6-9)";
        }
        return "";

      case "parentEmail":
        if (!value.trim()) return ""; // Optional email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return "Enter a valid email address";
        return "";

      case "state":
        if (!value) return "Please select a state";
        return "";

      case "district":
        if (!value) return "Please select a district";
        return "";

      case "language":
        if (!value) return "Please select a preferred language";
        return "";

      case "whyParticipating":
        if (!value) return "Please select your primary reason for participating";
        return "";

      case "howHeard":
        if (!value) return "Please select how you heard about us";
        return "";

      default:
        return "";
    }
  };

  const handleInputChange = (name: keyof RegistrationData, value: string) => {
    // Reset district if state changes
    if (name === "state") {
      setFormData(prev => ({ ...prev, [name]: value, district: "" }));
      setErrors(prev => ({ ...prev, state: "", district: "" }));
    } else if (name === "mobile_number" && whatsappSameAsMobile) {
      setFormData(prev => ({ ...prev, mobile_number: value, whatsapp_number: value }));
      if (errors.mobile_number) setErrors(prev => ({ ...prev, mobile_number: "" }));
      if (errors.whatsapp_number) setErrors(prev => ({ ...prev, whatsapp_number: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleBlur = (name: keyof RegistrationData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, (formData[name] as any) || "");
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleSameAsCheckboxChange = (checked: boolean) => {
    setWhatsappSameAsMobile(checked);
    if (checked) {
      setFormData(prev => ({ ...prev, whatsapp_number: prev.mobile_number }));
      setErrors(prev => ({ ...prev, whatsapp_number: "" }));
    }
  };

  const validateStep = (step: RegistrationStep): boolean => {
    const stepFields: Record<RegistrationStep, (keyof RegistrationData)[]> = {
      1: ["photo_base64", "studentName", "dob", "studentClass", "schoolName", "schoolCity"],
      2: ["parentName", "mobile_number", "whatsapp_number", "parentEmail"],
      3: ["state", "district", "language", "whyParticipating", "howHeard"],
    };


    const fieldsToValidate = stepFields[step];
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const errorMsg = validateField(field, (formData[field] as any) || "");
      if (errorMsg) {
        newErrors[field] = errorMsg;
        isValid = false;
      }
      setTouched(prev => ({ ...prev, [field]: true }));
    });

    setErrors(prev => ({ ...prev, ...newErrors }));

    if (!isValid) {
      const firstInvalidField = fieldsToValidate.find(field => !!newErrors[field]);
      if (firstInvalidField) {
        setTimeout(() => {
          const element = document.getElementById(firstInvalidField) || document.getElementsByName(firstInvalidField)[0];
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if ('focus' in element) {
              (element as any).focus();
            }
          }
        }, 100);
      }
    }

    return isValid;
  };

  const handleNextStep = async () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) {
        setIsSubmitting(true);
        try {
          const formattedMobile = `+91${formData.mobile_number}`;
          const formattedWhatsapp = `+91${formData.whatsapp_number}`;
          
          const draftData = {
            ...formData,
            mobile_number: formattedMobile,
            whatsapp_number: formattedWhatsapp,
            mobile_verified: true,
            registration_status: "DRAFT",
            payment_status: "PENDING"
          };
          
          let currentDraftId = draftRegId;
          if (currentDraftId) {
            await updateRegistrationData(currentDraftId, draftData);
          } else {
            const savedDraft = await saveRegistration(draftData);
            if (savedDraft && savedDraft.registrationId) {
              currentDraftId = savedDraft.registrationId;
              setDraftRegId(currentDraftId);
              sessionStorage.setItem("cnts_draft_registration_id", currentDraftId);
            }
          }

          if (currentDraftId && formData.photo_base64 && !formData.photo_url) {
            const uploadedUrl = await uploadCandidatePhoto(currentDraftId, formData.photo_base64);
            if (uploadedUrl) {
              await updateRegistrationData(currentDraftId, { photo_url: uploadedUrl });
              setFormData(prev => ({ ...prev, photo_url: uploadedUrl }));
            }
          }

          setShowDraftSaved(true);
          setTimeout(() => setShowDraftSaved(false), 3000);
        } catch (err) {
          console.error("Failed to save draft registration:", err);
        } finally {
          setIsSubmitting(false);
        }
      }

      if (currentStep < 3) {
        setCurrentStep(prev => (prev + 1) as RegistrationStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as RegistrationStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Coupon handling
  const applyCoupon = async () => {
    setCouponError("");
    setCouponSuccess("");
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    try {
      const res = await fetch(`/api/coupons/validate?code=${code}`);
      const data = await res.json();
      if (data.success) {
        setIsCouponApplied(true);
        setAppliedDiscount(data.discount);
        const price = Math.max(0, 99 - Math.round((99 * data.discount) / 100));
        setFinalPrice(price);
        setCouponSuccess(`${code} applied! You received a ${data.discount}% discount.`);
      } else {
        setCouponError(data.message || "Invalid or inactive coupon code.");
        setIsCouponApplied(false);
      }
    } catch (e) {
      setCouponError("Failed to validate coupon code. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setIsCouponApplied(false);
    setAppliedDiscount(0);
    setFinalPrice(99);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  // Load Razorpay script utility
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    if (!parentConsent) {
      setSubmitError("Please provide parent consent to proceed.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // 1. Create order on Next.js server route
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: isCouponApplied ? couponCode.trim().toUpperCase() : ""
        })
      });

      if (!res.ok) {
        throw new Error("Failed to initialize transaction order.");
      }

      const orderData = await res.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Order creation failed.");
      }

      // Check if this is a free/zero-payment checkout
      if (orderData.isFree) {
        const mockPaymentId = `pay_free_${Math.random().toString(36).substring(7)}`;
        
        const verifyRes = await fetch("/api/payments/verify-signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: orderData.orderId,
            razorpayPaymentId: mockPaymentId,
            razorpaySignature: "free_checkout_verified",
            draftRegId: draftRegId,
            formData: formData,
            couponCode: isCouponApplied ? couponCode.trim().toUpperCase() : null
          })
        });

        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          throw new Error(verifyData.error || "Free checkout registration failed.");
        }

        const formattedMobile = `+91${formData.mobile_number}`;
        const formattedWhatsapp = `+91${formData.whatsapp_number}`;

        const savedData = {
          ...formData,
          registrationId: verifyData.cntsId || verifyData.registrationId || draftRegId,
          cnts_id: verifyData.cntsId,
          mobile_number: formattedMobile,
          whatsapp_number: formattedWhatsapp,
          payment_id: mockPaymentId,
          payment_status: "PAID",
          registration_status: "REGISTERED",
          mobile_verified: true,
          finalPrice: finalPrice,
          couponCode: isCouponApplied ? couponCode.trim().toUpperCase() : null
        };

        sessionStorage.setItem("cnts_last_registration", JSON.stringify(savedData));
        sessionStorage.removeItem("cnts_registration_form");
        sessionStorage.removeItem("cnts_registration_step");
        sessionStorage.removeItem("cnts_draft_registration_id");
        router.push(`/register/success?id=${verifyData.cntsId || verifyData.registrationId || draftRegId}`);
        setIsSubmitting(false);
        return;
      }

      // 2. Check if order is in Sandbox mode
      if (orderData.isSandbox) {
        setSandboxOrderDetails(orderData);
        setShowSandboxModal(true);
        setIsSubmitting(false);
        return;
      }

      // 3. Live mode: Load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay payment SDK. Please check your internet connection.");
      }

      // 4. Initialize Razorpay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Courage National Talent Search",
        description: "CNTS 2026 Founding Edition Registration",
        image: "/images/logo.png",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          setIsSubmitting(true);
          try {
            // Verify signature
            const verifyRes = await fetch("/api/payments/verify-signature", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                draftRegId: draftRegId,
                formData: formData,
                couponCode: isCouponApplied ? couponCode.trim().toUpperCase() : null
              }),
            });
            
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              throw new Error("Payment signature verification failed.");
            }

            const formattedMobile = `+91${formData.mobile_number}`;
            const formattedWhatsapp = `+91${formData.whatsapp_number}`;

            const savedData = {
              ...formData,
              registrationId: verifyData.cntsId || verifyData.registrationId || draftRegId,
              cnts_id: verifyData.cntsId,
              mobile_number: formattedMobile,
              whatsapp_number: formattedWhatsapp,
              payment_id: response.razorpay_payment_id,
              payment_status: "PAID",
              registration_status: "REGISTERED",
              mobile_verified: true,
              finalPrice: finalPrice,
              couponCode: isCouponApplied ? couponCode.trim().toUpperCase() : null
            };

            sessionStorage.setItem("cnts_last_registration", JSON.stringify(savedData));
            sessionStorage.removeItem("cnts_registration_form");
            sessionStorage.removeItem("cnts_registration_step");
            sessionStorage.removeItem("cnts_draft_registration_id");
            router.push(`/register/success?id=${verifyData.cntsId || verifyData.registrationId || draftRegId}`);
          } catch (err: any) {
            console.error("Signature verification / DB save failed:", err);
            setSubmitError(err.message || "Failed to finalize registration. Please contact support.");
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.parentName,
          email: formData.parentEmail,
          contact: formData.whatsapp_number,
        },
        theme: {
          color: "#1e40af", // blue-800
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            setSubmitError("Payment was cancelled. You can try again.");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment setup error:", err);
      setSubmitError(err.message || "Failed to initialize payment gateway. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Sandbox simulation actions
  const handleSandboxSuccess = async () => {
    setShowSandboxModal(false);
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const mockPaymentId = `pay_mock_${Math.random().toString(36).substring(7)}`;
      
      const verifyRes = await fetch("/api/payments/verify-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: sandboxOrderDetails.orderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: "mock_signature_verified",
          draftRegId: draftRegId,
          formData: formData,
          couponCode: isCouponApplied ? couponCode.trim().toUpperCase() : null
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new Error("Mock signature verification failed.");
      }

      const formattedMobile = `+91${formData.mobile_number}`;
      const formattedWhatsapp = `+91${formData.whatsapp_number}`;

      const savedData = {
        ...formData,
        registrationId: verifyData.cntsId || verifyData.registrationId || draftRegId,
        cnts_id: verifyData.cntsId,
        mobile_number: formattedMobile,
        whatsapp_number: formattedWhatsapp,
        payment_id: mockPaymentId,
        payment_status: "PAID",
        registration_status: "REGISTERED",
        mobile_verified: true,
        finalPrice: finalPrice,
        couponCode: isCouponApplied ? couponCode.trim().toUpperCase() : null
      };

      sessionStorage.setItem("cnts_last_registration", JSON.stringify(savedData));
      sessionStorage.removeItem("cnts_registration_form");
      sessionStorage.removeItem("cnts_registration_step");
      sessionStorage.removeItem("cnts_draft_registration_id");
      router.push(`/register/success?id=${verifyData.cntsId || verifyData.registrationId || draftRegId}`);
    } catch (err: any) {
      console.error("Sandbox simulation save failed:", err);
      setSubmitError(err.message || "Sandbox registration save failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSandboxFailure = () => {
    setShowSandboxModal(false);
    setSubmitError("Sandbox Transaction Cancelled or Failed.");
  };

  // Prevent rendering before hydration to avoid hydration mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col">
      <div className="flex flex-col md:flex-row flex-1">
      
      {/* Submitting Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-6 text-center space-y-4 animate-scale-in">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800">Initializing Payment</h3>
              <p className="text-xs text-slate-400">Loading secure checkout gateway. Do not refresh or go back...</p>
            </div>
          </div>
        </div>
      )}

      {/* Sandbox Simulated Modal */}
      {showSandboxModal && sandboxOrderDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col max-w-md w-full mx-6 relative animate-scale-in border border-amber-200">
            <div className="absolute top-4 right-4">
              <button onClick={handleSandboxFailure} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-amber-600 mb-4 bg-amber-50 border border-amber-100 p-2.5 rounded-2xl">
              <Sparkles size={18} className="shrink-0" />
              <div className="text-[11px] font-bold uppercase tracking-wide">Razorpay Sandbox Gateway</div>
            </div>

            <h3 className="font-display font-bold text-lg text-slate-900">Simulate Payment</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              You are running in developer Sandbox mode. Choose payment outcome to test integration.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono font-bold text-slate-800">{sandboxOrderDetails.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Student:</span>
                <span className="font-semibold text-slate-800">{formData.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold text-slate-900">₹{finalPrice}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSandboxSuccess}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle size={14} />
                Simulate Successful Payment (₹{finalPrice})
              </button>
              <button
                onClick={handleSandboxFailure}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <X size={14} />
                Simulate Payment Failure / Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left panel: Info & Desktop Progress */}
      <section className="relative w-full md:w-[380px] lg:w-[450px] bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 md:p-12 flex flex-col justify-between shrink-0 md:min-h-screen overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative space-y-12">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative w-9 h-9">
              <Image
                src="/images/logo.png"
                alt="CNTS Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="font-display font-bold text-[15px] leading-tight tracking-tight text-white">
                CNTS
              </div>
              <div className="text-[10px] text-slate-400 leading-tight font-medium tracking-wide uppercase">
                Founding Edition 2026
              </div>
            </div>
          </Link>

          {/* Tagline */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
              <Sparkles size={11} className="text-amber-400" />
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                Talent Discovery Platform
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl lg:text-3xl leading-tight">
              Uncover your child&apos;s <span className="text-blue-400">hidden genius</span>.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join parents across India discovering true potential. This registration is the first step toward building a lifelong talent profile.
            </p>
          </div>

          {/* Desktop Steps Indicator */}
          <div className="hidden md:block space-y-6 pt-6">
            {[
              { step: 1, label: "Student Details", desc: "Name, class, and school information" },
              { step: 2, label: "Parent Details", desc: "Contact name, WhatsApp, and email" },
              { step: 3, label: "Preferences & Insights", desc: "Location, language, and validation" }
            ].map((s) => {
              const isCompleted = s.step < currentStep;
              const isActive = s.step === currentStep;
              return (
                <div key={s.step} className="flex gap-4 items-start">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all shrink-0 mt-0.5 border ${
                      isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : isActive
                        ? "bg-white border-white text-slate-900 shadow-md shadow-white/10"
                        : "bg-white/5 border-white/10 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check size={14} className="stroke-[3]" /> : s.step}
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-semibold transition-colors ${
                        isActive ? "text-white" : "text-slate-350"
                      }`}
                    >
                      {s.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative pt-8 md:pt-0 text-[10px] text-slate-500 space-y-1">
          <p>© 2026 Courage Education Pvt. Ltd.</p>
          <p>Secure 256-bit encrypted SSL checkout.</p>
        </div>
      </section>

      {/* Right panel: The Form (3 Steps) */}
      <section className="flex-1 px-6 py-12 md:p-12 lg:p-16 flex flex-col justify-center max-w-4xl mx-auto w-full">
        <div className="w-full max-w-2xl mx-auto">
          
          {/* Form Steps Tracker Banner */}
          <div className="mb-8 p-4 bg-white border border-slate-150 rounded-2xl shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-800">
                  Step {currentStep} of 3
                </span>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">
                  Takes less than 2 minutes
                </span>
              </div>
              <div className="flex items-center">
                {showDraftSaved ? (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
                    ✓ Draft Saved
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-450">
                    Autosave Active
                  </span>
                )}
              </div>
            </div>
            
            {/* Visual indicator (●────○────○) */}
            <div className="flex items-center justify-between px-2 w-full">
              {[1, 2, 3].map((step) => {
                const isCompleted = step < currentStep;
                const isActive = step === currentStep;
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    {/* Circle Node */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all border ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-400 text-white"
                          : isActive
                          ? "bg-blue-800 border-blue-850 text-white"
                          : "bg-white border-slate-200 text-slate-400"
                      }`}
                    >
                      {step}
                    </div>
                    {/* Connector line */}
                    {step < 3 && (
                      <div className="flex-1 mx-2 h-0.5 relative bg-slate-200">
                        <div
                          className={`absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-350 ${
                            isCompleted ? "w-full" : "w-0"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-xs text-red-800 animate-slide-up">
                <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={16} />
                <div className="space-y-1">
                  <span className="font-bold">Registration Error</span>
                  <p className="leading-relaxed font-semibold">{submitError}</p>
                </div>
              </div>
            )}

            {/* Step 1: Student Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-slide-up">
                <div className="space-y-1">
                  <h2 className="font-display font-bold text-2xl text-slate-900">
                    Student Information
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Enter the participant&apos;s educational profile details.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Candidate Passport Photo */}
                  <PhotoUploader
                    photoBase64={formData.photo_base64}
                    onPhotoSelected={(base64) => {
                      handleInputChange("photo_base64", base64);
                      if (errors.photo_base64) {
                        setErrors(prev => ({ ...prev, photo_base64: "" }));
                      }
                    }}
                    error={touched.photo_base64 ? errors.photo_base64 : undefined}
                  />

                  {/* Student Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="studentName" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <User size={13} className="text-slate-400" />
                      Student Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="studentName"
                      value={formData.studentName}
                      onChange={(e) => handleInputChange("studentName", e.target.value)}
                      onBlur={() => handleBlur("studentName")}
                      placeholder="e.g. Aditya Verma"
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm outline-none transition-all duration-200 ${
                        touched.studentName && errors.studentName
                          ? "border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                      }`}
                      aria-invalid={touched.studentName && !!errors.studentName}
                      aria-describedby={errors.studentName ? "studentName-error" : undefined}
                    />
                    {touched.studentName && errors.studentName && (
                      <p id="studentName-error" className="text-xs text-red-500 font-medium">
                        {errors.studentName}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1.5">
                    <label htmlFor="dob" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Calendar size={13} className="text-slate-400" />
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dob"
                      value={formData.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                      onBlur={() => handleBlur("dob")}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm outline-none transition-all duration-200 ${
                        touched.dob && errors.dob
                          ? "border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                      }`}
                      aria-invalid={touched.dob && !!errors.dob}
                      aria-describedby={errors.dob ? "dob-error" : undefined}
                    />
                    {touched.dob && errors.dob && (
                      <p id="dob-error" className="text-xs text-red-500 font-medium">
                        {errors.dob}
                      </p>
                    )}
                  </div>

                  {/* Class Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Trophy size={13} className="text-slate-400" />
                      Class / Grade <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {["5", "6", "7", "8"].map((cls) => {
                        const isSelected = formData.studentClass === cls;
                        return (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => handleInputChange("studentClass", cls)}
                            className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center transition-all duration-200 ${
                              isSelected
                                ? "border-blue-800 bg-blue-50 text-blue-800 ring-2 ring-blue-800/20"
                                : "border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50/50"
                            }`}
                          >
                            Class {cls}
                          </button>
                        );
                      })}
                    </div>
                    {touched.studentClass && errors.studentClass && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.studentClass}
                      </p>
                    )}

                    {formData.studentClass && (
                      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl mt-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-800 animate-pulse shrink-0"></div>
                        <span className="text-[11px] text-blue-900 font-semibold leading-relaxed">
                          Syllabus: <strong>
                            {parseInt(formData.studentClass) <= 6
                              ? "Sub-Junior Talent Category (Class 5–6)"
                              : "Junior Talent Category (Class 7–8)"}
                          </strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* School Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="schoolName" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <School size={13} className="text-slate-400" />
                      School Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="schoolName"
                      value={formData.schoolName}
                      onChange={(e) => handleInputChange("schoolName", e.target.value)}
                      onBlur={() => handleBlur("schoolName")}
                      placeholder="e.g. Delhi Public School"
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm outline-none transition-all duration-200 ${
                        touched.schoolName && errors.schoolName
                          ? "border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                      }`}
                      aria-invalid={touched.schoolName && !!errors.schoolName}
                      aria-describedby={errors.schoolName ? "schoolName-error" : undefined}
                    />
                    {touched.schoolName && errors.schoolName && (
                      <p id="schoolName-error" className="text-xs text-red-500 font-medium">
                        {errors.schoolName}
                      </p>
                    )}
                  </div>

                  {/* School City and Code Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* School City */}
                    <div className="space-y-1.5">
                      <label htmlFor="schoolCity" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Building size={13} className="text-slate-400" />
                        School City / Town <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="schoolCity"
                        value={formData.schoolCity}
                        onChange={(e) => handleInputChange("schoolCity", e.target.value)}
                        onBlur={() => handleBlur("schoolCity")}
                        placeholder="e.g. Kanpur"
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm outline-none transition-all duration-200 ${
                          touched.schoolCity && errors.schoolCity
                            ? "border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                        }`}
                        aria-invalid={touched.schoolCity && !!errors.schoolCity}
                      />
                      {touched.schoolCity && errors.schoolCity && (
                        <p className="text-xs text-red-500 font-medium">{errors.schoolCity}</p>
                      )}
                    </div>

                    {/* School Code (Optional) */}
                    <div className="space-y-1.5">
                      <label htmlFor="schoolCode" className="text-xs font-semibold text-slate-755 flex items-center gap-1">
                        <Building size={13} className="text-slate-450" />
                        School Invite Code <span className="text-slate-400 font-medium">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="schoolCode"
                        value={formData.schoolCode}
                        onChange={(e) => handleInputChange("schoolCode", e.target.value.toUpperCase())}
                        placeholder="e.g. SCH-512"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-blue-850 focus:bg-white focus:ring-4 focus:ring-blue-850/10 transition-all duration-200"
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Step 2: Parent Information */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-slide-up">
                <div className="space-y-1">
                  <h2 className="font-display font-bold text-2xl text-slate-900">
                    Parent Contact Details
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Provide the primary contact information. CNTS notifications will be sent to the WhatsApp number provided.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Parent Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="parentName" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <User size={13} className="text-slate-400" />
                      Parent/Guardian Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="parentName"
                      value={formData.parentName}
                      onChange={(e) => handleInputChange("parentName", e.target.value)}
                      onBlur={() => handleBlur("parentName")}
                      placeholder="e.g. Sanjay Verma"
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm outline-none transition-all duration-200 ${
                        touched.parentName && errors.parentName
                          ? "border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                      }`}
                      aria-invalid={touched.parentName && !!errors.parentName}
                      aria-describedby={errors.parentName ? "parentName-error" : undefined}
                    />
                    {touched.parentName && errors.parentName && (
                      <p id="parentName-error" className="text-xs text-red-500 font-medium">
                        {errors.parentName}
                      </p>
                    )}
                  </div>

                  {/* Primary Mobile Number */}
                  <div className="space-y-1.5">
                    <label htmlFor="mobile_number" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Phone size={13} className="text-slate-400" />
                      Primary Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        +91
                      </div>
                      <input
                        type="tel"
                        id="mobile_number"
                        value={formData.mobile_number}
                        onChange={(e) => handleInputChange("mobile_number", e.target.value.replace(/\D/g, "").slice(0, 10))}
                        onBlur={() => handleBlur("mobile_number")}
                        placeholder="9876543210"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50/50 text-sm outline-none transition-all duration-200 ${
                          touched.mobile_number && errors.mobile_number
                            ? "border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                        }`}
                        maxLength={10}
                      />
                    </div>
                    {touched.mobile_number && errors.mobile_number && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.mobile_number}
                      </p>
                    )}
                  </div>

                  {/* WhatsApp Same As Mobile Checkbox */}
                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="whatsappSameAsMobile"
                      checked={whatsappSameAsMobile}
                      onChange={(e) => handleSameAsCheckboxChange(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-850 border-slate-300 focus:ring-blue-850 cursor-pointer"
                    />
                    <label htmlFor="whatsappSameAsMobile" className="text-xs font-semibold text-slate-605 cursor-pointer select-none">
                      WhatsApp number is same as mobile number
                    </label>
                  </div>

                  {/* WhatsApp Number (conditionally shown if different) */}
                  {!whatsappSameAsMobile && (
                    <div className="space-y-1.5 animate-slide-up">
                      <label htmlFor="whatsapp_number" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Phone size={13} className="text-slate-400" />
                        WhatsApp Number (for Notifications) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                          +91
                        </div>
                        <input
                          type="tel"
                          id="whatsapp_number"
                          value={formData.whatsapp_number}
                          onChange={(e) => handleInputChange("whatsapp_number", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          onBlur={() => handleBlur("whatsapp_number")}
                          placeholder="9876543210"
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50/50 text-sm outline-none transition-all duration-200 ${
                            touched.whatsapp_number && errors.whatsapp_number
                              ? "border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                              : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                          }`}
                          maxLength={10}
                        />
                      </div>
                      {touched.whatsapp_number && errors.whatsapp_number && (
                        <p className="text-xs text-red-500 font-medium">
                          {errors.whatsapp_number}
                        </p>
                      )}
                    </div>
                    )}

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label htmlFor="parentEmail" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Mail size={13} className="text-slate-400" />
                      Email Address <span className="text-blue-700 font-semibold">(Recommended: Helps recover dashboard access)</span>
                    </label>
                    <input
                      type="email"
                      id="parentEmail"
                      value={formData.parentEmail}
                      onChange={(e) => handleInputChange("parentEmail", e.target.value)}
                      onBlur={() => handleBlur("parentEmail")}
                      placeholder="parent@example.com"
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm outline-none transition-all duration-200 ${
                        touched.parentEmail && errors.parentEmail
                          ? "border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                      }`}
                      aria-invalid={touched.parentEmail && !!errors.parentEmail}
                      aria-describedby={errors.parentEmail ? "parentEmail-error" : undefined}
                    />
                    {touched.parentEmail && errors.parentEmail && (
                      <p id="parentEmail-error" className="text-xs text-red-500 font-medium">
                        {errors.parentEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Preferences & Insights */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-slide-up">
                <div className="space-y-1">
                  <h2 className="font-display font-bold text-2xl text-slate-900">
                    Preferences & Insights
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Select your testing preferences and let us know why you are participating.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* State selection */}
                  <div className="space-y-1.5">
                    <label htmlFor="state" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" />
                      State / UT <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        onBlur={() => handleBlur("state")}
                        className={`w-full px-4 py-3 pr-10 rounded-xl border bg-slate-50/50 text-sm outline-none appearance-none transition-all duration-200 ${
                          touched.state && errors.state
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                        }`}
                        aria-invalid={touched.state && !!errors.state}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-550">
                        ▼
                      </div>
                    </div>
                    {touched.state && errors.state && (
                      <p className="text-xs text-red-500 font-medium">{errors.state}</p>
                    )}
                  </div>

                  {/* District selection */}
                  <div className="space-y-1.5">
                    <label htmlFor="district" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <MapPin size={13} className="text-slate-400" />
                      District <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="district"
                        value={formData.district}
                        onChange={(e) => handleInputChange("district", e.target.value)}
                        onBlur={() => handleBlur("district")}
                        disabled={!formData.state}
                        className={`w-full px-4 py-3 pr-10 rounded-xl border bg-slate-50/50 text-sm outline-none appearance-none transition-all duration-200 ${
                          !formData.state ? "opacity-60 cursor-not-allowed" : ""
                        } ${
                          touched.district && errors.district
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                        }`}
                        aria-invalid={touched.district && !!errors.district}
                      >
                        <option value="">
                          {!formData.state ? "Select State First" : "Select District"}
                        </option>
                        {formData.state &&
                          STATE_DISTRICTS[formData.state]?.map((dst) => (
                            <option key={dst} value={dst}>
                              {dst}
                            </option>
                          ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-550">
                        ▼
                      </div>
                    </div>
                    {touched.district && errors.district && (
                      <p className="text-xs text-red-500 font-medium">{errors.district}</p>
                    )}
                  </div>

                  {/* Preferred Language */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Languages size={13} className="text-slate-400" />
                      Preferred Exam Language <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { code: "English", label: "English" },
                        { code: "Hindi", label: "हिन्दी (Hindi)" }
                      ].map((lang) => {
                        const isSelected = formData.language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleInputChange("language", lang.code as "English"|"Hindi")}
                            className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                              isSelected
                                ? "border-blue-800 bg-blue-50/50 text-blue-800 ring-2 ring-blue-800/20"
                                : "border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50/50"
                            }`}
                          >
                            {isSelected && <Check size={14} className="text-blue-800" />}
                            {lang.label}
                          </button>
                        );
                      })}
                    </div>
                    {touched.language && errors.language && (
                      <p className="text-xs text-red-500 font-medium">{errors.language}</p>
                    )}
                  </div>

                  {/* Why Participating */}
                  <div className="space-y-1.5">
                    <label htmlFor="whyParticipating" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <HelpCircle size={13} className="text-slate-400" />
                      Why are you participating? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="whyParticipating"
                        value={formData.whyParticipating}
                        onChange={(e) => handleInputChange("whyParticipating", e.target.value)}
                        onBlur={() => handleBlur("whyParticipating")}
                        className={`w-full px-4 py-3 pr-10 rounded-xl border bg-slate-50/50 text-sm outline-none appearance-none transition-all duration-200 ${
                          touched.whyParticipating && errors.whyParticipating
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                        }`}
                        aria-invalid={touched.whyParticipating && !!errors.whyParticipating}
                      >
                        <option value="">Select Reason</option>
                        <option value="Talent Discovery">Talent Discovery</option>
                        <option value="Scholarship Opportunities">Scholarship Opportunities</option>
                        <option value="Competitive Practice">Competitive Practice</option>
                        <option value="National Ranking">National Ranking</option>
                        <option value="Parent Recommendation">Parent Recommendation</option>
                        <option value="School Recommendation">School Recommendation</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-550">
                        ▼
                      </div>
                    </div>
                    {touched.whyParticipating && errors.whyParticipating && (
                      <p className="text-xs text-red-500 font-medium">{errors.whyParticipating}</p>
                    )}
                  </div>

                  {/* How did you hear */}
                  <div className="space-y-1.5">
                    <label htmlFor="howHeard" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Eye size={13} className="text-slate-400" />
                      How did you hear about CNTS? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="howHeard"
                        value={formData.howHeard}
                        onChange={(e) => handleInputChange("howHeard", e.target.value)}
                        onBlur={() => handleBlur("howHeard")}
                        className={`w-full px-4 py-3 pr-10 rounded-xl border bg-slate-50/50 text-sm outline-none appearance-none transition-all duration-200 ${
                          touched.howHeard && errors.howHeard
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                        }`}
                        aria-invalid={touched.howHeard && !!errors.howHeard}
                      >
                        <option value="">Select Option</option>
                        <option value="Instagram">Instagram</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="School">School</option>
                        <option value="Friend">Friend</option>
                        <option value="Facebook">Facebook</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-550">
                        ▼
                      </div>
                    </div>
                    {touched.howHeard && errors.howHeard && (
                      <p className="text-xs text-red-500 font-medium">{errors.howHeard}</p>
                    )}
                  </div>

                  {/* Coupon Code Section */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 mt-6 space-y-3 shadow-inner">
                    <label htmlFor="coupon" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Percent size={14} className="text-blue-700" />
                      Apply Promo / School Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="coupon"
                        placeholder="e.g. FOUNDER50"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={isCouponApplied}
                        className={`flex-1 px-4 py-2 border rounded-xl text-xs outline-none uppercase font-semibold font-mono ${
                          isCouponApplied 
                            ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                            : "bg-slate-50/50 border-slate-200 focus:border-blue-800 focus:bg-white"
                        }`}
                      />
                      {isCouponApplied ? (
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={applyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className={`px-4 py-2 bg-blue-800 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer ${
                            couponLoading || !couponCode.trim() ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        >
                          {couponLoading ? "Applying..." : "Apply"}
                        </button>
                      )}
                    </div>
                    {couponError && <p className="text-[10px] text-red-500 font-bold">{couponError}</p>}
                    {couponSuccess && <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">✓ {couponSuccess}</p>}
                  </div>

                  {/* Parent Consent Checkbox */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50/30 border border-blue-100/50 rounded-2xl mt-4">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={parentConsent}
                      onChange={(e) => setParentConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-blue-800 focus:ring-blue-850 cursor-pointer"
                    />
                    <label htmlFor="consent" className="text-[11px] font-semibold text-slate-600 leading-relaxed cursor-pointer select-none">
                      I hereby consent to register my child for Courage National Talent Search (CNTS) 2026. I agree to the <Link href="/terms" target="_blank" className="text-blue-800 hover:underline">Terms of Use</Link> and <Link href="/privacy" target="_blank" className="text-blue-800 hover:underline">Privacy Policy</Link>.
                    </label>
                  </div>

                  {/* Registration Fee Block */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between mt-6 text-white shadow-lg shadow-slate-900/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                      Total Payable Amount
                    </span>
                    <div className="flex items-center gap-2.5">
                      {isCouponApplied && (
                        <span className="text-xs text-slate-500 line-through">₹99</span>
                      )}
                      <span className="text-xl font-bold text-amber-400">₹{finalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center gap-2 px-5 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              ) : (
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </Link>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-white rounded-xl text-sm font-bold shadow-lg bg-blue-800 hover:bg-blue-700 shadow-blue-800/10 hover:shadow-blue-700/20 cursor-pointer transition-all duration-200"
                >
                  Next Step
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!parentConsent}
                  className={`inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-xl text-sm font-bold shadow-lg transition-all duration-200 ${
                    parentConsent 
                      ? "bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/20 cursor-pointer" 
                      : "bg-slate-300 shadow-none cursor-not-allowed opacity-60"
                  }`}
                >
                  <CreditCard size={15} />
                  Pay ₹{finalPrice} & Register
                </button>
              )}
            </div>
            
          </form>
        </div>
      </section>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
