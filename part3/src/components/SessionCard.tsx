"use client";

import React, { useState } from "react";
import { Session } from "@/types";
import { formatLocalDateTime } from "@/lib/timeUtils";
import RescheduleModal from "./RescheduleModal";

interface SessionCardProps {
  session: Session;
}

const SUBJECT_ACCENT: Record<string, string> = {
  Mathematics: "#6366f1",
  Physics: "#0ea5e9",
  "English Literature": "#ec4899",
  Chemistry: "#f59e0b",
  Biology: "#10b981",
};

export default function SessionCard({ session }: SessionCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const localDatetime = formatLocalDateTime(session.datetime);
  const accent = SUBJECT_ACCENT[session.subject] ?? "#6366f1";

  return (
    <>
      <article className="bg-bg-surface border border-indigo-100 rounded-2xl shadow-card overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.15)] group">

        <div className="h-[3px] w-full" style={{ background: accent }} />

        <div className="p-5 flex-1">
          <div className="flex justify-between items-center mb-2 gap-2">
            <span className="text-base font-semibold text-content-primary">
              {session.subject}
            </span>

            <span className="text-[0.7rem] font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {session.status}
            </span>
          </div>

          <p className="text-sm text-content-secondary mb-4">
            {session.teacherName}
          </p>

          <div className="flex items-center gap-2 text-[0.82rem] text-content-secondary">
            <svg
              className="w-3.5 h-3.5 shrink-0 text-brand"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>

            <time dateTime={session.datetime} suppressHydrationWarning>
              {localDatetime}
            </time>
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            className="w-full bg-bg-surface2 text-brand border border-brand/20 text-sm font-medium rounded-lg py-2.5 px-4 transition-all duration-150 hover:bg-brand hover:text-white hover:border-brand"
            onClick={() => setIsModalOpen(true)}
            aria-label={`Request reschedule for ${session.subject} with ${session.teacherName}`}
          >
            Request Reschedule
          </button>
        </div>
      </article>

      {isModalOpen && (
        <RescheduleModal
          session={session}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
