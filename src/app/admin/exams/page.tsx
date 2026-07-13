"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Plus, Trash2, ShieldAlert, Award, BookOpen, Clock, Settings, Save, CheckCircle } from "lucide-react";

interface Section {
  name: string;
  questionCount: number;
  marks: number;
  negativeMarks: number;
}

interface Assessment {
  id: string;
  title: string;
  type: string;
  duration_minutes: number;
  sections: Section[];
  is_published: boolean;
  created_at: string;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  // Editor states
  const [showEditor, setShowEditor] = useState(false);
  const [examId, setExamId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("MOCK_EXAM");
  const [duration, setDuration] = useState(60);
  const [sections, setSections] = useState<Section[]>([
    { name: "Section 1", questionCount: 15, marks: 4.0, negativeMarks: 1.0 }
  ]);
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  // Question IDs list to map during publish
  const [questionBankIdsInput, setQuestionBankIdsInput] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchExams = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/exams");
      if (!res.ok) throw new Error("Failed to load assessments");
      const data = await res.json();
      setExams(data.assessments || []);
    } catch (err: any) {
      setError(err.message || "Failed to load assessments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleAddSection = () => {
    setSections([...sections, { name: `Section ${sections.length + 1}`, questionCount: 10, marks: 4.0, negativeMarks: 0.0 }]);
  };

  const handleRemoveSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleSectionChange = (idx: number, field: keyof Section, val: any) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [field]: val };
    setSections(updated);
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    
    // Parse question bank IDs if published
    const questionBankIds = questionBankIdsInput
      .split(",")
      .map(id => id.trim())
      .filter(id => id.length > 0);

    try {
      const res = await fetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: examId || undefined,
          title: title.trim(),
          type,
          duration_minutes: duration,
          sections,
          is_published: isPublished,
          questionBankIds
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Assessment saved successfully!");
        setShowEditor(false);
        setExamId("");
        setTitle("");
        setDuration(60);
        setQuestionBankIdsInput("");
        fetchExams();
      } else {
        showToast(data.message || "Failed to save assessment.");
      }
    } catch (err: any) {
      showToast(err.message || "Network error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Award className="text-blue-800" />
            Exam Builder & Assessments
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configure assessment papers, sections, and freeze questions.</p>
        </div>
        <button
          onClick={() => {
            setExamId("");
            setTitle("");
            setType("MOCK_EXAM");
            setDuration(60);
            setIsPublished(false);
            setSections([{ name: "Section 1", questionCount: 15, marks: 4.0, negativeMarks: 1.0 }]);
            setQuestionBankIdsInput("");
            setShowEditor(true);
          }}
          className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          New Assessment
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-blue-800 border border-blue-700 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-slide-up">
          <CheckCircle size={14} />
          {toast}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-sm text-red-700">
          <ShieldAlert size={16} />
          {error}
        </div>
      )}

      {showEditor ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm max-w-2xl mx-auto space-y-6">
          <h2 className="text-lg font-bold text-slate-800">{examId ? "Edit Assessment" : "Create Assessment"}</h2>
          <form onSubmit={handleSaveExam} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Exam Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., CNTS 2026 Mathematics Mock Paper 1"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-800"
                >
                  <option value="MOCK_EXAM">Mock Exam</option>
                  <option value="PRACTICE_TEST">Practice Test</option>
                  <option value="DIAGNOSTIC_QUIZ">Diagnostic Quiz</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Duration (Mins)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-800"
                />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800">Exam Sections</h3>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="text-xs font-bold text-blue-800 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} /> Add Section
                </button>
              </div>

              <div className="space-y-3">
                {sections.map((sect, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3 relative">
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] text-slate-400 uppercase">Name</label>
                        <input
                          type="text"
                          value={sect.name}
                          onChange={e => handleSectionChange(idx, "name", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase">Q-Count</label>
                        <input
                          type="number"
                          value={sect.questionCount}
                          onChange={e => handleSectionChange(idx, "questionCount", Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase">Marks</label>
                        <input
                          type="number"
                          step="0.5"
                          value={sect.marks}
                          onChange={e => handleSectionChange(idx, "marks", Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase">Neg. Marks</label>
                        <input
                          type="number"
                          step="0.5"
                          value={sect.negativeMarks}
                          onChange={e => handleSectionChange(idx, "negativeMarks", Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                Freeze Question Bank IDs (Comma separated UUIDs)
              </label>
              <textarea
                value={questionBankIdsInput}
                onChange={e => setQuestionBankIdsInput(e.target.value)}
                placeholder="uuid-1, uuid-2, ..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-800 h-16"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-500 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  className="rounded border-slate-350 bg-white text-blue-800 focus:ring-0"
                />
                Publish instantly (Freezes Question Bank references)
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving || !title.trim()}
                className="flex-1 py-2.5 bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save Assessment"}
              </button>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-800 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {exams.length === 0 ? (
                <div className="text-center py-24 text-slate-400 text-sm font-medium">
                  No assessments configured yet. Click "New Assessment" to start.
                </div>
              ) : (
                exams.map((exam) => (
                  <div key={exam.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          exam.is_published 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                            : "bg-amber-50 border-amber-100 text-amber-700"
                        }`}>
                          {exam.is_published ? "Published" : "Draft"}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {exam.type.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-slate-800 text-base">{exam.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock size={13} /> {exam.duration_minutes} Minutes
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen size={13} /> {exam.sections?.length || 0} Sections
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setExamId(exam.id);
                          setTitle(exam.title);
                          setType(exam.type);
                          setDuration(exam.duration_minutes);
                          setSections(exam.sections || []);
                          setIsPublished(exam.is_published);
                          setQuestionBankIdsInput("");
                          setShowEditor(true);
                        }}
                        className="px-3.5 py-2 text-xs font-semibold bg-slate-55 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Settings size={12} />
                        Configure
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
