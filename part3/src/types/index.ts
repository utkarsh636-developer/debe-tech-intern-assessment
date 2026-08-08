export type SessionStatus = "upcoming" | "completed" | "cancelled";

export interface Session {
  id: string;
  subject: string;
  teacherName: string;
  datetime: string;
  status: SessionStatus;
}

export type RescheduleReason =
  | "Conflict"
  | "Illness"
  | "Time zone"
  | "Other";

export interface RescheduleRequest {
  sessionId: string;
  existingSlotUtc: string;
  newSlotUtc: string;
  reason: RescheduleReason;
}

export interface RescheduleResponse {
  success: boolean;
  error?: string;
}
