import { Metadata } from "next";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { getUserProfileData } from "@/actions/user-actions";
import { checkUserNeedsOnboarding } from "@/actions/auth-actions";

export const metadata: Metadata = {
  title: "Profile | MedAlpine",
  description: "View and update your MedAlpine profile",
};

export default async function ProfilePage() {
  // Check if user is logged in and has completed onboarding
  const user = await checkUserNeedsOnboarding();
  
  // Fetch the user's profile data, including onboarding information
  const profileData = await getUserProfileData(user.uid);

  const adaptedUser = {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null
  };

  return (
    <>
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and manage your profile information
          </p>
        </div>
      </header>

      <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
        <ProfileContent user={adaptedUser} profileData={profileData} />
      </div>
    </>
  );
}