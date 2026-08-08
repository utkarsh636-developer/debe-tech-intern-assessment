"use client";

import React from "react";
import { mockSessions } from "@/data/mockSessions";
import { Session } from "@/types";
import SessionCard from "./SessionCard";

export default function SessionList() {
  const nowMs = Date.now();

  const upcomingSessions: Session[] = mockSessions
    .filter(
      (s) =>
        s.status === "upcoming" &&
        new Date(s.datetime).getTime() > nowMs
    )
    .sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    )
    .slice(0, 3);

  if (upcomingSessions.length === 0) {
    return (
      <div className="text-center py-16 text-content-muted text-sm">
        No upcoming sessions scheduled.
      </div>
    );
  }

  return (
    <section aria-label="Upcoming tutoring sessions">
      <header className="mb-6">
        <h2 className="text-xl font-semibold text-content-primary">
          Next {upcomingSessions.length} Upcoming Sessions
        </h2>
        <p className="text-xs text-content-muted mt-0.5">
          Times shown in your local timezone
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {upcomingSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}
