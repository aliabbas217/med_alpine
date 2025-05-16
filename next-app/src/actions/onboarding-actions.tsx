"use server";

import { adminDb } from "@/lib/firebase/admin";

type OnboardingData = {
  profession: string;
  field: string;
  frequency: string;
  about: string;
};

export async function saveUserOnboardingData(userId: string, data: OnboardingData) {
  try {
    // Save the onboarding data to Firestore
    await adminDb.collection("users").doc(userId).set({
      onboarding: {
        ...data,
        completedAt: new Date()
      }
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    return { success: false, error: "Failed to save onboarding data" };
  }
}

export async function getUserOnboardingStatus(userId: string) {
  try {
    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userData = userDoc.data();
    
    // Check if onboarding data exists and has completedAt timestamp
    if (userData?.onboarding?.completedAt) {
      return { completed: true };
    }
    
    return { completed: false };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return { completed: false, error: "Failed to check onboarding status" };
  }
}