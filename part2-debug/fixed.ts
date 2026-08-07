import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

interface BookingRequest {
    studentId: string;
    teacherId: string;
    slot: string; // ISO datetime string
    subject: string;
}

export const bookSession = functions.https.onCall(async (data: BookingRequest, context) => {
    // 1. The given Typescript interface provides compile type safety 
    // but at runtime it does not validate the untrusted input data 
    // user/client can send invalid values which creates corrupted booking records
    // the function should validate required fields and the slot format before writing to firestore.
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Authentication is required"
        );
    }

    const studentId = context.auth.uid;

    if (!data.teacherId || !data.subject || !data.subject.trim()) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Invalid booking data"
        );
    }

    const slotDate = new Date(data.slot);

    if (Number.isNaN(slotDate.getTime())) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Invalid slot"
        );
    }

    const booking = {
        studentId: studentId,
        teacherId: data.teacherId,
        slot: data.slot,
        subject: data.subject,
        status: "confirmed",
        createdAt: new Date(),
    };

    const teacherRef = db.collection("teachers").doc(data.teacherId);

    // 2. .get() is asynchronous and returns a Promise
    // so if we dont write await then it will not wait for the promise to resolve and will return undefined
    // so existing.docs.length will throw TypeError: Cannot read properties of undefined
    // so we need to await the promise to get the actual result

    // 3. the original code checked teacherRef.collection("bookings")
    // but wrote the actual booking to a separate db.collection("bookings"),
    // two different Firestore locations, the check queried a collection that the
    // write path never touched, so it could never find a real conflict, 
    // fixed by using the same teacherRef.collection("bookings") path for both the check and the write.
    const existing = await teacherRef.collection("bookings").where("slot", "==", data.slot).get();

    if (existing.docs.length > 0) {
        return { success: false, message: "Slot already booked" };
    }

    // 4. .add() is asynchronous and returns a Promise
    // so if we dont write await then it will not wait for the promise to resolve
    // and the function will return success without waiting for it to complete
    // so it will cause data inconsistency as the user/client will think that the booking is successful
    // even if the database write fails later
    await teacherRef.collection("bookings").add(booking);
    return { success: true };
});