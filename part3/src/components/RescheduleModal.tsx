"use client";

import React, { useEffect, useState } from "react";
import { Session } from "@/types";
import RescheduleForm from "./RescheduleForm";

interface RescheduleModalProps {
  session: Session;
  onClose: () => void;
}

export default function RescheduleModal({
  session,
  onClose,
}: RescheduleModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleSuccess(): void {
    setIsSuccess(true);
  }

  return (
    <div
      className="fixed inset-0 bg-indigo-950/30 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-bg-surface border border-indigo-100 rounded-3xl shadow-modal w-full max-w-[480px] p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className="text-center py-4">
            <div
              className="w-14 h-14 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center text-2xl text-emerald-600 mx-auto mb-5 animate-pop-in"
              aria-hidden="true"
            >
              ✓
            </div>

            <h2
              id="modal-title"
              className="text-xl font-semibold text-content-primary tracking-tight mb-2"
            >
              Request Sent!
            </h2>

            <p className="text-sm text-content-secondary mb-7">
              Your reschedule request for{" "}
              <strong className="text-content-primary">{session.subject}</strong>{" "}
              with{" "}
              <strong className="text-content-primary">{session.teacherName}</strong>{" "}
              has been submitted. Your teacher will confirm the new time shortly.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-brand text-white font-medium rounded-lg py-2.5 px-5 shadow-brand-glow hover:bg-brand-hover hover:shadow-brand-glow-lg transition-all duration-150 active:scale-[0.97]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-7 gap-4">
              <div>
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-content-primary tracking-tight"
                >
                  Request Reschedule
                </h2>
                <p className="text-sm text-content-secondary mt-1">
                  {session.subject} · {session.teacherName}
                </p>
              </div>

              <button
                onClick={onClose}
                className="bg-bg-surface2 border border-indigo-100 text-content-secondary w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-150"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <RescheduleForm
              session={session}
              onSuccess={handleSuccess}
              onCancel={onClose}
            />
          </>
        )}
      </div>
    </div>
  );
}
