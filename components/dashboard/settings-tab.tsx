"use client";

import React, { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseKey || "placeholder");

interface SettingsTabProps {
  theme: "light" | "dark";
  currentUser: any;
  onUpdateSettings: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
    image: string | null;
  }) => Promise<void>;
  isUpdatingSettings: boolean;
}

export default function SettingsTab({
  theme,
  currentUser,
  onUpdateSettings,
  isUpdatingSettings,
}: SettingsTabProps) {
  const [settingsActiveTab, setSettingsActiveTab] = useState("profile");

  const nameParts = (currentUser?.name || "").split(" ");
  const defaultFirstName = nameParts[0] || "";
  const defaultLastName = nameParts.slice(1).join(" ") || "";

  // Local settings form states
  const [profileFirstName, setProfileFirstName] = useState(defaultFirstName);
  const [profileLastName, setProfileLastName] = useState(defaultLastName);
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "");
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || "");
  const [profileBio, setProfileBio] = useState(currentUser?.bio || "");
  const [profileLocation, setProfileLocation] = useState(currentUser?.location || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUser?.image || null);
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Theme styling constants
  const cardBg = theme === "dark" ? "bg-neutral-905 border-white/5" : "bg-white border-zinc-200";
  const titleCol = theme === "dark" ? "text-white" : "text-neutral-900";
  const inputBg = theme === "dark" ? "bg-neutral-950 border-white/10 text-white" : "bg-zinc-50 border-neutral-250 text-neutral-900";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser?.id || 'avatar'}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: true
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(urlData.publicUrl);
      toast.success("Avatar image uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!avatarUrl) return;

    try {
      const parts = avatarUrl.split('/');
      const fileName = parts[parts.length - 1];

      if (fileName && !fileName.includes('placeholder')) {
        await supabase.storage.from('avatars').remove([fileName]);
      }
    } catch (err) {
      console.error("Failed to delete file from storage:", err);
    }

    setAvatarUrl(null);
    toast.success("Avatar photo removed. Click Save Changes to apply.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings({
      firstName: profileFirstName,
      lastName: profileLastName,
      email: profileEmail,
      phone: profilePhone,
      bio: profileBio,
      location: profileLocation,
      image: avatarUrl
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade text-left font-semibold">
      {/* Left Column Settings Menu */}
      <div className={`md:col-span-1 border border-solid rounded-3xl p-4 h-fit space-y-1 ${cardBg}`}>
        {[
          { id: "profile", label: "Profile" },
          { id: "account", label: "Account" },
          { id: "notifications", label: "Notifications" },
          { id: "appearance", label: "Appearance" },
          { id: "billing", label: "Billing" },
          { id: "integrations", label: "Integrations" },
          { id: "danger", label: "Danger Zone" }
        ].map((menuItem) => (
          <button
            key={menuItem.id}
            onClick={() => setSettingsActiveTab(menuItem.id)}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-300 border-0 cursor-pointer select-none bg-transparent ${
              settingsActiveTab === menuItem.id
                ? theme === "dark"
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-neutral-100 text-neutral-950"
                : menuItem.id === "danger"
                  ? "text-red-500 hover:bg-red-500/10"
                  : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {menuItem.label}
          </button>
        ))}
      </div>

      {/* Right Column Details */}
      <div className="md:col-span-3">
        {settingsActiveTab === "profile" ? (
          <form onSubmit={handleSubmit} className={`border border-solid rounded-3xl p-6 sm:p-8 space-y-6 ${cardBg} shadow-md`}>
            <div>
              <h2 className={`font-serif text-lg font-bold ${titleCol}`}>Profile Settings</h2>
              <p className="text-zinc-550 text-[11px] font-semibold">Manage your personal information</p>
            </div>

            {/* Initials avatar photo selection */}
            <div className="flex items-center gap-4 border-b border-solid pb-4 border-white/5">
              {avatarUrl ? (
                <div className="size-14 rounded-full overflow-hidden border border-amber-500/20 bg-zinc-900 relative shrink-0 shadow">
                  <img 
                    src={avatarUrl} 
                    alt="User avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="size-14 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-serif text-xl font-bold shrink-0">
                  {((profileFirstName[0] || "") + (profileLastName[0] || "")).toUpperCase()}
                </div>
              )}
              <div className="text-left space-y-1.5 font-semibold">
                <span className={`font-bold block text-sm ${titleCol}`}>{profileFirstName} {profileLastName}</span>
                <span className="text-xs text-zinc-550 block">{profileEmail}</span>
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" 
                    className="hidden" 
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-[10px] rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {avatarUrl ? "Change Photo" : "Upload Photo"}
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      className="px-3 py-1 bg-red-950/40 border border-red-900/50 text-red-400 font-bold text-[10px] rounded-lg cursor-pointer hover:bg-red-900/40 transition-colors"
                    >
                      Delete Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Fields form */}
            <div className="space-y-4 text-xs font-semibold">
              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500">First Name</label>
                  <Input
                    type="text"
                    value={profileFirstName}
                    onChange={(e) => setProfileFirstName(e.target.value)}
                    className="bg-neutral-950 border-white/5 text-zinc-200"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500">Last Name</label>
                  <Input
                    type="text"
                    value={profileLastName}
                    onChange={(e) => setProfileLastName(e.target.value)}
                    className="bg-neutral-950 border-white/5 text-zinc-200"
                    required
                  />
                </div>
              </div>

              {/* Contact fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500">Email Address</label>
                  <Input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="bg-neutral-950 border-white/5 text-zinc-200"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500">Phone Number</label>
                  <Input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="bg-neutral-950 border-white/5 text-zinc-200"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500">Bio</label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Tell guests a little about yourself..."
                  className={`w-full p-3 text-xs rounded-lg border border-solid border-white/5 outline-none resize-none focus:border-amber-500 ${inputBg}`}
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500">Location</label>
                <Input
                  type="text"
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                  className="bg-neutral-950 border-white/5 text-zinc-200"
                />
              </div>
            </div>

            {/* Connected Accounts */}
            <div className="border-t border-solid border-white/5 pt-4 space-y-4 font-bold">
              <h3 className={`font-bold text-xs ${titleCol}`}>Connected Accounts</h3>
              <div className="space-y-3 font-semibold">
                <div className="flex justify-between items-center text-xs p-3 rounded-xl border border-solid border-white/5 bg-neutral-900/20">
                  <span className={`font-bold ${titleCol}`}>Google</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Connected</span>
                    <button
                      type="button"
                      onClick={() => toast.info("Disconnecting Google account...")}
                      className="text-[10px] font-bold text-red-505 hover:underline border-0 bg-transparent cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs p-3 rounded-xl border border-solid border-white/5 bg-neutral-900/20">
                  <span className={`font-bold ${titleCol}`}>Facebook</span>
                  <button
                    type="button"
                    onClick={() => toast.info("Connecting Facebook account...")}
                    className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-[10px] rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-solid border-white/5">
              <Button
                type="button"
                onClick={() => toast.info("Settings changes discarded.")}
                className="px-4 h-9 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold rounded-lg text-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingSettings}
                className="px-5 h-9 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs border-0 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                {isUpdatingSettings && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className={`border border-solid rounded-3xl p-8 text-center text-zinc-500 font-light ${cardBg} shadow-md`}>
            This sub-section panel is currently configured. Options can be saved dynamically.
          </div>
        )}
      </div>
    </div>
  );
}
