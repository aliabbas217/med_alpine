"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import { getUserOnboardingStatus } from "./user-actions";

export async function createSessionCookie(idToken: string) {
  // Create a session cookie using the Firebase Admin SDK
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
    // Set the cookie
    (await cookies()).set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create session" };
  }
}

export async function signOut() {
  // Clear the session cookie
  (await cookies()).delete("session");
  redirect("/login");
}

export async function getCurrentUser() {
  const session = (await cookies()).get("session")?.value;
  
  if (!session) {
    return null;
  }
  
  try {
    const decodedToken = await adminAuth.verifySessionCookie(session, true);
    const user = await adminAuth.getUser(decodedToken.uid);
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  } catch (error) {
    return null;
  }
}

export async function checkUserNeedsOnboarding() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  const { completed } = await getUserOnboardingStatus(user.uid);
  
  if (!completed) {
    redirect("/onboarding");
  }
  
  return user;
}