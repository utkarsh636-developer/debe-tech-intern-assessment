import { RescheduleRequest, RescheduleResponse } from "@/types";

const MOCK_LATENCY_MS = 1200;

export async function requestReschedule(
  payload: RescheduleRequest
): Promise<RescheduleResponse> {
  await new Promise<void>((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

  const newSlotMs = new Date(payload.newSlotUtc).getTime();
  const existingSlotMs = new Date(payload.existingSlotUtc).getTime();
  const nowMs = Date.now();

  if (newSlotMs <= nowMs) {
    return {
      success: false,
      error: "The requested slot is in the past. Please choose a future time.",
    };
  }

  if (newSlotMs === existingSlotMs) {
    return {
      success: false,
      error:
        "The new slot is the same as the existing session time. Please choose a different time.",
    };
  }

  return { success: true };
}
