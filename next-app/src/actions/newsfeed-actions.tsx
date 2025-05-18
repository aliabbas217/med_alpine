"use server";

import { getUserProfileData } from "./user-actions";

type Paper = {
  pmcid: string;
  title: string;
  publication_date: string;
  last_updated: string;
  content: string;
  full_text_url: string;
};

export async function fetchNewsfeedForUser(userId: string): Promise<Paper[]> {
  try {
    // Get user profile to determine their field/niche
    const userProfile = await getUserProfileData(userId);
    
    // Default to general medicine if no field is specified
    const niche = userProfile.onboarding.field || "general";
    // Fetch papers from the API
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/newsfeed`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        niche: niche,
        months: 6 // Default to last 6 months
      }),
      cache: "no-store" // Don't cache the response
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.papers;
  } catch (error) {
    console.error("Error fetching newsfeed:", error);
    return [];
  }
}