"use client";

import React, { useState } from 'react';
import { Plus, ArrowUp, ArrowDown, Wallet as WalletIcon, MoreVertical, Archive, Copy, Star, Edit, Search, Target, Briefcase, TrendingUp, Shield, PiggyBank, Landmark, Zap, RefreshCw, Coins } from 'lucide-react';
import { Wallet, Holding } from '@/lib/types';
import { WalletModal } from './wallet-modal';
import { TransactionModal } from '@/components/transactions/transaction-modal';
import { useLanguage } from '@/components/providers/language-provider';
import { useUser } from '@clerk/nextjs';

// Helper to map string to Icon component
const getIconComponent = (iconName: string) => {
    switch (iconName) {
        case 'briefcase': return Briefcase;
        case 'trending-up': return TrendingUp;
        case 'shield': return Shield;
        case 'piggy-bank': return PiggyBank;
        case 'target': return Target;
        case 'landmark': return Landmark;
        case 'zap': return Zap;
        default: return WalletIcon;
    }
};

interface WalletsViewProps {
    wallets: Wallet[];
    holdings: Holding[];
    onAddWallet?: (wallet: any) => void;
    onUpdateWallet?: (wallet: Wallet) => void;
}

export const WalletsView: React.FC<WalletsViewProps> = ({ wallets: initialWallets, holdings, onAddWallet, onUpdateWallet }) => {
    const [wallets, setWallets] = useState<Wallet[]>(initialWallets);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState<Wallet | undefined>(undefined);
    const { t } = useLanguage();
    const { user } = useUser();

    // Filter State
    const [filterStatus, setFilterStatus] = useState<'active' | 'archived'>('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'value' | 'name' | 'created'>('value');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    const getWalletTypeLabel = (type: string) => {
        switch (type) {
            case 'Long-term': return t('type_LongTerm');
            case 'Trading': return t('type_Trading');
            case 'DeFi': return t('type_DeFi');
            default: return type;
        }
    };

    const filteredWallets = wallets
        .filter(w => {
            const matchesStatus = filterStatus === 'active' ? !w.isArchived : w.isArchived;
            const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'value') return b.balance - a.balance;
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return 0;
        });

    const handleEdit = (wallet: Wallet) => {
        setEditingWallet(wallet);
        setIsModalOpen(true);
        setActiveMenuId(null);
    };

    const handleCreateClick = () => {
        // Mock check
        if (user?.publicMetadata?.plan === 'free' && wallets.length >= 3) {
            alert("You have reached the free limit of 3 wallets. Upgrade to Premium for unlimited wallets.");
            return;
        }
        setEditingWallet(undefined);
        setIsModalOpen(true);
    };

    const handleSave = (data: any) => {
        if (editingWallet) {
            // Mock update
            const updated = wallets.map(w => w.id === editingWallet.id ? { ...w, ...data } : w);
            setWallets(updated);
            onUpdateWallet && onUpdateWallet({ ...editingWallet, ...data });
        } else {
            // Mock create
            const newWallet = {
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                balance: 0,
                change24h: 0,
                createdAt: new Date().toISOString(),
                isArchived: false,
                isDefault: false
            };
            setWallets([...wallets, newWallet]);
            onAddWallet && onAddWallet(newWallet);
        }
        setIsModalOpen(false);
    };

    const handleArchive = (id: string, archive: boolean) => {
        setWallets(wallets.map(w => w.id === id ? { ...w, isArchived: archive } : w));
    };

    const handleDuplicate = (wallet: Wallet) => {
        const newWallet = {
            ...wallet,
            id: Math.random().toString(36).substr(2, 9),
            name: `${wallet.name} (Copy)`,
            createdAt: new Date().toISOString(),
            isDefault: false
        };
        setWallets([...wallets, newWallet]);
    };

    const handleSetDefault = (id: string) => {
        setWallets(wallets.map(w => ({ ...w, isDefault: w.id === id })));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500" onClick={() => setActiveMenuId(null)}>
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{t('wallets')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('walletsSubtitle')}</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all w-40 md:w-64"
                        />
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-lg text-sm font-medium outline-none cursor-pointer"
                    >
                        <option value="value">Sort by Value</option>
                        <option value="name">Sort by Name</option>
                        <option value="created">Sort by Date</option>
                    </select>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6">
                <button
                    onClick={() => setFilterStatus('active')}
                    className={`pb-3 text-sm font-medium transition-colors relative ${filterStatus === 'active' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Active Wallets
                    {filterStatus === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setFilterStatus('archived')}
                    className={`pb-3 text-sm font-medium transition-colors relative ${filterStatus === 'archived' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Archived
                    {filterStatus === 'archived' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create New Button (Only in Active View) */}
                {filterStatus === 'active' && (
                    <button
                        onClick={handleCreateClick}
                        className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-primary/50 hover:text-primary transition-all h-full min-h-[220px] bg-slate-50/50 dark:bg-slate-900/50 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-medium">{t('createNewWallet')}</span>
                        <span className="text-xs mt-1 opacity-70">
                            Unlimited Plan
                        </span>
                    </button>
                )}

                {filteredWallets.map(wallet => {
                    const WalletIconComponent = getIconComponent(wallet.icon);
                    // Calculate asset count for this wallet
                    const assetCount = holdings.filter(h => h.walletId === wallet.id).length;

                    return (
                        <div key={wallet.id} className={`bg-white dark:bg-card rounded-xl border ${wallet.isDefault ? 'border-primary/50 ring-1 ring-primary/20' : 'border-slate-200 dark:border-slate-800'} shadow-sm relative overflow-visible group hover:border-slate-300 dark:hover:border-slate-700 transition-all`}>
                            {/* Default Badge */}
                            {wallet.isDefault && (
                                <div className="absolute top-0 left-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10">
                                    DEFAULT
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200 dark:shadow-none ${wallet.color}`}>
                                        <WalletIconComponent className="w-6 h-6" />
                                    </div>

                                    <div className="relative" onClick={e => e.stopPropagation()}>
                                        <button
                                            onClick={() => setActiveMenuId(activeMenuId === wallet.id ? null : wallet.id)}
                                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {activeMenuId === wallet.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                {!wallet.isArchived && (
                                                    <>
                                                        <button onClick={() => { setActiveMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                                                            <Plus className="w-4 h-4" /> Add Transaction
                                                        </button>
                                                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                                                        <button onClick={() => handleEdit(wallet)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                                                            <Edit className="w-4 h-4" /> Edit
                                                        </button>
                                                        <button onClick={() => { handleDuplicate(wallet); setActiveMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                                                            <Copy className="w-4 h-4" /> Duplicate
                                                        </button>
                                                        <button onClick={() => { handleSetDefault(wallet.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                                                            <Star className="w-4 h-4" /> Set Default
                                                        </button>
                                                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => { handleArchive(wallet.id, !wallet.isArchived); setActiveMenuId(null); }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                                >
                                                    {wallet.isArchived ? <RefreshCw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                                                    {wallet.isArchived ? 'Restore' : 'Archive'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">{wallet.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{wallet.description || 'No description'}</p>
                                </div>

                                <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded">
                                        <Coins className="w-3 h-3" />
                                        <span>{assetCount} {assetCount === 1 ? 'Asset' : 'Assets'}</span>
                                    </div>
                                    {wallet.change24h !== 0 && (
                                        <div className={`flex items-center gap-1 px-2 py-1 rounded ${wallet.change24h >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                                            {wallet.change24h >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                            <span className="font-medium">{Math.abs(wallet.change24h).toFixed(2)}% (24h)</span>
                                        </div>
                                    )}
                                </div>

                                {wallet.objective && (
                                    <div className="mb-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                        <Target className="w-3 h-3 text-primary" />
                                        <span className="truncate">{wallet.objective}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Balance</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">${wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded font-medium border border-slate-200 dark:border-slate-700">
                                        {getWalletTypeLabel(wallet.type)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <WalletModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingWallet}
                // Mock premium check
                isPremium={true}
            />

            {/* Transaction Modal (Global for wallets view) */}
            <TransactionModal
                isOpen={!!activeMenuId && activeMenuId === 'transaction-modal'}
                onClose={() => setActiveMenuId(null)}
                onSave={(tx) => {
                    console.log("Tx saved:", tx);
                    // In real app, refetch data
                    setActiveMenuId(null);
                }}
                assets={[]} // Should import MOCK_ASSETS or pass as prop
                wallets={wallets}
                holdings={holdings}
            />
        </div>
    );
};
