"use client";

import React from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { ArrowRight, ShieldCheck, Activity, Layers, Check, X, Star, Zap, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export const LandingPage: React.FC = () => {
    const { t, language, setLanguage } = useLanguage();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const handleGetStarted = () => {
        if (isSignedIn) {
            router.push('/dashboard');
        } else {
            router.push('/sign-in');
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200 font-sans overflow-x-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full opacity-40 mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/5 blur-[100px] rounded-full opacity-30"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-50 max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 text-emerald-500 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 rounded-full"></div>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
                            <path d="M12 2L2 22H22L12 2Z" className="fill-current opacity-30" />
                            <path d="M12 6L7 17H17L12 6Z" className="fill-current" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Atlas</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 mr-4 bg-slate-800/50 rounded-full px-3 py-1 border border-slate-700">
                        <button
                            onClick={() => setLanguage('en-US')}
                            className={`text-xs font-bold uppercase transition-colors ${language === 'en-US' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >EN</button>
                        <span className="text-slate-600">|</span>
                        <button
                            onClick={() => setLanguage('pt-BR')}
                            className={`text-xs font-bold uppercase transition-colors ${language === 'pt-BR' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >PT</button>
                        <span className="text-slate-600">|</span>
                        <button
                            onClick={() => setLanguage('es-ES')}
                            className={`text-xs font-bold uppercase transition-colors ${language === 'es-ES' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >ES</button>
                    </div>
                    <Link
                        href="/sign-in"
                        className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        {t('landing_cta_login')}
                    </Link>
                    <button
                        onClick={handleGetStarted}
                        className="bg-emerald-500 text-[#020617] px-5 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        {t('landing_cta_start')}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-16 pb-24 px-6 max-w-5xl mx-auto text-center">

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both delay-100">
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                        {t('landing_hero_title')}
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
                    {t('landing_hero_sub')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both delay-300">
                    <button
                        onClick={handleGetStarted}
                        className="group relative inline-flex items-center gap-2 bg-emerald-500 text-[#020617] px-8 py-4 rounded-full text-base font-bold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-1"
                    >
                        {t('landing_cta_start')}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* Pain Points (The Problem) */}
            <section className="relative z-10 py-16 border-y border-slate-800/50 bg-[#0B0E14]">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-12">{t('landing_pain_title')}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: X, title: t('landing_pain_1'), img: "https://images.unsplash.com/photo-1543286386-713df548e9cc?auto=format&fit=crop&q=80&w=300&h=200" },
                            { icon: Activity, title: t('landing_pain_2'), img: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=300&h=200" },
                            { icon: Layers, title: t('landing_pain_3'), img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300&h=200" }
                        ].map((pain, i) => (
                            <div key={i} className="relative group overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/30 transition-all">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent z-10"></div>
                                <img src={pain.img} alt="Pain point" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center mb-4 text-red-500 border border-red-500/20">
                                        <pain.icon className="w-5 h-5" />
                                    </div>
                                    <p className="text-lg font-medium text-slate-200">{pain.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Showcase (Persona Targeted) */}
            <section className="relative z-10 py-24 max-w-7xl mx-auto px-6 space-y-32">

                {/* Feature 1: Multi-Wallet (Carlos) */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                            For Active Traders
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('landing_feat1_title')}</h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            {t('landing_feat1_desc')}
                        </p>
                        <ul className="space-y-4">
                            {['Long Term Vaults', 'DeFi Degen Wallets', 'Trading Exchange'].map(item => (
                                <li key={item} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="order-1 md:order-2 relative group">
                        <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-[#0B0E14] border border-slate-700 rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white"><Layers className="w-6 h-6" /></div>
                                    <div>
                                        <div className="h-2 w-24 bg-slate-700 rounded mb-1"></div>
                                        <div className="h-2 w-16 bg-slate-800 rounded"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                                            <div className="h-2 w-20 bg-slate-700 rounded"></div>
                                        </div>
                                        <div className="h-2 w-12 bg-emerald-500/50 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature 2: Automated P&L (Pedro) */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-[#0B0E14] border border-slate-700 rounded-2xl p-6 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">Total Net Worth</p>
                                    <h3 className="text-3xl font-bold text-white">$142,093.00</h3>
                                </div>
                                <div className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-sm font-bold">+12.5%</div>
                            </div>
                            <div className="h-32 bg-gradient-to-t from-emerald-500/10 to-transparent border-b border-emerald-500/30 relative">
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-emerald-500"></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                            For Tech Savvy Investors
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('landing_feat2_title')}</h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            {t('landing_feat2_desc')}
                        </p>
                        <ul className="space-y-4">
                            {['Real-time Calculations', 'Zero Manual Entry', 'Historical Performance'].map(item => (
                                <li key={item} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Feature 3: AI Intelligence (Marina) */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
                            For Smart Beginners
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('landing_feat3_title')}</h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            {t('landing_feat3_desc')}
                        </p>
                        <button onClick={handleGetStarted} className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-2">
                            See AI in Action <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="order-1 md:order-2 relative group">
                        <div className="absolute inset-0 bg-purple-500/20 blur-[80px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-[#0B0E14] border border-slate-700 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
                                <p className="text-sm font-bold text-white">Atlas AI Analyst</p>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <p className="text-sm text-slate-300">"Your portfolio has 65% concentration in speculative assets. Consider rebalancing into BTC."</p>
                                </div>
                                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <p className="text-sm text-slate-300">"ETH gas fees are at a 6-month low. Good time to consolidate DeFi positions."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="relative z-10 py-24 bg-[#0B0E14] border-y border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('pricing_title')}</h2>
                        <p className="text-slate-400">Start small, scale as you grow.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors relative">
                            <h3 className="text-xl font-bold text-white mb-2">{t('pricing_free_title')}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">{t('pricing_free_price')}</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {[t('pricing_free_feat1'), t('pricing_free_feat2'), t('pricing_free_feat3')].map(feat => (
                                    <li key={feat} className="flex items-center gap-3 text-slate-300">
                                        <Check className="w-5 h-5 text-slate-500" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={handleGetStarted} className="w-full py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors">
                                {t('landing_cta_start')}
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/50 rounded-2xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-emerald-500 text-[#020617] text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>

                            <h3 className="text-xl font-bold text-white mb-2">{t('pricing_pro_title')}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">{t('pricing_pro_price')}</span>
                            </div>
                            <ul className="space-y-4 mb-8 relative z-10">
                                {[t('pricing_pro_feat1'), t('pricing_pro_feat2'), t('pricing_pro_feat3')].map(feat => (
                                    <li key={feat} className="flex items-center gap-3 text-white">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-emerald-400" />
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={handleGetStarted} className="w-full py-3 rounded-xl bg-emerald-500 text-[#020617] font-bold hover:bg-emerald-400 transition-colors relative z-10 shadow-lg shadow-emerald-900/20">
                                {t('pricing_pro_cta')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="relative z-10 py-24 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { text: t('test_pedro_text'), author: "Pedro", role: t('test_pedro_role'), img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100" },
                        { text: t('test_marina_text'), author: "Marina", role: t('test_marina_role'), img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" },
                        { text: t('test_carlos_text'), author: "Carlos", role: t('test_carlos_role'), img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100" },
                    ].map((test, i) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm">
                            <div className="flex gap-1 mb-4 text-emerald-400">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-slate-300 mb-6 leading-relaxed">"{test.text}"</p>
                            <div className="flex items-center gap-4">
                                <img src={test.img} alt={test.author} className="w-10 h-10 rounded-full grayscale" />
                                <div>
                                    <p className="text-white font-bold text-sm">{test.author}</p>
                                    <p className="text-slate-500 text-xs">{test.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-800/50 bg-[#01040F] py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="mb-12">
                        <p className="text-slate-500 text-sm font-medium tracking-wide uppercase mb-6">{t('landing_proof')}</p>
                        <div className="flex justify-center gap-8 opacity-30 grayscale items-center">
                            <div className="flex items-center gap-2 font-bold text-xl text-white"><ShieldCheck /> SecureProto</div>
                            <div className="flex items-center gap-2 font-bold text-xl text-white"><Activity /> ChainTrak</div>
                            <div className="flex items-center gap-2 font-bold text-xl text-white"><Users /> InvestDAO</div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">{t('landing_footer_text')}</h2>

                    <button
                        onClick={handleGetStarted}
                        className="text-emerald-400 hover:text-emerald-300 font-medium text-lg hover:underline decoration-emerald-500/30 underline-offset-4 transition-all"
                    >
                        {t('landing_cta_start')}
                    </button>

                    <div className="mt-20 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
                        <p>{t('landing_footer_rights')}</p>
                        <div className="flex gap-6">
                            <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
                            <span className="hover:text-slate-400 cursor-pointer">Terms</span>
                            <span className="hover:text-slate-400 cursor-pointer">Security</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
