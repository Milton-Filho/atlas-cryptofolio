"use client";

import React from 'react';
import { Transaction, Asset } from '@/lib/types';
import { ArrowDownLeft, ArrowUpRight, Search, Filter, Download, ArrowRight, FileText, Gift, Zap, UploadCloud } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';

interface TransactionsViewProps {
    transactions: Transaction[];
    assets: Asset[];
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, assets }) => {
    const { t } = useLanguage();
    const getAsset = (id: string) => assets.find(a => a.id === id);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{t('transactions')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('transactionsSubtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <UploadCloud className="w-4 h-4" />
                        Import CSV
                    </button>
                    <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <Download className="w-4 h-4" />
                        {t('exportCSV')}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder={t('searchTransactions')}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 dark:text-white transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <Filter className="w-4 h-4" />
                            {t('filter')}
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('date')}</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('type')}</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('asset')}</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('amount')}</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('price')}</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fee</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('totalValue')}</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        {t('noTransactions')}
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(tx => {
                                    const asset = getAsset(tx.assetId);
                                    const isBuy = tx.type === 'buy';
                                    const isTransfer = tx.type === 'transfer';
                                    const isAirdrop = tx.type === 'airdrop';

                                    let typeColor = 'bg-slate-100 text-slate-800';
                                    let TypeIcon = ArrowRight;
                                    let amountPrefix = '';

                                    if (isBuy) {
                                        typeColor = 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300';
                                        TypeIcon = ArrowDownLeft;
                                        amountPrefix = '+';
                                    } else if (tx.type === 'sell') {
                                        typeColor = 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
                                        TypeIcon = ArrowUpRight;
                                        amountPrefix = '-';
                                    } else if (isTransfer) {
                                        typeColor = 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
                                        TypeIcon = ArrowRight;
                                        amountPrefix = '';
                                    } else if (isAirdrop) {
                                        typeColor = 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
                                        TypeIcon = Gift;
                                        amountPrefix = '+';
                                    } else if (tx.type === 'staking') {
                                        typeColor = 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
                                        TypeIcon = Zap;
                                        amountPrefix = '+';
                                    }

                                    return (
                                        <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {new Date(tx.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                                                    <TypeIcon className="w-3 h-3 mr-1" />
                                                    {// @ts-ignore
                                                        t(tx.type) || tx.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                                        {asset?.symbol[0] || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{asset?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{asset?.symbol}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-900 dark:text-white font-medium">
                                                {amountPrefix}{tx.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500 dark:text-slate-400">
                                                {tx.price > 0 ? `$${tx.price.toLocaleString()}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500 dark:text-slate-400">
                                                {tx.fee ? `$${tx.fee.toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-slate-900 dark:text-white">
                                                ${(tx.amount * tx.price).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {tx.attachments && tx.attachments.length > 0 && (
                                                    <span className="inline-flex items-center p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400" title="Has Attachment">
                                                        <FileText className="w-4 h-4" />
                                                    </span>
                                                )}
                                                {tx.exchange && (
                                                    <span className="ml-2 text-xs text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
                                                        {tx.exchange}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
