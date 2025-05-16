import { getCurrentUser } from "@/actions/auth-actions";
import { redirect } from "next/navigation";

export default async function AuthOnlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only check if user is authenticated, not if they've completed onboarding
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  return children;
}