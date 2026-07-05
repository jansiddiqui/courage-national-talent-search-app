import { Clock, BookOpen, Monitor, CalendarDays, FileQuestion, Languages } from "lucide-react";
import { TIMELINE_LABELS } from "@/config/timeline";
import { 
  EXAM_DOMAINS, 
  EXAM_MODE,
  SUB_JUNIOR_QUESTIONS,
  JUNIOR_QUESTIONS,
  SUB_JUNIOR_DURATION,
  JUNIOR_DURATION
} from "@/config/exam";

const subjects = [
  { name: EXAM_DOMAINS[0].name, topics: "Logical Reasoning, Analogy, Series, Spatial Pattern", weight: "25%" },
  { name: EXAM_DOMAINS[1].name, topics: "Conceptual Arithmetic, Number Logic, Patterns", weight: "25%" },
  { name: EXAM_DOMAINS[2].name, topics: "Reading Comprehension, Vocabulary, Sentence Logic", weight: "25%" },
  { name: EXAM_DOMAINS[3].name, topics: "Critical Reasoning, Cause & Effect, Information Synthesis", weight: "25%" },
];

const getExamCards = () => [
  { icon: FileQuestion, label: "Total Questions", value: `${SUB_JUNIOR_QUESTIONS} / ${JUNIOR_QUESTIONS} MCQs`, color: "text-blue-700 bg-blue-50" },
  { icon: Clock, label: "Duration", value: `${SUB_JUNIOR_DURATION} / ${JUNIOR_DURATION}`, color: "text-amber-700 bg-amber-50" },
  { icon: Languages, label: "Medium", value: "Hindi & English", color: "text-emerald-700 bg-emerald-50" },
  { icon: Monitor, label: "Mode", value: EXAM_MODE, color: "text-purple-700 bg-purple-50" },
  { icon: CalendarDays, label: "Exam Date", value: TIMELINE_LABELS.EXAM_DATE.replace(' (Sunday)', ''), color: "text-rose-700 bg-rose-50" },
  { icon: BookOpen, label: "Eligible Classes", value: "5, 6, 7 & 8", color: "text-cyan-700 bg-cyan-50" },
];

export default function ExamOverview() {
  const examCards = getExamCards();
  return (
    <section id="exam" className="py-24 lg:py-32 mesh-bg">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest mb-4 bg-blue-50 px-3 py-1 rounded-full">
            Exam Overview
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
            Thoughtfully designed.
            <br />
            <span className="gradient-text">Fairly evaluated.</span>
          </h2>
          <p className="text-lg text-slate-500">
            CNTS is not designed to trick students — it&apos;s designed to discover them. Every question is mapped to a specific cognitive ability.
          </p>
        </div>

        {/* Quick stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {examCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-100 p-5 text-center hover:shadow-md hover:border-blue-100 transition-all group card-glow">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mx-auto mb-3`}>
                <card.icon size={18} />
              </div>
              <div className="font-display font-bold text-slate-800 text-sm mb-1">{card.value}</div>
              <div className="text-xs text-slate-400">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Subject breakdown */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="px-4 sm:px-8 py-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-display font-bold text-slate-900 text-xl">Subject Breakdown</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full font-medium w-fit">
              CNTS 2026 Syllabus
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {subjects.map((s, i) => {
              const colors = [
                { bar: "bg-blue-600", light: "bg-blue-50 text-blue-700" },
                { bar: "bg-amber-500", light: "bg-amber-50 text-amber-700" },
                { bar: "bg-emerald-500", light: "bg-emerald-50 text-emerald-700" },
                { bar: "bg-purple-500", light: "bg-purple-50 text-purple-700" },
              ];
              const c = colors[i];
              const width = parseInt(s.weight);
              return (
                <div key={s.name} className="px-4 sm:px-8 py-5 flex items-center gap-4 sm:gap-6 hover:bg-slate-50/50 transition-colors">
                  <div className={`w-2 h-10 rounded-full ${c.bar} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-slate-800">{s.name}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.light}`}>
                        {s.weight}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 truncate">{s.topics}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 w-48">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${width * 2.5}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 w-8 text-right">{s.weight}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-4 sm:px-8 py-5 bg-slate-50/80 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">Negative marking:</span> None. All questions are worth equal marks. CNTS rewards what students know, not what they guess wrong.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
