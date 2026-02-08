"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, Wallet as WalletIcon, ArrowRight, ArrowDownLeft, ArrowUpRight, Gift, Zap, AlertCircle, Upload } from 'lucide-react';
import { Asset, Transaction, Wallet, Holding } from '@/lib/types';
import { useLanguage } from '@/components/providers/language-provider';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: any) => void;
    assets: Asset[];
    wallets: Wallet[];
    holdings?: Holding[];
    initialData?: { type?: Transaction['type'], assetId?: string, walletId?: string };
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, assets, wallets, holdings = [], initialData }) => {
    const { t } = useLanguage();
    const [type, setType] = useState<Transaction['type']>('buy');
    const [assetId, setAssetId] = useState('');
    const [walletId, setWalletId] = useState('');
    const [toWalletId, setToWalletId] = useState('');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('');
    const [fee, setFee] = useState('');
    const [exchange, setExchange] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setType(initialData?.type || 'buy');
            setAssetId(initialData?.assetId || assets[0]?.id || '');
            setWalletId(initialData?.walletId || wallets[0]?.id || '');
            // @ts-ignore
            setToWalletId(wallets.length > 1 ? wallets[1].id : '');
            setAmount('');
            setFee('');
            setExchange('');
            setNotes('');
            setFileName('');
            setError('');
            setDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen, initialData, wallets, assets]);

    // Update price when asset changes
    useEffect(() => {
        const asset = assets.find(a => a.id === assetId);
        if (asset && !price) {
            setPrice(asset.currentPrice.toString());
        }
    }, [assetId, assets, price]);

    const getAvailableBalance = () => {
        const holding = holdings.find(h => h.walletId === walletId && h.assetId === assetId);
        return holding ? holding.amount : 0;
    };

    const availableBalance = getAvailableBalance();

    const handleMaxClick = () => {
        setAmount(availableBalance.toString());
    };

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!amount || !assetId || !walletId) return;

        const parsedAmount = parseFloat(amount);

        if ((type === 'sell' || type === 'transfer') && parsedAmount > availableBalance) {
            setError(`Insufficient balance. Available: ${availableBalance}`);
            return;
        }

        const finalPrice = (type === 'transfer' || type === 'airdrop') ? 0 : parseFloat(price);

        onSave({
            type,
            assetId,
            walletId,
            toWalletId: type === 'transfer' ? toWalletId : undefined,
            amount: parsedAmount,
            price: finalPrice,
            fee: parseFloat(fee) || 0,
            exchange,
            date,
            notes,
            attachments: fileName ? [fileName] : []
        });

        onClose();
    };

    const hasWallets = wallets.length > 0;
    const numericAmount = parseFloat(amount || '0');
    const numericPrice = parseFloat(price || '0');
    const totalValue = numericAmount * numericPrice;

    // Type Button Helper
    const TypeButton = ({ id, label, icon: Icon, colorClass }: any) => (
        <button
            type="button"
            // @ts-ignore
            onClick={() => setType(id)}
            className={`flex-1 py-2 flex items-center justify-center gap-2 text-sm font-medium rounded-md transition-all ${type === id ? `bg-white dark:bg-slate-700 shadow-sm ${colorClass}` : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
        >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-card rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('addTransaction')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {!hasWallets ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <WalletIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Wallets Found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">You need to create a wallet before you can add transactions.</p>
                        <button
                            onClick={onClose}
                            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-6">

                            {/* Type Selector */}
                            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
                                <TypeButton id="buy" label={t('buy')} icon={ArrowDownLeft} colorClass="text-emerald-600 dark:text-emerald-400" />
                                <TypeButton id="sell" label={t('sell')} icon={ArrowUpRight} colorClass="text-red-600 dark:text-red-400" />
                                <TypeButton id="transfer" label={t('transfer')} icon={ArrowRight} colorClass="text-purple-600 dark:text-purple-400" />
                                <TypeButton id="airdrop" label="Airdrop" icon={Gift} colorClass="text-blue-500" />
                                <TypeButton id="staking" label="Staking" icon={Zap} colorClass="text-yellow-500" />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {/* Wallet & Asset Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {type === 'transfer' ? t('fromWallet') : t('wallets')}
                                    </label>
                                    <select
                                        value={walletId}
                                        onChange={(e) => setWalletId(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all text-sm"
                                    >
                                        {wallets.map(wallet => (
                                            <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('asset')}</label>
                                    <select
                                        value={assetId}
                                        onChange={(e) => setAssetId(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all text-sm"
                                    >
                                        {assets.map(asset => (
                                            <option key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Transfer Destination */}
                            {type === 'transfer' && (
                                <div className="space-y-2 animate-in slide-in-from-top-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('toWallet')}</label>
                                    <select
                                        value={toWalletId}
                                        onChange={(e) => setToWalletId(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all text-sm"
                                    >
                                        {wallets.filter(w => w.id !== walletId).map(wallet => (
                                            <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Amount & Price */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                                        {t('quantity')}
                                        {(type === 'sell' || type === 'transfer') && (
                                            <span onClick={handleMaxClick} className="text-xs text-primary cursor-pointer hover:underline">
                                                Max: {availableBalance}
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('pricePerCoin')}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder="0.00"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            disabled={type === 'transfer'}
                                            className="w-full pl-7 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Fees & Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fee</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder="0.00"
                                            value={fee}
                                            onChange={(e) => setFee(e.target.value)}
                                            className="w-full pl-7 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('date')}</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-600 dark:text-slate-300"
                                    />
                                </div>
                            </div>

                            {/* Exchange & Attachment */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Exchange / Platform</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Binance"
                                        value={exchange}
                                        onChange={(e) => setExchange(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Attachment</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                                        />
                                        <label htmlFor="file-upload" className="flex items-center justify-between w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                            <span className="truncate text-xs">{fileName || 'Upload proof (PDF/IMG)'}</span>
                                            <Upload className="w-4 h-4" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                                    {t('notes')} <span className="text-xs text-slate-400 font-normal">({t('optional')})</span>
                                </label>
                                <textarea
                                    rows={2}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    placeholder="Transaction details..."
                                />
                            </div>
                        </div>

                        {/* Footer Summary */}
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            {type !== 'transfer' && (
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{t('totalValue')}</span>
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                                        ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${type === 'sell' ? 'bg-red-600 hover:bg-red-700' :
                                            type === 'transfer' ? 'bg-purple-600 hover:bg-purple-700' :
                                                'bg-primary hover:opacity-90'
                                        }`}
                                >
                                    Save Transaction
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
