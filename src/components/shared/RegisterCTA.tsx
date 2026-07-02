"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getTimelineDates, TIMELINE } from "@/config/timeline";

export interface RegisterCTAProps {
  className?: string;
  unauthenticatedText?: string;
  authenticatedText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
}

export function RegisterCTA({ 
  className = "", 
  unauthenticatedText = "Register Now",
  authenticatedText = "Register Another Child",
  leftIcon,
  rightIcon,
  onClick,
}: RegisterCTAProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isFoundingFamily, setIsFoundingFamily] = useState(false);
  const [countdownText, setCountdownText] = useState("");

  useEffect(() => {
    setMounted(true);
    const dates = getTimelineDates();
    setIsRegistrationOpen(new Date() >= dates.registrationOpen);

    // Check if user is a registered Founding Family
    const saved = localStorage.getItem("cnts_founding_family_data");
    if (saved) {
      setIsFoundingFamily(true);
    }

    const checkAuth = async () => {
      try {
        const { authService } = await import("@/services/authService");
        const session = await authService.checkSession();
        setIsAuthenticated(session.isAuthenticated);
      } catch (e) {
        // silently ignore error
      }
    };
    checkAuth();
  }, []);

  // Countdown timer for the button if Founding Family is registered and registration is not open yet
  useEffect(() => {
    if (!mounted || isRegistrationOpen || !isFoundingFamily) return;

    const target = new Date(`${TIMELINE.REGISTRATION_OPEN}T10:00:00`).getTime();
    const updateCountdown = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setCountdownText("");
        setIsRegistrationOpen(true);
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (d > 0) {
        setCountdownText(`${d}d ${h}h`);
      } else {
        setCountdownText(`${h}h ${m}m ${s}s`);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [mounted, isRegistrationOpen, isFoundingFamily]);

  const defaultClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md shadow-blue-800/20";
  const appliedClasses = className || defaultClasses;

  let currentText = unauthenticatedText;
  let targetHref = "/register";

  if (mounted) {
    if (isAuthenticated) {
      currentText = authenticatedText;
      targetHref = "/register";
    } else {
      if (isRegistrationOpen) {
        if (isFoundingFamily) {
          currentText = "Use Founding Pass to Register";
        } else {
          currentText = unauthenticatedText;
        }
        targetHref = "/register";
      } else {
        if (isFoundingFamily) {
          currentText = `Founding Pass Active • Opens in ${countdownText || "July 15"}`;
        } else {
          currentText = "Become a Founding Family";
        }
        targetHref = "/founding-families";
      }
    }
  }

  return (
    <Link href={targetHref} className={appliedClasses} onClick={onClick}>
      {leftIcon}
      {currentText}
      {rightIcon}
    </Link>
  );
}

