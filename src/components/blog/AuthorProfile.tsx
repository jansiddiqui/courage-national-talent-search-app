import React from "react";

export default function AuthorProfile() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 my-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
      <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-200 shrink-0 flex items-center justify-center shadow-sm">
        <span className="font-display font-extrabold text-2xl text-blue-600">CL</span>
      </div>
      <div className="space-y-2">
        <h4 className="font-display font-bold text-slate-900 text-sm tracking-wide uppercase">
          About Courage Library
        </h4>
        <p className="text-slate-600 text-sm leading-relaxed">
          Courage Library is an educational initiative focused on talent discovery, assessment, mentorship, and academic development for students across India.
        </p>
      </div>
    </div>
  );
}
