import React from "react";
import type { Metadata } from "next";
import SessionList from "@/components/SessionList";

export const metadata: Metadata = {
  title: "My Sessions | TutorConnect Parent Portal",
  description:
    "View and manage your child's upcoming tutoring sessions. Request reschedules directly from the portal.",
};

export default function SessionsPage() {
  return (
    <main className="min-h-screen py-8 px-4 sm:py-12 sm:px-6">
      <div className="max-w-4xl mx-auto">

        <header className="flex items-start justify-between mb-10 gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight bg-gradient-to-br from-content-primary to-brand-muted bg-clip-text text-transparent">
              My Sessions
            </h1>
            <p className="text-content-secondary text-sm mt-2">
              Manage your child&apos;s upcoming tutoring sessions
            </p>
          </div>

          <div className="bg-brand/15 border border-brand/30 text-brand-muted text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full whitespace-nowrap shrink-0">
            Parent Portal
          </div>
        </header>

        <SessionList />
      </div>
    </main>
  );
}
