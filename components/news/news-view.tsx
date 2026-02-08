"use client";

import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, RefreshCw, Search } from 'lucide-react';
import { NewsItem, Holding } from '@/lib/types';
import { useLanguage } from '@/components/providers/language-provider';
import { fetchCryptoNews } from '@/lib/api';

interface NewsViewProps {
    holdings: Holding[];
}

export const NewsView: React.FC<NewsViewProps> = ({ holdings }) => {
    const { t, language } = useLanguage();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Extract unique asset names
    const assetNames = Array.from(new Set(holdings.map(h => h.asset.name))) as string[];

    const loadNews = async () => {
        setIsLoading(true);
        const results = await fetchCryptoNews(assetNames, language);
        setNews(results);
        setIsLoading(false);
    };

    // Auto-load on first mount if not loaded
    useEffect(() => {
        if (news.length === 0 && !isLoading) {
            loadNews();
        }
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('news')}</h1>
                        <Newspaper className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">{t('newsSubtitle')}</p>
                </div>

                <button
                    onClick={loadNews}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? t('loadingNews') : t('refreshNews')}
                </button>
            </div>

            {isLoading && news.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col hover:border-blue-300 dark:hover:border-blue-700 transition-all group animate-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-semibold px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded uppercase">
                                    {item.relatedAsset || 'Market'}
                                </span>
                                <span className="text-xs text-slate-400 ml-auto">{new Date(item.date).toLocaleDateString()}</span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {item.title}
                            </h3>

                            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                                {item.summary}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                    <Search className="w-3 h-3" />
                                    {item.source}
                                </span>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                                >
                                    {t('readMore')}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {news.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <p className="text-slate-500">Could not fetch news at this time.</p>
                </div>
            )}
        </div>
    );
};
