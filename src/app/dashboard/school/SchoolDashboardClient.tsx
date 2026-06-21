"use client";

import { useState } from "react";
import { School, Users, FileSpreadsheet, Download, Copy, Check, Upload, ArrowUpRight } from "lucide-react";
import * as XLSX from 'xlsx';

export default function SchoolDashboardClient({ school, registrations }: { school: any, registrations: any[] }) {
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?school=${school.school_code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(registrations.map(r => ({
      "Registration ID": r.registration_id,
      "Student Name": r.student_name,
      "Class": r.student_class,
      "Status": r.registration_status,
      "Date": new Date(r.created_at).toLocaleDateString()
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, `CNTS_Registrations_${school.school_code}.xlsx`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Upload to API
      const res = await fetch("/api/schools/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          schoolCode: school.school_code,
          students: jsonData 
        })
      });

      const result = await res.json();
      if (result.success) {
        window.location.reload();
      } else {
        setUploadError(result.message || "Bulk upload failed.");
      }
    } catch (error) {
      setUploadError("Error parsing Excel file. Please ensure it follows the correct format.");
    } finally {
      setUploading(false);
      e.target.value = ''; // reset input
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <School size={32} className="text-blue-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{school.name}</h1>
              <p className="text-slate-500 font-medium">{school.city} • Code: {school.school_code}</p>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-center flex-1 md:flex-none">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Total Quota</p>
              <p className="text-2xl font-bold text-slate-900">{school.quota}</p>
            </div>
            <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 text-center flex-1 md:flex-none">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Available</p>
              <p className="text-2xl font-bold text-blue-700">{school.quota - school.used_quota}</p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Referral Link Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
              <ArrowUpRight size={24} className="text-emerald-700" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Share Link</h3>
            <p className="text-sm text-slate-500">Share this link with students to automatically apply your school's sponsorship code.</p>
            
            <button 
              onClick={copyToClipboard}
              className="w-full mt-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors text-slate-700"
            >
              {copied ? <><Check size={16} className="text-emerald-500"/> Copied!</> : <><Copy size={16}/> Copy Link</>}
            </button>
          </div>

          {/* Bulk Upload Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
              <Upload size={24} className="text-purple-700" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Bulk Upload</h3>
            <p className="text-sm text-slate-500">Upload an Excel file to register multiple students at once using your quota.</p>
            
            <div className="relative">
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileUpload}
                disabled={uploading || (school.quota - school.used_quota <= 0)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <button 
                disabled={uploading || (school.quota - school.used_quota <= 0)}
                className="w-full mt-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {uploading ? "Uploading..." : <><FileSpreadsheet size={16}/> Select Excel File</>}
              </button>
            </div>
            {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
          </div>

          {/* Export Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-2">
              <Download size={24} className="text-amber-700" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Export Data</h3>
            <p className="text-sm text-slate-500">Download a complete list of all students registered under your school code.</p>
            
            <button 
              onClick={exportToExcel}
              disabled={registrations.length === 0}
              className="w-full mt-2 py-2.5 px-4 bg-amber-100 hover:bg-amber-200 disabled:opacity-50 text-amber-800 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={16}/> Export Excel
            </button>
          </div>
        </div>

        {/* Registrations List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              Registered Students
            </h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
              {registrations.length} Total
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-slate-100">Student Name</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Class</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Date</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.length > 0 ? (
                  registrations.map((reg, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-slate-900">{reg.student_name}</p>
                        <p className="text-xs text-slate-500">{reg.registration_id}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-700">{reg.student_class}</td>
                      <td className="p-4 text-sm text-slate-500">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {reg.registration_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      No students have registered using your code yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
