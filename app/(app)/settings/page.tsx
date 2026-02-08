"use client";

import React from 'react';
import { Settings, User, Bell, Shield, Wallet, CreditCard, LogOut } from 'lucide-react';
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useTheme } from 'next-themes';
import { useLanguage } from '@/components/providers/language-provider';

export default function SettingsPage() {
    const { user } = useUser();
    const { theme, setTheme } = useTheme();
    const { t, language, setLanguage } = useLanguage();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and application settings.</p>
            </div>

            <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <img
                            src={user?.imageUrl}
                            alt="Profile"
                            className="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-700"
                        />
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.fullName}</h2>
                            <p className="text-slate-500 dark:text-slate-400">{user?.primaryEmailAddress?.emailAddress}</p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Appearance */}
                    <div className="p-6 space-y-4">
                        <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Appearance & Language
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Theme</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        Light
                                    </button>
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        Dark
                                    </button>
                                    <button
                                        onClick={() => setTheme('system')}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${theme === 'system' ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white' : 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        System
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Language</label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as any)}
                                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="en-US">English (US)</option>
                                    <option value="pt-BR">Português (BR)</option>
                                    <option value="es-ES">Español (ES)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="p-6">
                        <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Account
                        </h3>
                        <div className="flex flex-col gap-2">
                            <SignOutButton>
                                <button className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-fit">
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </SignOutButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
