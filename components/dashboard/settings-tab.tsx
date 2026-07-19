"use client";

import React, { useState, useRef } from "react";
import { Loader2, Key, AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const isValidUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://");
const supabaseUrl = isValidUrl ? rawUrl : "https://bojrzupqvenjmipuzanq.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
const supabase = createClient(supabaseUrl, supabaseKey);

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

  // Account Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Notification States
  const [notifyRsvp, setNotifyRsvp] = useState(true);
  const [notifyComment, setNotifyComment] = useState(true);
  const [notifyReminders, setNotifyReminders] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);

  // Appearance States
  const [accentColor, setAccentColor] = useState("amber");

  // Integrations States
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(true);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [zoomConnected, setZoomConnected] = useState(false);
  
  // Danger Zone States
  const [confirmDeleteUsername, setConfirmDeleteUsername] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully!");
    }, 1500);
  };

  const handleNotificationsSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification preferences saved successfully!");
  };

  const handleAppearanceSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Appearance configurations applied!");
  };

  const handleAccountDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmDeleteUsername !== profileEmail) {
      toast.error("Confirmation email does not match your current email address.");
      return;
    }

    setIsDeletingAccount(true);
    setTimeout(() => {
      setIsDeletingAccount(false);
      setShowDeleteModal(false);
      toast.success("Account deleted successfully. Logging you out...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }, 2000);
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
        ) : settingsActiveTab === "account" ? (
          <div className="space-y-6">
            <div className={`border border-solid rounded-3xl p-6 sm:p-8 space-y-4 ${cardBg} shadow-md`}>
              <h2 className={`font-serif text-lg font-bold ${titleCol}`}>Account Settings</h2>
              <p className="text-zinc-550 text-[11px] font-semibold">Manage your authentication and account properties</p>
              
              <div className="border-t border-solid border-white/5 pt-4 space-y-3 text-xs font-semibold">
                <div className="flex justify-between py-2 border-b border-solid border-white/5">
                  <span className="text-zinc-455">Account ID</span>
                  <span className={`font-mono ${titleCol}`}>{currentUser?.id || "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-solid border-white/5">
                  <span className="text-zinc-455">Account Status</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
                <div className="flex justify-between py-2 border-b border-solid border-white/5">
                  <span className="text-zinc-455">Login Provider</span>
                  <span className={`capitalize ${titleCol}`}>Email / Password</span>
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className={`border border-solid rounded-3xl p-6 sm:p-8 space-y-6 ${cardBg} shadow-md`}>
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className={`font-serif text-sm font-bold ${titleCol}`}>Change Password</h3>
                  <p className="text-zinc-555 text-[10px] font-semibold">Update your account password</p>
                </div>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500">Current Password</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-neutral-950 border-white/5 text-zinc-200"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-neutral-950 border-white/5 text-zinc-200"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-neutral-950 border-white/5 text-zinc-200"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-solid border-white/5">
                <Button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-5 h-9 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs border-0 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  {isUpdatingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        ) : settingsActiveTab === "notifications" ? (
          <form onSubmit={handleNotificationsSave} className={`border border-solid rounded-3xl p-6 sm:p-8 space-y-6 ${cardBg} shadow-md`}>
            <div>
              <h2 className={`font-serif text-lg font-bold ${titleCol}`}>Notification Settings</h2>
              <p className="text-zinc-550 text-[11px] font-semibold">Choose how and when you want to receive updates</p>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-start gap-3 p-3 rounded-xl border border-solid border-white/5 bg-neutral-900/20">
                <input
                  type="checkbox"
                  id="notifyRsvp"
                  checked={notifyRsvp}
                  onChange={(e) => setNotifyRsvp(e.target.checked)}
                  className="mt-1 size-4 rounded bg-neutral-955 border-white/10 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="notifyRsvp" className="flex flex-col gap-0.5 cursor-pointer text-left">
                  <span className={`font-bold ${titleCol}`}>RSVP Notifications</span>
                  <span className="text-[10px] text-zinc-555 font-medium">Receive real-time emails when guests respond to your invitations.</span>
                </label>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl border border-solid border-white/5 bg-neutral-900/20">
                <input
                  type="checkbox"
                  id="notifyComment"
                  checked={notifyComment}
                  onChange={(e) => setNotifyComment(e.target.checked)}
                  className="mt-1 size-4 rounded bg-neutral-955 border-white/10 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="notifyComment" className="flex flex-col gap-0.5 cursor-pointer text-left">
                  <span className={`font-bold ${titleCol}`}>Comments & Greetings</span>
                  <span className="text-[10px] text-zinc-555 font-medium">Get notified when guests add notes or write in the guestbook.</span>
                </label>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl border border-solid border-white/5 bg-neutral-900/20">
                <input
                  type="checkbox"
                  id="notifyReminders"
                  checked={notifyReminders}
                  onChange={(e) => setNotifyReminders(e.target.checked)}
                  className="mt-1 size-4 rounded bg-neutral-955 border-white/10 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="notifyReminders" className="flex flex-col gap-0.5 cursor-pointer text-left">
                  <span className={`font-bold ${titleCol}`}>Event Reminders</span>
                  <span className="text-[10px] text-zinc-555 font-medium">Get automated countdown updates and alerts as the event date approaches.</span>
                </label>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl border border-solid border-white/5 bg-neutral-900/20">
                <input
                  type="checkbox"
                  id="notifyMarketing"
                  checked={notifyMarketing}
                  onChange={(e) => setNotifyMarketing(e.target.checked)}
                  className="mt-1 size-4 rounded bg-neutral-955 border-white/10 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="notifyMarketing" className="flex flex-col gap-0.5 cursor-pointer text-left">
                  <span className={`font-bold ${titleCol}`}>Platform Updates & Offers</span>
                  <span className="text-[10px] text-zinc-555 font-medium">Receive newsletters, style tips, and updates about new invitation themes.</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-solid border-white/5">
              <Button
                type="submit"
                className="px-5 h-9 bg-amber-500 hover:bg-amber-600 text-neutral-955 font-bold text-xs border-0 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                Save Preferences
              </Button>
            </div>
          </form>
        ) : settingsActiveTab === "appearance" ? (
          <form onSubmit={handleAppearanceSave} className={`border border-solid rounded-3xl p-6 sm:p-8 space-y-6 ${cardBg} shadow-md`}>
            <div>
              <h2 className={`font-serif text-lg font-bold ${titleCol}`}>Appearance Settings</h2>
              <p className="text-zinc-550 text-[11px] font-semibold">Customize Kinvite's interface styling preferences</p>
            </div>

            <div className="space-y-6 text-xs font-semibold">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500">Interface Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => toast.info("Toggle the app theme using the sun/moon button in the top header!")}
                    className={`p-4 rounded-2xl border border-solid text-center cursor-pointer transition-all ${
                      theme === "dark" ? "border-amber-500 bg-neutral-950" : "border-white/5 bg-neutral-900/20"
                    }`}
                  >
                    <span className="block text-xl mb-1">🌙</span>
                    <span className={`font-bold text-xs ${titleCol}`}>Dark Mode</span>
                  </div>
                  <div 
                    onClick={() => toast.info("Toggle the app theme using the sun/moon button in the top header!")}
                    className={`p-4 rounded-2xl border border-solid text-center cursor-pointer transition-all ${
                      theme === "light" ? "border-zinc-350 bg-zinc-100" : "border-white/5 bg-neutral-900/20"
                    }`}
                  >
                    <span className="block text-xl mb-1">☀️</span>
                    <span className={`font-bold text-xs ${titleCol}`}>Light Mode</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500">Accent Color</label>
                <div className="flex gap-3">
                  {[
                    { id: "amber", class: "bg-amber-500" },
                    { id: "emerald", class: "bg-emerald-500" },
                    { id: "indigo", class: "bg-indigo-500" },
                    { id: "rose", class: "bg-rose-500" },
                    { id: "slate", class: "bg-slate-500" }
                  ].map((color) => {
                    const isSelected = accentColor === color.id;
                    return (
                      <button
                        type="button"
                        key={color.id}
                        onClick={() => setAccentColor(color.id)}
                        className={`size-8 rounded-full flex items-center justify-center border-2 border-solid cursor-pointer transition-all ${
                          isSelected ? "border-white scale-110" : "border-transparent opacity-80 hover:opacity-100"
                        } ${color.class}`}
                      >
                        {isSelected && <Check className="w-4 h-4 text-black font-extrabold" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-solid border-white/5">
              <Button
                type="submit"
                className="px-5 h-9 bg-amber-500 hover:bg-amber-600 text-neutral-955 font-bold text-xs border-0 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                Apply Style
              </Button>
            </div>
          </form>
        ) : settingsActiveTab === "billing" ? (
          <div className="space-y-6">
            <div className={`border border-solid rounded-3xl p-6 sm:p-8 space-y-6 ${cardBg} shadow-md`}>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className={`font-serif text-lg font-bold ${titleCol}`}>Billing & Subscription</h2>
                  <p className="text-zinc-550 text-[11px] font-semibold">Manage your subscription plans and billing cycles</p>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full animate-pulse">
                  Pro Plan Active
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-600/5 border border-solid border-amber-500/25 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1 font-semibold text-left">
                  <span className={`block font-serif text-base ${titleCol}`}>Kinvite Premium Membership</span>
                  <span className="text-xs text-zinc-555 block font-medium">Active • $12.00 billed monthly (Renews August 14, 2026)</span>
                  <span className="text-[10px] text-zinc-450 block">Payment Method: Visa ending in 4242</span>
                </div>
                <Button 
                  onClick={() => toast.info("Contacting billing partner portal...")}
                  className="bg-white hover:bg-zinc-150 text-neutral-950 font-bold text-xs h-9 px-4 rounded-lg cursor-pointer border-0 shadow"
                >
                  Manage Payment
                </Button>
              </div>
            </div>

            <div className={`border border-solid rounded-3xl p-6 sm:p-8 space-y-4 ${cardBg} shadow-md`}>
              <h3 className={`font-serif text-sm font-bold ${titleCol}`}>Invoice History</h3>
              <div className="overflow-x-auto text-left font-semibold text-xs">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-solid border-white/5 text-[9px] uppercase tracking-wider text-zinc-500 text-left">
                      <th className="py-2.5">Invoice ID</th>
                      <th className="py-2.5">Billing Date</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-solid divide-white/5 text-zinc-350">
                    <tr>
                      <td className="py-3 font-mono">INV-849201</td>
                      <td className="py-3">Jul 14, 2026</td>
                      <td className="py-3 font-bold text-white">$12.00</td>
                      <td className="py-3"><span className="text-emerald-400 font-bold">Paid</span></td>
                      <td className="py-3 text-right"><button onClick={() => toast.success("Downloading PDF Receipt...")} className="text-amber-500 hover:underline bg-transparent border-0 cursor-pointer text-xs font-bold">Download</button></td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono">INV-732941</td>
                      <td className="py-3">Jun 14, 2026</td>
                      <td className="py-3 font-bold text-white">$12.00</td>
                      <td className="py-3"><span className="text-emerald-400 font-bold">Paid</span></td>
                      <td className="py-3 text-right"><button onClick={() => toast.success("Downloading PDF Receipt...")} className="text-amber-500 hover:underline bg-transparent border-0 cursor-pointer text-xs font-bold">Download</button></td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono">INV-628105</td>
                      <td className="py-3">May 14, 2026</td>
                      <td className="py-3 font-bold text-white">$12.00</td>
                      <td className="py-3"><span className="text-emerald-400 font-bold">Paid</span></td>
                      <td className="py-3 text-right"><button onClick={() => toast.success("Downloading PDF Receipt...")} className="text-amber-500 hover:underline bg-transparent border-0 cursor-pointer text-xs font-bold">Download</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : settingsActiveTab === "integrations" ? (
          <div className={`border border-solid rounded-3xl p-6 sm:p-8 space-y-6 ${cardBg} shadow-md`}>
            <div>
              <h2 className={`font-serif text-lg font-bold ${titleCol}`}>Integrations & Add-ons</h2>
              <p className="text-zinc-550 text-[11px] font-semibold">Sync Kinvite with external calendar, meeting, and messenger services</p>
            </div>

            <div className="space-y-4 font-bold text-xs">
              <div className="flex justify-between items-center flex-wrap gap-4 p-4 rounded-2xl border border-solid border-white/5 bg-neutral-900/20 text-left">
                <div className="space-y-1 font-semibold">
                  <span className={`font-serif text-sm block ${titleCol}`}>Google Calendar Sync</span>
                  <span className="text-[10px] text-zinc-555 block font-medium">Automatically sync event dates and RSVP rosters to your calendar.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Connected</span>
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleCalendarConnected(false);
                      toast.success("Google Calendar disconnected.");
                    }}
                    className="text-[10px] font-bold text-red-500 hover:underline border-0 bg-transparent cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center flex-wrap gap-4 p-4 rounded-2xl border border-solid border-white/5 bg-neutral-900/20 text-left">
                <div className="space-y-1 font-semibold">
                  <span className={`font-serif text-sm block ${titleCol}`}>WhatsApp RSVP Assistant</span>
                  <span className="text-[10px] text-zinc-555 block font-medium">Send automated invite cards and reminders to guest phone numbers.</span>
                </div>
                {whatsappConnected ? (
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Connected</span>
                    <button
                      type="button"
                      onClick={() => {
                        setWhatsappConnected(false);
                        toast.success("WhatsApp sync disconnected.");
                      }}
                      className="text-[10px] font-bold text-red-500 hover:underline border-0 bg-transparent cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setWhatsappConnected(true);
                      toast.success("WhatsApp RSVP assistant configured!");
                    }}
                    className="px-3.5 h-8 bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-[10px] rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center flex-wrap gap-4 p-4 rounded-2xl border border-solid border-white/5 bg-neutral-900/20 text-left">
                <div className="space-y-1 font-semibold">
                  <span className={`font-serif text-sm block ${titleCol}`}>Zoom Webinar Link</span>
                  <span className="text-[10px] text-zinc-555 block font-medium">Create and embed virtual live meeting links inside the digital invites.</span>
                </div>
                {zoomConnected ? (
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Connected</span>
                    <button
                      type="button"
                      onClick={() => {
                        setZoomConnected(false);
                        toast.success("Zoom integration disconnected.");
                      }}
                      className="text-[10px] font-bold text-red-500 hover:underline border-0 bg-transparent cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setZoomConnected(true);
                      toast.success("Zoom webinar meetings sync set up!");
                    }}
                    className="px-3.5 h-8 bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-[10px] rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={`border border-red-500/25 rounded-3xl p-6 sm:p-8 space-y-6 ${cardBg} shadow-md`}>
            <div>
              <h2 className="font-serif text-lg font-bold text-red-500">Danger Zone</h2>
              <p className="text-zinc-550 text-[11px] font-semibold">Destructive settings and account teardown options</p>
            </div>

            <div className="p-5 rounded-2xl border border-solid border-red-500/25 bg-red-950/10 text-left space-y-4 text-xs font-semibold">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-red-400 font-bold text-sm block">Delete Your Account</span>
                  <span className="text-[10px] text-zinc-455 block leading-relaxed font-medium">
                    Once you delete your profile, all your created events, guest invitations, RSVPs, and relationship trees will be permanently removed. This action is irreversible.
                  </span>
                </div>
              </div>
              <div className="border-t border-solid border-red-500/20 pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs border-0 rounded-lg cursor-pointer transition-colors shadow-lg shadow-red-500/10"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {showDeleteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <form 
                  onSubmit={handleAccountDelete}
                  className={`max-w-md w-full border border-solid rounded-3xl p-6 space-y-5 text-left ${cardBg} shadow-2xl animate-fade`}
                >
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-serif text-sm font-bold">Are you absolutely sure?</h3>
                  </div>
                  <p className="text-zinc-350 text-[11px] font-semibold leading-relaxed">
                    This action will permanently terminate the Kinvite account associated with <span className="font-bold text-white">{profileEmail}</span>. Please type your email address below to confirm deletion:
                  </p>
                  
                  <div className="flex flex-col gap-1.5 text-xs font-semibold">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500">Email Address</label>
                    <Input
                      type="email"
                      value={confirmDeleteUsername}
                      onChange={(e) => setConfirmDeleteUsername(e.target.value)}
                      placeholder={profileEmail}
                      className="bg-neutral-950 border-white/10 text-zinc-200"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-solid border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteModal(false);
                        setConfirmDeleteUsername("");
                      }}
                      className="px-4 h-9 bg-zinc-800 hover:bg-zinc-750 text-xs font-bold rounded-lg text-zinc-350 border-0 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isDeletingAccount}
                      className="px-5 h-9 bg-red-600 hover:bg-red-700 text-white font-bold text-xs border-0 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-500/10"
                    >
                      {isDeletingAccount && <Loader2 className="w-4 h-4 animate-spin" />}
                      Permanently Delete
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
