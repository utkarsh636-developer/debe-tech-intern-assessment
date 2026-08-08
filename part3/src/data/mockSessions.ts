import { Session } from "@/types";

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export const mockSessions: Session[] = [
  {
    id: "session-001",
    subject: "Mathematics",
    teacherName: "Ms. Priya Sharma",
    datetime: hoursFromNow(28),
    status: "upcoming",
  },
  {
    id: "session-002",
    subject: "Physics",
    teacherName: "Mr. Arjun Mehta",
    datetime: hoursFromNow(52),
    status: "upcoming",
  },
  {
    id: "session-003",
    subject: "English Literature",
    teacherName: "Ms. Sarah O'Brien",
    datetime: hoursFromNow(76),
    status: "upcoming",
  },
  {
    id: "session-004",
    subject: "Chemistry",
    teacherName: "Dr. Rohan Kapoor",
    datetime: hoursFromNow(100),
    status: "upcoming",
  },
  {
    id: "session-005",
    subject: "Biology",
    teacherName: "Ms. Anjali Verma",
    datetime: hoursFromNow(-48),
    status: "completed",
  },
];
