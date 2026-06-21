"use client";

import { useState } from "react";
import { School, Users, FileSpreadsheet, Download, Copy, Check, Upload, ArrowUpRight, Plus, UserPlus, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from "lucide-react";
import * as XLSX from 'xlsx';

export default function SchoolDashboardClient({ school, registrations }: { school: any, registrations: any[] }) {
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Quota & Roster state (reactive update)
  const [usedQuota, setUsedQuota] = useState(school.used_quota);
  const [studentList, setStudentList] = useState(registrations);

  // Form State
  const [showAddForm, setShowAddForm] = useState(true);
  const [keepFormOpen, setKeepFormOpen] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [parentMobile, setParentMobile] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [gender, setGender] = useState("");

  const [registering, setRegistering] = useState(false);
  const [formError, setFormError] = useState("");
  const [successState, setSuccessState] = useState<{ registrationId: string; name: string } | null>(null);

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?school=${school.school_code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyIdToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(studentList.map(r => ({
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

  const downloadTemplate = () => {
    // Create first sheet (Students)
    const wsStudents = XLSX.utils.json_to_sheet([], {
      header: ["Student Name", "Class", "Mobile Number"]
    });
    
    // Set column widths for Students sheet (wch is width in characters)
    wsStudents['!cols'] = [
      { wch: 30 }, // Student Name
      { wch: 12 }, // Class
      { wch: 20 }  // Mobile Number
    ];
    
    // Create second sheet (Instructions)
    const instructions = [
      { "Instruction / Guideline": "1. Fill in student details in the first tab named 'Students'." },
      { "Instruction / Guideline": "2. Do not rename the column headers ('Student Name', 'Class', 'Mobile Number')." },
      { "Instruction / Guideline": "3. The Class column only accepts values between 5 and 12." },
      { "Instruction / Guideline": "4. Mobile Number must be a valid 10-digit number." },
      { "Instruction / Guideline": `5. This template is personalized for: ${school.name}` },
      { "Instruction / Guideline": `6. Personalized School Code: ${school.school_code}` },
      { "Instruction / Guideline": `7. Your remaining quota capacity is: ${school.quota - usedQuota} seats.` }
    ];
    const wsInstructions = XLSX.utils.json_to_sheet(instructions);
    
    // Set column width for Instructions sheet
    wsInstructions['!cols'] = [
      { wch: 90 }  // Instruction / Guideline
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsStudents, "Students");
    XLSX.utils.book_append_sheet(wb, wsInstructions, "Read Me Instructions");
    
    const sanitizedSchoolName = school.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `cnts_template_${sanitizedSchoolName}_${school.school_code}.xlsx`;
    XLSX.writeFile(wb, filename);
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
        // Optimistically reload registrations
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

  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessState(null);

    if (!studentName.trim()) {
      setFormError("Please enter the student name.");
      return;
    }
    if (!studentClass) {
      setFormError("Please select a class.");
      return;
    }
    if (parentMobile.length !== 10 || !/^\d+$/.test(parentMobile)) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setRegistering(true);
    try {
      const res = await fetch("/api/schools/register-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName.trim(),
          studentClass,
          mobileNumber: parentMobile,
          parentEmail: parentEmail.trim(),
          gender
        })
      });
      const data = await res.json();

      if (data.success) {
        // Update local quota count
        const newUsedQuota = usedQuota + 1;
        setUsedQuota(newUsedQuota);

        // Prepend new student object to the list state
        const newReg = {
          registration_id: data.registrationId,
          student_name: studentName.trim(),
          student_class: studentClass,
          registration_status: "REGISTERED",
          created_at: new Date().toISOString()
        };
        setStudentList(prev => [newReg, ...prev]);

        // Transition to success card inside the form area
        setSuccessState({ registrationId: data.registrationId, name: studentName.trim() });

        // Reset inputs
        setStudentName("");
        setStudentClass("");
        setParentMobile("");
        setParentEmail("");
        setGender("");
      } else {
        setFormError(data.message || "Failed to register student.");
      }
    } catch (err) {
      setFormError("Network error. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const remainingQuota = school.quota - usedQuota;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shadow-inner">
              <School size={32} className="text-blue-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{school.name}</h1>
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
              <p className="text-2xl font-bold text-blue-700">{remainingQuota}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: + Add Student Form (Col Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div 
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="text-blue-600" size={22} />
                  <h2 className="font-bold text-lg text-slate-900">Add Student</h2>
                </div>
                {showAddForm ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </div>

              {showAddForm && (
                <div className="p-6 md:p-8">
                  {successState ? (
                    /* SUCCESS STATE */
                    <div className="space-y-6 text-center max-w-md mx-auto py-4 animate-slide-up">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                        <CheckCircle size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Student Registered Successfully</h3>
                        <p className="text-sm text-slate-500 mt-1">Credentials have been generated for <strong>{successState.name}</strong>.</p>
                      </div>

                      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 text-left space-y-1.5 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Candidate ID</span>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-base font-bold text-slate-700 font-mono shadow-sm">
                            {successState.registrationId}
                          </code>
                          <button 
                            type="button" 
                            onClick={() => copyIdToClipboard(successState.registrationId)} 
                            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
                            title="Copy Candidate ID"
                          >
                            {copiedId === successState.registrationId ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} className="text-slate-500" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-center pt-2">
                        <button 
                          type="button"
                          onClick={() => {
                            setSuccessState(null);
                            if (!keepFormOpen) {
                              setShowAddForm(false);
                            }
                          }}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
                        >
                          Add Another Student
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setSuccessState(null);
                            setShowAddForm(false);
                          }}
                          className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded-xl transition-all text-sm shadow-sm"
                        >
                          Close Form
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* FORM VIEW */
                    <form onSubmit={handleAddStudentSubmit} className="space-y-6">
                      
                      <div className="flex justify-between items-center bg-blue-50/50 px-4 py-3 rounded-2xl border border-blue-100/50">
                        <span className="text-xs font-semibold text-blue-800">Remaining seat capacity:</span>
                        <span className="text-sm font-bold text-blue-900">{remainingQuota} / {school.quota}</span>
                      </div>

                      {formError && (
                        <div className="p-4 bg-red-50 text-red-650 text-xs font-semibold rounded-2xl border border-red-100 flex items-start gap-2">
                          <AlertCircle size={16} className="shrink-0 mt-0.5" />
                          {formError}
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* Student Name */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Student Name *</label>
                          <input 
                            required 
                            type="text"
                            value={studentName}
                            onChange={e => setStudentName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner"
                            disabled={registering || remainingQuota <= 0}
                          />
                        </div>

                        {/* Class & Mobile Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Class *</label>
                            <select 
                              required 
                              value={studentClass}
                              onChange={e => setStudentClass(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm appearance-none cursor-pointer"
                              disabled={registering || remainingQuota <= 0}
                            >
                              <option value="">Select Class</option>
                              {[5, 6, 7, 8, 9, 10, 11, 12].map(c => (
                                <option key={c} value={String(c)}>Class {c}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Parent Mobile Number *</label>
                            <input 
                              required 
                              type="tel"
                              value={parentMobile}
                              onChange={e => setParentMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                              placeholder="10-digit number"
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner"
                              maxLength={10}
                              disabled={registering || remainingQuota <= 0}
                            />
                          </div>
                        </div>

                        {/* Email & Gender (Optional Grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Parent Email (Optional)</label>
                            <input 
                              type="email"
                              value={parentEmail}
                              onChange={e => setParentEmail(e.target.value)}
                              placeholder="parent@example.com"
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm shadow-inner"
                              disabled={registering || remainingQuota <= 0}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Student Gender (Optional)</label>
                            <select 
                              value={gender}
                              onChange={e => setGender(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm appearance-none cursor-pointer"
                              disabled={registering || remainingQuota <= 0}
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-600">
                          <input 
                            type="checkbox"
                            checked={keepFormOpen}
                            onChange={e => setKeepFormOpen(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-slate-350 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          Keep form open after save (Quick Add Mode)
                        </label>
                        
                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => setShowAddForm(false)} 
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all shadow-sm"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit"
                            disabled={registering || remainingQuota <= 0}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                          >
                            {registering ? "Registering..." : <><Plus size={14} /> Register Student</>}
                          </button>
                        </div>
                      </div>

                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Other Utilities */}
          <div className="space-y-6">
            
            {/* Share Registration Link Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shadow-inner">
                <ArrowUpRight size={24} className="text-emerald-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Share Registration Link</h3>
                <p className="text-xs text-slate-500 mt-1">Copy the referral link to share with parents, automatically applying your school code.</p>
              </div>
              
              <button 
                onClick={copyToClipboard}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all text-slate-700 shadow-sm"
              >
                {copied ? <><Check size={14} className="text-emerald-600"/> Link Copied!</> : <><Copy size={14}/> Copy Invite Link</>}
              </button>
            </div>

            {/* Bulk Excel Upload Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-inner">
                <Upload size={24} className="text-purple-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Bulk Excel Upload</h3>
                <p className="text-xs text-slate-500 mt-1">Register all candidates at once by importing a student spreadsheet.</p>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    onChange={handleFileUpload}
                    disabled={uploading || remainingQuota <= 0}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <button 
                    disabled={uploading || remainingQuota <= 0}
                    className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    {uploading ? "Uploading..." : <><FileSpreadsheet size={14}/> Upload Spreadsheet</>}
                  </button>
                </div>
                <button 
                  onClick={downloadTemplate}
                  className="w-full py-2 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-purple-100/50 shadow-sm"
                >
                  <Download size={14} /> Download Template
                </button>
              </div>
              {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
            </div>

            {/* Export Students Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shadow-inner">
                <Download size={24} className="text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Export Students</h3>
                <p className="text-xs text-slate-500 mt-1">Download a `.xlsx` Excel sheet of all registered candidates under your school code.</p>
              </div>
              
              <button 
                onClick={exportToExcel}
                disabled={studentList.length === 0}
                className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 disabled:opacity-50 text-amber-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm border border-amber-200/50"
              >
                <Download size={14}/> Export Excel
              </button>
            </div>

          </div>

        </div>

        {/* Registrations List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              Registered Students Roster
            </h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              {studentList.length} Total
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-slate-100">Student Name</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Class</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Date Registered</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {studentList.length > 0 ? (
                  studentList.map((reg, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-slate-900">{reg.student_name}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{reg.registration_id}</p>
                      </td>
                      <td className="p-4">Class {reg.student_class}</td>
                      <td className="p-4 text-slate-500">
                        {new Date(reg.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {reg.registration_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                      No registrations recorded yet. Add students using the form above or share your invite link.
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
