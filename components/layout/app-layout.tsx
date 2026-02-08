"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, ArrowRightLeft, Newspaper, Settings, Bell, Search, Menu, LogOut, Briefcase, Sun, Moon, Globe, ChevronDown, Check, Users, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/components/providers/language-provider';
import { useUser, useClerk, useOrganization, useOrganizationList } from '@clerk/nextjs';
import { Skeleton } from '@/components/ui/skeleton'; // I might need to create this or use simple loading fallback

// SidebarItem Component
const SidebarItem = ({ icon: Icon, label, active, href, onClick }: { icon: any, label: string, active: boolean, href: string, onClick?: () => void }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${active
                ? 'bg-primary/10 text-primary'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
    >
        <Icon className="w-5 h-5 mr-3" />
        {label}
    </Link>
);

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);

    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const pathname = usePathname();

    const { user, isLoaded: isUserLoaded } = useUser();
    const { signOut } = useClerk();
    const { organization: currentOrganization, isLoaded: isOrgLoaded } = useOrganization();
    const { userMemberships, isLoaded: isMembershipsLoaded, setActive } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname === '/') return true;
        return pathname?.startsWith(path);
    };

    const handleSwitchOrg = (orgId: string | null) => {
        if (!setActive) return;
        if (orgId) {
            setActive({ organization: orgId });
        } else {
            setActive({ organization: null }); // Switch to personal account? Clerk handles this differently usually. 
            // Clerk usually implies Personal Account if no Org is active, but we need to check how to "deactivate" org.
            // setActive({ organization: null }) works to switch to personal context in some versions, or we use navigation.
            // Actually OrganizationSwitcher handles this. Let's try passing null/undefined if documentation says so, or use organizationList to switch.
            // For now, assuming setActive({ organization: null }) switches to personal.
            setActive({ organization: null });
        }
        setIsOrgMenuOpen(false);
    };

    if (!isUserLoaded || !isOrgLoaded) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background flex font-sans transition-colors duration-200">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-card fixed h-full z-10 transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    {/* Custom Atlas Logo */}
                    <div className="w-8 h-8 text-primary flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <path d="M12 2L2 22H22L12 2Z" className="fill-current opacity-20" />
                            <path d="M12 6L7 17H17L12 6Z" className="fill-current" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Atlas</span>
                </div>

                {/* Organization / User Switcher */}
                <div className="px-4 mt-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
                            className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                    {currentOrganization ? (currentOrganization.imageUrl ? <img src={currentOrganization.imageUrl} alt={currentOrganization.name} className="w-full h-full object-cover rounded-md" /> : currentOrganization.name[0]) : (user?.firstName?.[0] || 'U')}
                                </div>
                                <div className="text-left truncate">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {currentOrganization ? currentOrganization.name : 'Personal View'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {/* Role logic requires fetching membership, simplifiying for now */}
                                        {currentOrganization ? 'Member' : 'Owner'}
                                    </p>
                                </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                        </button>

                        {isOrgMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsOrgMenuOpen(false)}></div>
                                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                                    <div className="p-2">
                                        <p className="text-xs font-semibold text-slate-400 px-2 py-1 uppercase">Personal</p>
                                        <button
                                            onClick={() => handleSwitchOrg(null)}
                                            className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm ${!currentOrganization ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                        >
                                            <div className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                                <User className="w-3 h-3 text-slate-500 dark:text-slate-300" />
                                            </div>
                                            <span className="dark:text-white flex-1 text-left">My Portfolio</span>
                                            {!currentOrganization && <Check className="w-3 h-3 text-primary" />}
                                        </button>

                                        {(userMemberships?.data?.length || 0) > 0 && (
                                            <>
                                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
                                                <p className="text-xs font-semibold text-slate-400 px-2 py-1 uppercase">Organizations</p>
                                                {userMemberships?.data?.map(mem => (
                                                    <button
                                                        key={mem.organization.id}
                                                        onClick={() => handleSwitchOrg(mem.organization.id)}
                                                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm ${currentOrganization?.id === mem.organization.id ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                                    >
                                                        <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-xs overflow-hidden">
                                                            {mem.organization.imageUrl ? <img src={mem.organization.imageUrl} alt={mem.organization.name} className="w-full h-full object-cover" /> : mem.organization.name[0]}
                                                        </div>
                                                        <span className="dark:text-white flex-1 text-left truncate">{mem.organization.name}</span>
                                                        {currentOrganization?.id === mem.organization.id && <Check className="w-3 h-3 text-primary" />}
                                                    </button>
                                                ))}
                                            </>
                                        )}

                                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
                                        <Link href="/create-organization" className="w-full flex items-center gap-2 px-2 py-2 text-xs font-medium text-slate-500 hover:text-primary transition-colors">
                                            <Users className="w-3 h-3" />
                                            Create Organization
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <div className="mb-6">
                        <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t('platform')}</p>
                        <SidebarItem icon={LayoutDashboard} label={t('dashboard')} active={isActive('/dashboard')} href="/dashboard" />
                        <SidebarItem icon={Wallet} label={t('wallets')} active={isActive('/wallets')} href="/wallets" />
                        <SidebarItem icon={ArrowRightLeft} label={t('transactions')} active={isActive('/transactions')} href="/transactions" />
                        <SidebarItem icon={Briefcase} label={t('insights')} active={isActive('/insights')} href="/insights" />
                    </div>

                    <div>
                        <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t('resources')}</p>
                        <SidebarItem icon={Newspaper} label={t('news')} active={isActive('/news')} href="/news" />
                        <SidebarItem icon={Settings} label={t('settings')} active={isActive('/settings')} href="/settings" />
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => signOut()}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        {t('signOut')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-card border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-md w-64 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search assets..."
                                className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            title="Toggle Theme"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full flex items-center gap-1"
                            >
                                <Globe className="w-5 h-5" />
                                <span className="text-xs font-medium uppercase">{language.split('-')[0]}</span>
                            </button>
                            {isLangMenuOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-card rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-30">
                                    {[
                                        { code: 'en-US', label: 'English' },
                                        { code: 'pt-BR', label: 'Português' },
                                        { code: 'es-ES', label: 'Español' }
                                    ].map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code as any);
                                                setIsLangMenuOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${language === lang.code
                                                    ? 'text-primary font-medium'
                                                    : 'text-slate-700 dark:text-slate-300'
                                                }`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                            </button>
                        </div>

                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.fullName || user?.username || 'Guest'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{currentOrganization ? currentOrganization.name : 'Personal'}</p>
                            </div>
                            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600">
                                <img src={user?.imageUrl || "https://picsum.photos/100/100"} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-50 bg-slate-900/50" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="bg-white dark:bg-card w-64 h-full shadow-xl p-4" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 text-primary flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                            <path d="M12 2L2 22H22L12 2Z" className="fill-current opacity-20" />
                                            <path d="M12 6L7 17H17L12 6Z" className="fill-current" />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-bold dark:text-white">Atlas</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="dark:text-white">
                                    <Menu className="w-6 h-6" />
                                </button>
                            </div>
                            <SidebarItem icon={LayoutDashboard} label={t('dashboard')} active={isActive('/dashboard')} href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                            <SidebarItem icon={Wallet} label={t('wallets')} active={isActive('/wallets')} href="/wallets" onClick={() => setIsMobileMenuOpen(false)} />
                            <SidebarItem icon={ArrowRightLeft} label={t('transactions')} active={isActive('/transactions')} href="/transactions" onClick={() => setIsMobileMenuOpen(false)} />
                            <SidebarItem icon={Briefcase} label={t('insights')} active={isActive('/insights')} href="/insights" onClick={() => setIsMobileMenuOpen(false)} />
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50 dark:bg-background transition-colors">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
