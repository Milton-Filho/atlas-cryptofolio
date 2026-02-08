"use client";

import React, { useState, useEffect } from 'react';
import { X, Wallet as WalletIcon, Briefcase, TrendingUp, Shield, PiggyBank, Target, Landmark, Zap } from 'lucide-react';
import { Wallet } from '@/lib/types';
import { useLanguage } from '@/components/providers/language-provider';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (wallet: any) => void;
    initialData?: Wallet;
    isPremium?: boolean;
}

const WALLET_COLORS = [
    'bg-blue-500', 'bg-purple-500', 'bg-emerald-500',
    'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-slate-500'
];

const ICONS = [
    { id: 'wallet', icon: WalletIcon, label: 'Standard' },
    { id: 'briefcase', icon: Briefcase, label: 'Portfolio' },
    { id: 'trending-up', icon: TrendingUp, label: 'Growth' },
    { id: 'shield', icon: Shield, label: 'Safe' },
    { id: 'piggy-bank', icon: PiggyBank, label: 'Savings' },
    { id: 'target', icon: Target, label: 'Goal' },
    { id: 'landmark', icon: Landmark, label: 'Institution' },
    { id: 'zap', icon: Zap, label: 'DeFi' },
];

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        objective: '',
        type: 'Long-term',
        color: WALLET_COLORS[0],
        icon: 'wallet'
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    description: initialData.description || '',
                    objective: initialData.objective || '',
                    type: initialData.type,
                    color: initialData.color,
                    icon: initialData.icon || 'wallet'
                });
            } else {
                // Reset for new wallet
                setFormData({
                    name: '',
                    description: '',
                    objective: '',
                    type: 'Long-term',
                    color: WALLET_COLORS[0],
                    icon: 'wallet'
                });
                setStep(1);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;
        onSave(formData);
        onClose();
    };

    const IconComponent = ICONS.find(i => i.id === formData.icon)?.icon || WalletIcon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {initialData ? 'Edit Wallet' : t('createNewWallet')}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Step {step} of 2</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">

                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('walletName')} <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder={t('walletPlaceholder')}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="e.g. Main portfolio for retirement savings"
                                        rows={2}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all resize-none placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('walletType')}</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Long-term', 'Trading', 'DeFi'].map((tVal) => (
                                            <button
                                                key={tVal}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type: tVal })}
                                                className={`py-2 text-xs font-medium rounded-lg border transition-all ${formData.type === tVal
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                                                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                {tVal}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Customization */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Strategy / Objective</label>
                                    <input
                                        type="text"
                                        value={formData.objective}
                                        onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                                        placeholder="e.g. Accumulate BTC until 2030"
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Color Code</label>
                                    <div className="flex gap-3 flex-wrap">
                                        {WALLET_COLORS.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color })}
                                                className={`w-8 h-8 rounded-full ${color} transition-transform ${formData.color === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Visual Icon</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {ICONS.map(({ id, icon: Icon, label }) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon: id })}
                                                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${formData.icon === id
                                                        ? 'bg-slate-100 dark:bg-slate-800 border-blue-500 text-blue-600 dark:text-blue-400'
                                                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5 mb-1" />
                                                <span className="text-[10px]">{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preview Banner */}
                        <div className="mt-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm ${formData.color}`}>
                                <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{formData.name || 'Untitled Wallet'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{formData.type} • {formData.objective || 'No objective'}</p>
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-between bg-slate-50 dark:bg-slate-900/50">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-colors"
                            >
                                Back
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                        )}

                        {step < 2 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                disabled={!formData.name}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 dark:shadow-none"
                            >
                                {initialData ? 'Save Changes' : t('createWallet')}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
