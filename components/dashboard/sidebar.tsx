"use client";

import React from "react";
import { 
  Heart, X, LayoutDashboard, Mail, Users, Palette, Bell, Settings 
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { KinviteLogo } from "@/components/KinviteLogo";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: "light" | "dark";
  profileName: string;
  profilePlan: string;
  profileImage: string | null;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  theme,
  profileName,
  profilePlan,
  profileImage,
  mobileMenuOpen,
  setMobileMenuOpen,
}: SidebarProps) {
  // Theme styling constants
  const sidebarBg = theme === "dark" ? "bg-neutral-950 border-white/5" : "bg-white border-zinc-200";
  const borderCol = theme === "dark" ? "border-white/5" : "border-zinc-200";

  const navigationTabs = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "My Invitations", icon: Mail },
    { id: "guests", label: "Guests", icon: Users },
    { id: "templates", label: "Templates", icon: Palette },
    { id: "reminders", label: "Reminders", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-screen w-64 ${sidebarBg} flex flex-col justify-between z-50 transition-all duration-300 md:translate-x-0 shrink-0 border-r border-solid ${
      mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
    }`}>
      <div className="flex flex-col flex-1 py-6 overflow-y-auto">
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center justify-between">
          <KinviteLogo className="h-8 w-auto" showText={true} theme={theme} />
          <button
            className={`md:hidden p-1 cursor-pointer ${theme === "dark" ? "text-zinc-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 space-y-1">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 py-3 text-sm font-medium transition-all duration-300 rounded-xl cursor-pointer select-none border-l-4 ${
                  isActive
                    ? theme === "dark"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500 font-bold shadow-lg shadow-amber-500/5 pl-3"
                      : "bg-neutral-100 text-neutral-950 border-neutral-950 font-bold pl-3"
                    : theme === "dark"
                      ? "text-zinc-400 hover:text-amber-400 hover:bg-amber-500/5 hover:pl-3 pl-4 border-transparent"
                      : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 hover:pl-3 pl-4 border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? (theme === "dark" ? "text-amber-400" : "text-neutral-950") : "text-zinc-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile section */}
      <div className={`p-4 border-t border-solid flex flex-col gap-4 ${borderCol} ${
        theme === "dark" ? "bg-neutral-900/80" : "bg-zinc-50/80"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 px-2 min-w-0">
            {profileImage ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/25 bg-zinc-900 shadow-md shrink-0">
                <img 
                  src={profileImage} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-neutral-950 font-bold shadow-md shrink-0">
                {profileName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col min-w-0 text-left">
              <span className={`text-sm font-semibold truncate ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>{profileName}</span>
              <span className="text-[10px] text-amber-600 uppercase tracking-wider font-semibold">
                {profilePlan} Plan
              </span>
            </div>
          </div>
          
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
