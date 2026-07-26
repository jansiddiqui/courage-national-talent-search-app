import { CheckCircle2 } from "lucide-react";

export default function NationalMapSection() {
  return (
    <section className="py-20 bg-white border-y border-slate-200 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">National Scope</span>
          <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight text-slate-900 mt-2">
            A National Initiative. Built for Every School in India.
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-3">
            Supporting participating schools across urban centers, rural districts, government systems, and private boards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
          
          {/* India Map Graphic & Coordination Hubs */}
          <div className="lg:col-span-7 relative h-72 md:h-96 flex items-center justify-center bg-white rounded-2xl border border-slate-200 p-4 overflow-hidden">
            <svg viewBox="0 0 500 550" className="w-full h-full text-blue-600 fill-current opacity-80">
              <path d="M 230,50 Q 250,30 270,50 T 290,90 T 320,120 T 380,150 T 420,180 T 410,230 T 360,260 T 310,290 T 270,350 T 220,430 T 200,480 T 180,430 T 160,350 T 130,290 T 100,240 T 110,180 T 140,130 T 190,80 Z" opacity="0.12" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M 220,60 Q 240,40 260,60 T 280,100 T 310,130 T 370,160 T 400,190 T 390,230 T 350,260 T 300,290 T 260,340 T 210,410 T 195,460 T 180,410 T 160,340 T 135,290 T 115,240 T 120,190 T 150,140 T 190,90 Z" opacity="0.06" />
              
              <g transform="translate(210, 160)"><circle r="8" fill="#2563EB" /><text x="12" y="4" fontSize="10" fontWeight="bold" fill="#1E293B">Delhi-NCR Hub</text></g>
              <g transform="translate(150, 310)"><circle r="8" fill="#2563EB" /><text x="12" y="4" fontSize="10" fontWeight="bold" fill="#1E293B">Mumbai Hub</text></g>
              <g transform="translate(195, 410)"><circle r="8" fill="#10B981" /><text x="12" y="4" fontSize="10" fontWeight="bold" fill="#1E293B">Bengaluru Hub</text></g>
              <g transform="translate(340, 250)"><circle r="8" fill="#2563EB" /><text x="-70" y="4" fontSize="10" fontWeight="bold" fill="#1E293B">Kolkata Hub</text></g>
              <g transform="translate(225, 330)"><circle r="8" fill="#2563EB" /><text x="12" y="4" fontSize="10" fontWeight="bold" fill="#1E293B">Hyderabad Hub</text></g>
              <g transform="translate(165, 325)"><circle r="6" fill="#F59E0B" /></g>

              <line x1="210" y1="160" x2="150" y2="310" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              <line x1="210" y1="160" x2="340" y2="250" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              <line x1="150" y1="310" x2="195" y2="410" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
            </svg>
          </div>

          {/* Factual Reach Checklist */}
          <div className="lg:col-span-5 text-left space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-xl">National Coverage Matrix</h3>
            <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                <span><strong>28 States &amp; 8 Union Territories</strong> Supported</span>
              </li>
              <li className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                <span><strong>Urban &amp; Rural District</strong> Lab Access Compatible</span>
              </li>
              <li className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                <span><strong>CBSE, ICSE, State &amp; International Boards</strong> Supported</span>
              </li>
              <li className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                <span><strong>Dedicated Regional Relationship Officers</strong> Assigned</span>
              </li>
            </ul>
            <p className="text-[11px] text-slate-500 italic pt-1">
              Supporting school participation across India for the 2026 Academic Session.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
