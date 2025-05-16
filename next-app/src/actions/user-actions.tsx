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

export async function getUserProfileData(userId: string) {
  try {
    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData) {
      return {
        onboarding: {
          profession: "",
          field: "",
          frequency: "",
          about: "",
          completedAt: null
        },
        stats: {
          papersRead: 0,
          aiInteractions: 0,
          daysActive: 0
        }
      };
    }

    // Add default values for any missing fields
    return {
      onboarding: {
        profession: userData.onboarding?.profession || "",
        field: userData.onboarding?.field || "",
        frequency: userData.onboarding?.frequency || "",
        about: userData.onboarding?.about || "",
        completedAt: userData.onboarding?.completedAt?.toDate() || null
      },
      stats: {
        papersRead: userData.stats?.papersRead || 0,
        aiInteractions: userData.stats?.aiInteractions || 0,
        daysActive: userData.stats?.daysActive || 0
      }
    };
  } catch (error) {
    console.error("Error fetching user profile data:", error);
    // Return default values if there's an error
    return {
      onboarding: {
        profession: "",
        field: "",
        frequency: "",
        about: "",
        completedAt: null
      },
      stats: {
        papersRead: 0,
        aiInteractions: 0,
        daysActive: 0
      }
    };
  }
}

export async function updateUserProfile(userId: string, data: {
  displayName?: string;
  about?: string;
  field?: string;
}) {
  try {
    const updates: Record<string, any> = {};
    
    if (data.about !== undefined) {
      updates["onboarding.about"] = data.about;
    }
    
    if (data.field !== undefined) {
      updates["onboarding.field"] = data.field;
    }
    
    // We'll handle displayName separately since it requires updating Auth as well
    
    if (Object.keys(updates).length > 0) {
      await adminDb.collection("users").doc(userId).update(updates);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}