"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateUserProfile } from "@/actions/user-actions";
import { CalendarDays, Edit2, Stethoscope, BookOpen, Brain } from "lucide-react";

// Mapping for profession types to display names
const professionMap: Record<string, string> = {
  "professional": "Medical Professional",
  "teacher": "Medical Educator",
  "student": "Medical Student"
};

// Mapping for field types to display names
const fieldMap: Record<string, string> = {
  "cardiology": "Cardiology",
  "neurology": "Neurology",
  "pulmonology": "Pulmonology",
  "pediatrics": "Pediatrics",
  "orthopedics": "Orthopedics",
  "pathology": "Pathology",
  "general": "General Medicine",
  "emergency": "Emergency Medicine"
};

// Mapping for research frequency to display names
const frequencyMap: Record<string, string> = {
  "daily": "Daily",
  "weekly": "Weekly",
  "monthly": "Monthly",
  "quarterly": "Quarterly",
  "rarely": "Rarely"
};

type ProfileContentProps = {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
  profileData: {
    onboarding: {
      profession: string;
      field: string;
      frequency: string;
      about: string;
      completedAt: Date | null;
    };
    stats: {
      papersRead: number;
      aiInteractions: number;
      daysActive: number;
    };
  };
};

export function ProfileContent({ user, profileData }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [about, setAbout] = useState(profileData.onboarding.about);
  const [field, setField] = useState(profileData.onboarding.field);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateUserProfile(user.uid, {
        about,
        field
      });
      
      if (result.success) {
        toast(
          "Profile updated",
        );
        setIsEditing(false);
      } else {
        toast(
          "Failed to update your profile. Please try again.",
      );
      }
    } catch (error) {
      console.error(error);
      toast(
        "Failed to update your profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="space-y-6 mt-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute right-6 top-6"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">{isEditing ? "Cancel editing" : "Edit profile"}</span>
            </Button>
            
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    width={96}
                    height={96}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-4xl font-medium text-teal-600 dark:text-teal-400">
                    {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-center sm:text-left text-2xl mt-2 sm:mt-0 text-slate-900 dark:text-white">
                  {user.displayName || "Medical Professional"}
                </CardTitle>
                <CardDescription className="text-center sm:text-left mt-1 flex items-center">
                  <Stethoscope className="w-3.5 h-3.5 mr-1.5" />
                  {professionMap[profileData.onboarding.profession] || "Medical Professional"}
                  {profileData.onboarding.field && (
                    <>
                      <span className="mx-1.5">•</span>
                      <span>{fieldMap[profileData.onboarding.field] || profileData.onboarding.field}</span>
                    </>
                  )}
                </CardDescription>
                <CardDescription className="text-center sm:text-left mt-1 flex items-center">
                  <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                  Member since {profileData.onboarding.completedAt 
                    ? new Date(profileData.onboarding.completedAt).toISOString().split('T')[0] 
                    : "recently"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isEditing ? (
              // Edit Mode
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="field" className="text-slate-900 dark:text-white">Medical Field/Specialty</Label>
                    <select
                      id="field"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:focus:ring-teal-500"
                    >
                      <option value="">Select a specialty</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="neurology">Neurology</option>
                      <option value="pulmonology">Pulmonology</option>
                      <option value="pediatrics">Pediatrics</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="pathology">Pathology</option>
                      <option value="general">General Medicine</option>
                      <option value="emergency">Emergency Medicine</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="about" className="text-slate-900 dark:text-white">About Me</Label>
                    <Textarea
                      id="about"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Share information about your medical background, research interests, or experience"
                      rows={5}
                      className="text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      This information helps us personalize your research recommendations
                    </p>
                  </div>
                </div>
              </>
            ) : (
              // View Mode
              <>
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">About Me</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">
                    {profileData.onboarding.about || "No information provided yet."}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start">
                      <div className="p-2 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mr-3">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Papers Read</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{profileData.stats.papersRead}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start">
                      <div className="p-2 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mr-3">
                        <Brain className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">AI Interactions</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{profileData.stats.aiInteractions}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start">
                      <div className="p-2 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mr-3">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Days Active</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{profileData.stats.daysActive}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-300">Medical Field</span>
                      <span className="font-medium text-slate-900 dark:text-white">{fieldMap[profileData.onboarding.field] || "Not specified"}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-300">Research Frequency</span>
                      <span className="font-medium text-slate-900 dark:text-white">{frequencyMap[profileData.onboarding.frequency] || "Not specified"}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          {isEditing && (
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="text-slate-900 dark:text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-600 dark:hover:bg-teal-500"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </TabsContent>
      
      <TabsContent value="account" className="space-y-6 mt-6">
        {/* Account Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Account Settings</CardTitle>
            <CardDescription>Manage your account details and email preferences</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-900 dark:text-white">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={user.email || ""} 
                disabled 
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-200"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This is the email associated with your account
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Email Preferences</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="research-updates" 
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600 dark:border-slate-600 dark:bg-slate-800"
                    defaultChecked
                  />
                  <Label htmlFor="research-updates" className="cursor-pointer text-slate-900 dark:text-white">Research paper updates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="product-updates" 
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600 dark:border-slate-600 dark:bg-slate-800"
                    defaultChecked
                  />
                  <Label htmlFor="product-updates" className="cursor-pointer text-slate-900 dark:text-white">Product updates and announcements</Label>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-500 dark:border-red-500 dark:hover:bg-red-900/10">
                Delete Account
              </Button>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                This will permanently delete your account and remove all your data from our systems.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}