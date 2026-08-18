"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  School, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  X, 
  Filter,
  ArrowRight
} from "lucide-react";
import type { SchoolDirectoryItem } from "@/lib/schoolProfiles";

interface Props {
  initialSchools: SchoolDirectoryItem[];
}

export default function SchoolsDirectoryClient({ initialSchools }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("ALL");
  const [selectedState, setSelectedState] = useState("ALL");

  // Extract unique boards and states for dropdowns
  const availableBoards = useMemo(() => {
    const boards = new Set<string>();
    initialSchools.forEach((s) => {
      if (s.board && s.board.trim()) boards.add(s.board.trim());
    });
    return Array.from(boards).sort();
  }, [initialSchools]);

  const availableStates = useMemo(() => {
    const states = new Set<string>();
    initialSchools.forEach((s) => {
      if (s.state && s.state.trim()) states.add(s.state.trim());
    });
    return Array.from(states).sort();
  }, [initialSchools]);

  // Filtered dataset
  const filteredSchools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return initialSchools.filter((school) => {
      // 1. Search Query Match (Name, City, State)
      if (query) {
        const nameMatch = school.name.toLowerCase().includes(query);
        const cityMatch = school.city?.toLowerCase().includes(query);
        const stateMatch = school.state?.toLowerCase().includes(query);
        if (!nameMatch && !cityMatch && !stateMatch) {
          return false;
        }
      }

      // 2. Board Filter
      if (selectedBoard !== "ALL") {
        if (school.board?.trim() !== selectedBoard) {
          return false;
        }
      }

      // 3. State Filter
      if (selectedState !== "ALL") {
        if (school.state?.trim() !== selectedState) {
          return false;
        }
      }

      return true;
    });
  }, [initialSchools, searchQuery, selectedBoard, selectedState]);

  const hasActiveFilters = searchQuery !== "" || selectedBoard !== "ALL" || selectedState !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedBoard("ALL");
    setSelectedState("ALL");
  };

  return (
    <div className="space-y-6">
      {/* ==================================================================== */}
      {/* SEARCH & FILTER CONTROLS                                             */}
      {/* ==================================================================== */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by school name, city, or state..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Board Dropdown Filter */}
          {availableBoards.length > 0 && (
            <div className="w-full sm:w-48 shrink-0">
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                aria-label="Filter by Board"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="ALL">All Boards</option>
                {availableBoards.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* State Dropdown Filter */}
          {availableStates.length > 0 && (
            <div className="w-full sm:w-48 shrink-0">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                aria-label="Filter by State"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="ALL">All States</option>
                {availableStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Status / Active Count Strip */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <Filter size={13} className="text-slate-400" />
            <span>
              Showing <strong className="text-slate-900">{filteredSchools.length}</strong> of {initialSchools.length} {initialSchools.length === 1 ? "Partner School" : "Partner Schools"}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X size={12} />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* PARTNER SCHOOLS CARD GRID                                            */}
      {/* ==================================================================== */}
      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredSchools.map((school) => {
            const joinYear = new Date(school.joined_at).getFullYear() || 2026;

            return (
              <div
                key={school.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Top Accent Gradient Line for Featured / Founding Schools */}
                {school.is_founding_school && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-blue-600" />
                )}

                <div className="p-5 space-y-4">
                  {/* Logo + Identity Header */}
                  <div className="flex items-start gap-3.5">
                    {school.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={school.logo_url}
                        alt={`${school.name} Logo`}
                        className="w-12 h-12 rounded-xl object-contain p-1 bg-slate-50 border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                        <School className="w-6 h-6 stroke-[1.75]" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <Link
                        href={`/schools/${school.slug}`}
                        className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug block"
                      >
                        {school.name}
                      </Link>
                      <p className="text-slate-500 text-xs flex items-center gap-1 font-medium">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{school.city}{school.state ? `, ${school.state}` : ""}</span>
                      </p>
                    </div>
                  </div>

                  {/* Metadata Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                    {school.is_founding_school ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-900 border border-amber-300">
                        <Sparkles size={11} className="text-amber-600 shrink-0" />
                        Founding Partner
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        <ShieldCheck size={11} className="text-blue-600 shrink-0" />
                        Partner School
                      </span>
                    )}

                    {school.board && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                        {school.board}
                      </span>
                    )}

                    <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                      Since {joinYear}
                    </span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100/90 flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:text-blue-800">
                  <Link
                    href={`/schools/${school.slug}`}
                    className="flex items-center justify-between w-full hover:underline"
                  >
                    <span>View Institutional Profile</span>
                    <ArrowRight size={13} className="text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto">
            <School className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
              No Matching Partner Schools Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We couldn&apos;t find any published CNTS partner schools matching your search filters. Try adjusting your keywords or clearing active filters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <X size={13} />
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
