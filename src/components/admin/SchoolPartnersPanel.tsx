"use client";
import { useState, useEffect } from "react";
import { School, Search, Plus, CheckCircle, XCircle, Users, Copy, Check } from "lucide-react";

export default function SchoolPartnersPanel() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    board: "",
    school_type: "PRIVATE",
    coordinator_name: "",
    coordinator_mobile: "",
    coordinator_email: "",
    quota: "50",
    sponsorship_mode: "FULL",
    pin: "",
    school_code: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchSchools = async () => {
    try {
      const res = await fetch("/api/admin/schools");
      const data = await res.json();
      if (data.success) {
        setSchools(data.schools);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const generateCode = () => {
    const cityPrefix = formData.city.substring(0, 3).toUpperCase() || "XXX";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `CNTS-${cityPrefix}-${randomNum}`;
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setFormData(prev => ({ ...prev, school_code: code, pin }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setShowAddModal(false);
        fetchSchools();
        setFormData({
          name: "", city: "", board: "", school_type: "PRIVATE", 
          coordinator_name: "", coordinator_mobile: "", coordinator_email: "",
          quota: "50", sponsorship_mode: "FULL", pin: "", school_code: ""
        });
      } else {
        setError(data.message || "Failed to add school");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.school_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const printCredentials = (school: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <title>CNTS School Credentials - ${school.name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 900; color: #1e3a8a; letter-spacing: 1px; }
            h1 { color: #0f172a; margin-bottom: 5px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 30px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 4px; }
            .mono { font-family: monospace; font-size: 20px; background: #fff; padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
            .referral { background: #eff6ff; border: 1px dashed #93c5fd; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; color: #1e40af; }
            .footer { margin-top: 50px; text-align: center; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">COURAGE NATIONAL TALENT SEARCH</div>
            <h1>School Partnership Credentials</h1>
            <p>Welcome to CNTS 2026. Keep this document secure.</p>
          </div>
          
          <div class="box">
            <div class="grid">
              <div>
                <div class="label">School Name</div>
                <div class="value">${school.name}</div>
              </div>
              <div>
                <div class="label">Coordinator</div>
                <div class="value">${school.coordinator_name} (${school.coordinator_mobile})</div>
              </div>
            </div>
          </div>

          <div class="box" style="background: #f0f9ff; border-color: #bae6fd;">
            <div class="grid">
              <div>
                <div class="label">School Access Code</div>
                <div class="value mono">${school.school_code}</div>
              </div>
              <div>
                <div class="label">Dashboard PIN</div>
                <div class="value mono">${school.pin}</div>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div class="label">Dashboard Login Link</div>
              <div class="value" style="font-size: 14px;">https://www.thecouragelibrary.com/dashboard/school/login</div>
            </div>
          </div>

          <div class="box">
            <div class="label" style="margin-bottom: 10px;">Direct Student Referral Link (Auto-fills Code)</div>
            <div class="referral">https://www.thecouragelibrary.com/register?school=${school.school_code}</div>
            <p style="font-size: 13px; color: #475569; margin-top: 10px;">
              Share this link with your students. It will automatically waive their registration fee based on your pre-paid quota (${school.quota} seats).
            </p>
          </div>
          
          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} | Courage National Talent Search 2026
          </div>
          <script>
            window.onload = () => { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2">
          <School className="text-blue-600" /> School Partners
        </h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search schools..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            onClick={() => { generateCode(); setShowAddModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Plus size={16} /> Add School
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">Loading schools...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map(school => (
            <div key={school.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">{school.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{school.city} • {school.board}</p>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${school.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {school.status}
                </span>
              </div>

              <div className="flex gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 relative group cursor-pointer" onClick={() => copyToClipboard(school.school_code)}>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">School Code</p>
                  <p className="font-mono font-bold text-slate-700">{school.school_code}</p>
                </div>
                <div className="flex-1 border-l border-slate-200 pl-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Login PIN</p>
                  <p className="font-mono font-bold text-slate-700">{school.pin}</p>
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedCode === school.school_code ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-400" />}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Coordinator</span>
                  <span className="font-medium text-slate-700">{school.coordinator_name || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-medium text-slate-700">{school.coordinator_mobile || "N/A"}</span>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={() => printCredentials(school)}
                    className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 py-2 rounded-lg transition-colors border border-blue-100"
                  >
                    Generate Credentials PDF
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                    <Users size={12} /> Quota Usage
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {school.used_quota} <span className="text-slate-400 font-normal">/ {school.quota}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${school.used_quota >= school.quota ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (school.used_quota / (school.quota || 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          {filteredSchools.length === 0 && (
            <div className="col-span-full py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-500">No schools found.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 overflow-y-auto flex justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl relative h-fit my-auto">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center rounded-t-3xl bg-white sticky top-0 z-20">
                <h3 className="font-display font-bold text-xl text-slate-800">Onboard New School</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors">
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <form id="onboard-school-form" onSubmit={handleSave} className="space-y-6">
                  {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">School Name *</label>
                      <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">City *</label>
                      <input required value={formData.city} onChange={e => { setFormData({...formData, city: e.target.value}); if(!formData.school_code) generateCode(); }} className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Board *</label>
                      <select required value={formData.board} onChange={e => setFormData({...formData, board: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white">
                        <option value="">Select Board</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="State Board">State Board</option>
                        <option value="IB">IB</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">School Type</label>
                      <select required value={formData.school_type} onChange={e => setFormData({...formData, school_type: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white">
                        <option value="PRIVATE">Private</option>
                        <option value="GOVERNMENT">Government</option>
                        <option value="TRUST">Trust</option>
                        <option value="COACHING">Coaching</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Coordinator Name *</label>
                      <input required value={formData.coordinator_name} onChange={e => setFormData({...formData, coordinator_name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Mobile Number *</label>
                      <input required value={formData.coordinator_mobile} onChange={e => setFormData({...formData, coordinator_mobile: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                      <input type="email" value={formData.coordinator_email} onChange={e => setFormData({...formData, coordinator_email: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Seat Quota *</label>
                      <input type="number" required value={formData.quota} onChange={e => setFormData({...formData, quota: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Sponsorship Mode</label>
                      <select value={formData.sponsorship_mode} onChange={e => setFormData({...formData, sponsorship_mode: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white">
                        <option value="FULL">FULL (100% Free for Student)</option>
                        <option value="PARTIAL">PARTIAL (Split Payment)</option>
                      </select>
                    </div>
                  </div>
                </form>

                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Generated Credentials</p>
                    <p className="text-sm text-blue-700">Code: <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-200">{formData.school_code || "-"}</span> &nbsp; PIN: <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-200">{formData.pin || "-"}</span></p>
                  </div>
                  <button type="button" onClick={generateCode} className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 bg-white rounded-lg border border-blue-200 shadow-sm">
                    Regenerate
                  </button>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" form="onboard-school-form" disabled={saving} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all active:scale-95">
                  {saving ? "Saving..." : <><CheckCircle size={18} /> Complete Onboarding</>}
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}
