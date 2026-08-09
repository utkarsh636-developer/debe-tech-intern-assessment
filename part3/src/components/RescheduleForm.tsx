"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { RescheduleReason, RescheduleRequest, Session } from "@/types";
import { requestReschedule } from "@/lib/cloudFunctions/requestReschedule";
import {
  toUtcIsoString,
  isWithinTwoHourLockout,
  getMinSelectableDate,
} from "@/lib/timeUtils";

interface RescheduleFormProps {
  session: Session;
  onSuccess: () => void;
  onCancel: () => void;
}

const RESCHEDULE_REASONS: RescheduleReason[] = [
  "Conflict",
  "Illness",
  "Time zone",
  "Other",
];

const INPUT_CLASSES =
  "w-full bg-white border border-gray-200 rounded-lg text-content-primary text-sm px-3.5 py-2.5 outline-none transition-all duration-150 focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 disabled:cursor-not-allowed";


export default function RescheduleForm({
  session,
  onSuccess,
  onCancel,
}: RescheduleFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reason, setReason] = useState<RescheduleReason>("Conflict");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const minSelectableDate = getMinSelectableDate();

  function handleDateChange(date: Date | null): void {
    setSelectedDate(date);
    setErrorMessage(null);
  }

  function handleReasonChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    setReason(e.target.value as RescheduleReason);
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    if (!selectedDate) return;

    if (isWithinTwoHourLockout(selectedDate)) {
      setErrorMessage(
        "Sessions must be scheduled at least 2 hours in advance. Please choose a later time."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const newSlotUtc = toUtcIsoString(selectedDate);

    const payload: RescheduleRequest = {
      sessionId: session.id,
      existingSlotUtc: session.datetime,
      newSlotUtc,
      reason,
    };

    try {
      const response = await requestReschedule(payload);

      if (response.success) {
        onSuccess();
      } else {
        setErrorMessage(response.error ?? "An unknown error occurred.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit = selectedDate !== null && !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="new-slot-picker"
          className="flex flex-col gap-0.5 text-[0.825rem] font-medium text-content-secondary"
        >
          New Date &amp; Time
          <span className="text-[0.72rem] font-normal text-content-muted">
            Shown in your local timezone — stored as UTC
          </span>
        </label>

        <DatePicker
          id="new-slot-picker"
          selected={selectedDate}
          onChange={handleDateChange}
          showTimeSelect
          timeIntervals={30}
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={minSelectableDate}
          filterTime={(time: Date) => !isWithinTwoHourLockout(time)}
          placeholderText="Select a date and time"
          className={INPUT_CLASSES}
          autoComplete="off"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="reschedule-reason"
          className="text-[0.825rem] font-medium text-content-secondary"
        >
          Reason
        </label>
        <select
          id="reschedule-reason"
          value={reason}
          onChange={handleReasonChange}
          className={INPUT_CLASSES}
          disabled={isSubmitting}
        >
          {RESCHEDULE_REASONS.map((r) => (
            <option key={r} value={r} className="bg-bg-surface2 text-content-primary">
              {r}
            </option>
          ))}
        </select>
      </div>

      {errorMessage !== null && (
        <p
          className="text-[0.825rem] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 animate-shake-in"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}

      <div className="flex gap-3 justify-end mt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-content-secondary bg-transparent hover:bg-bg-surface2 hover:text-content-primary transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!canSubmit}
          aria-busy={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-brand text-white shadow-brand-glow hover:bg-brand-hover hover:shadow-brand-glow-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
        >
          {isSubmitting ? (
            <>
              <span
                className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                aria-hidden="true"
              />
              Submitting…
            </>
          ) : (
            "Submit Request"
          )}
        </button>
      </div>
    </form>
  );
}
