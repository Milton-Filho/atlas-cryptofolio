"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, CheckCircle, ArrowRight, Settings, PieChart, TrendingUp, Scale, Clock, Info, RefreshCw } from 'lucide-react';
import { Holding, Insight, InsightCategory, Transaction } from '@/lib/types';
import { useLanguage } from '@/components/providers/language-provider';
import { generatePortfolioInsights } from '@/lib/api';
import { analysisService } from '@/lib/analysis';

interface InsightsViewProps {
    holdings: Holding[];
    transactions: Transaction[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({ holdings, transactions }) => {
    const { t, language } = useLanguage();
    const [insights, setInsights] = useState<Insight[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'config'>('overview');
    const [filterCategory, setFilterCategory] = useState<InsightCategory | 'all'>('all');
    const [divScore, setDivScore] = useState(0);

    // Load Analysis
    useEffect(() => {
        if (holdings.length > 0) {
            const score = analysisService.calculateDiversificationScore(holdings);
            setDivScore(score);

            // Initial Local Analysis
            const localInsights = analysisService.generateInsights(holdings, transactions);
            setInsights(localInsights);
        }
    }, [holdings, transactions]);

    // Handle AI Generate
    const handleAiGenerate = async () => {
        setIsLoading(true);
        const aiResults = await generatePortfolioInsights(holdings, language);

        const calculatedInsights = insights.filter(i => i.category !== 'ai');
        // @ts-ignore
        setInsights([...calculatedInsights, ...aiResults].sort((a, b) => (b.score || 0) - (a.score || 0)));
        setIsLoading(false);
    };

    const handleMarkAs = (id: string, status: 'read' | 'applied') => {
        // @ts-ignore
        setInsights(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    };

    const getIcon = (category: InsightCategory) => {
        switch (category) {
            case 'concentration': return <PieChart className="w-5 h-5 text-orange-500" />;
            case 'performance': return <TrendingUp className="w-5 h-5 text-emerald-500" />;
            case 'rebalancing': return <Scale className="w-5 h-5 text-blue-500" />;
            case 'temporal': return <Clock className="w-5 h-5 text-purple-500" />;
            case 'ai': return <Sparkles className="w-5 h-5 text-indigo-500" />;
            default: return <Info className="w-5 h-5 text-slate-500" />;
        }
    };

    const filteredInsights = filterCategory === 'all'
        ? insights
        : insights.filter(i => i.category === filterCategory);

    const activeInsights = filteredInsights.filter(i => i.status !== 'applied');

    if (holdings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('aiInsights')}</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">{t('noHoldingsForInsights')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('aiInsights')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('insightsSubtitle')}</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'config' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Settings className="w-4 h-4" />
                        {t('config')}
                    </button>
                </div>
            </div>

            {activeTab === 'config' ? (
                <div className="bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center animate-in zoom-in-95 duration-200">
                    <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Configuration Panel</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Set custom thresholds for concentration alerts and rebalancing triggers.</p>
                    {/* Mock Configuration Form */}
                    <div className="max-w-md mx-auto space-y-4 text-left">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Concentration Threshold (%)</label>
                            <input type="range" min="10" max="90" defaultValue="30" className="w-full mt-2 accent-primary" />
                            <div className="flex justify-between text-xs text-slate-400"><span>10%</span><span>30%</span><span>90%</span></div>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Daily Drop Alerts ({'>'}10%)</span>
                            <div className="w-11 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Diversification Score */}
                        <div className="bg-white dark:bg-card p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-medium text-slate-500 dark:text-slate-400">{t('divScore')}</h3>
                                    <PieChart className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{divScore}</span>
                                    <span className="text-sm text-slate-400 mb-1">/ 100</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${divScore > 70 ? 'bg-emerald-500' : divScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${divScore}%` }}></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    {divScore > 70 ? 'Excellent diversification.' : divScore > 40 ? 'Moderate concentration risks.' : 'High risk. Consider diversifying.'}
                                </p>
                            </div>
                        </div>

                        {/* AI Analysis Trigger */}
                        <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-lg text-white relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" /> AI Analyst
                                    </h3>
                                    <p className="text-indigo-100 text-sm max-w-md">Generate qualitative insights using Gemini 1.5 Flash. Analyze market sentiment and portfolio composition.</p>
                                </div>
                                <button
                                    onClick={handleAiGenerate}
                                    disabled={isLoading}
                                    className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
                                >
                                    {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Run Analysis'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {['all', 'concentration', 'performance', 'rebalancing', 'temporal', 'ai'].map(cat => (
                            <button
                                key={cat}
                                // @ts-ignore
                                onClick={() => setFilterCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${filterCategory === cat
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                {cat === 'all' ? t('all') : t(cat as any) || cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Insights Grid */}
                    <div className="grid gap-4">
                        {activeInsights.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500/50" />
                                <p>No active insights. Your portfolio looks healthy!</p>
                            </div>
                        ) : (
                            activeInsights.map((insight) => (
                                <div
                                    key={insight.id}
                                    className={`group bg-white dark:bg-card p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 animate-in slide-in-from-bottom-2 relative overflow-hidden`}
                                >
                                    {/* Severity Stripe */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${insight.severity === 'high' ? 'bg-red-500' : insight.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                                        }`}></div>

                                    <div className="flex items-start gap-4 pl-2">
                                        <div className={`p-3 rounded-xl flex-shrink-0 ${insight.type === 'warning' ? 'bg-orange-50 dark:bg-orange-900/20' :
                                                insight.type === 'opportunity' ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                                                    'bg-blue-50 dark:bg-blue-900/20'
                                            }`}>
                                            {getIcon(insight.category)}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                                    {t(insight.category === 'ai' ? 'aiInsights' : insight.category as any) || insight.category}
                                                    {insight.status === 'new' && <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">NEW</span>}
                                                </span>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleMarkAs(insight.id, 'read')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs" title="Dismiss">
                                                        Dismiss
                                                    </button>
                                                </div>
                                            </div>

                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{insight.title}</h4>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{insight.description}</p>

                                            {/* Action Area */}
                                            {insight.actionableData && (
                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 flex items-center justify-between border border-slate-100 dark:border-slate-700">
                                                    <div className="text-xs">
                                                        <span className="text-slate-500">Suggested Action: </span>
                                                        <span className={`font-bold uppercase ${insight.actionableData.action === 'buy' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                            {insight.actionableData.action}
                                                        </span>
                                                        {insight.actionableData.amount && (
                                                            <span className="text-slate-700 dark:text-slate-300 font-medium ml-1">
                                                                {insight.actionableData.amount.toFixed(4)} units
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleMarkAs(insight.id, 'applied')}
                                                        className="text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-md font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-1"
                                                    >
                                                        Apply <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}

                                            {!insight.actionableData && (
                                                <div className="flex justify-end pt-2">
                                                    <button
                                                        onClick={() => handleMarkAs(insight.id, 'read')}
                                                        className="text-xs text-slate-500 hover:text-primary flex items-center gap-1"
                                                    >
                                                        <CheckCircle className="w-3 h-3" /> Mark as Read
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
