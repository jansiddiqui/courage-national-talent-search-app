"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface RegisterCTAProps {
  className?: string;
  unauthenticatedText?: string;
  authenticatedText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function RegisterCTA({ 
  className = "", 
  unauthenticatedText = "Register Now",
  authenticatedText = "Register Another Child",
  leftIcon,
  rightIcon,
}: RegisterCTAProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const defaultClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md shadow-blue-800/20";
  const appliedClasses = className || defaultClasses;

  const currentText = (!mounted || !isAuthenticated) ? unauthenticatedText : authenticatedText;

  return (
    <Link href="/register" className={appliedClasses}>
      {leftIcon}
      {currentText}
      {rightIcon}
    </Link>
  );
}
