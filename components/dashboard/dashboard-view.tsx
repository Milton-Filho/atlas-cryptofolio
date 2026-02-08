"use client";

import React, { useState, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
    ArrowUp, ArrowDown, TrendingUp, DollarSign, Wallet,
    ArrowDownLeft, ArrowUpRight, Filter, Search,
    Layers, BarChart3, PieChart as PieChartIcon, ArrowRightLeft, Clock
} from 'lucide-react';
import { Holding, Wallet as WalletType, Transaction } from '@/lib/types';
import { useLanguage } from '@/components/providers/language-provider';
import { useTheme } from 'next-themes';
import { TransactionModal } from '@/components/transactions/transaction-modal';
import { MOCK_ASSETS } from '@/lib/mock-data';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#eab308', '#475569'];
const DARK_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#06b6d4', '#facc15', '#94a3b8'];

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
type ChartType = 'value' | 'composition' | 'allocation';

const StatCard = ({ title, value, subValue, type = 'neutral', icon: Icon }: any) => {
    let trendColor = 'text-slate-500 dark:text-slate-400';
    let bgClass = 'bg-slate-100 dark:bg-slate-800';
    let iconColor = 'text-slate-600 dark:text-slate-300';

    if (type === 'positive') {
        trendColor = 'text-emerald-600 dark:text-emerald-400';
        bgClass = 'bg-emerald-50 dark:bg-emerald-900/20';
        iconColor = 'text-emerald-600 dark:text-emerald-400';
    } else if (type === 'negative') {
        trendColor = 'text-red-600 dark:text-red-400';
        bgClass = 'bg-red-50 dark:bg-red-900/20';
        iconColor = 'text-red-600 dark:text-red-400';
    }

    return (
        <div className="bg-white dark:bg-card p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <div className={`p-2 rounded-lg ${bgClass} ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
                {subValue && <p className={`text-xs font-medium mt-1 ${trendColor}`}>{subValue}</p>}
            </div>
        </div>
    );
};

interface DashboardViewProps {
    holdings: Holding[];
    wallets: WalletType[];
    transactions: Transaction[];
    onAddTransaction?: (walletId: string) => void;
    onQuickAction?: (type: 'buy' | 'sell') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
    holdings,
    wallets,
    transactions,
    onAddTransaction,
    onQuickAction
}) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const [selectedWalletId, setSelectedWalletId] = useState('all');
    const [timeRange, setTimeRange] = useState<TimeRange>('30d');
    const [activeChart, setActiveChart] = useState<ChartType>('value');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Holding | 'value' | 'pl', direction: 'asc' | 'desc' }>({ key: 'value', direction: 'desc' });
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    const displayedHoldings = useMemo(() => {
        return selectedWalletId === 'all'
            ? holdings
            : holdings.filter(h => h.walletId === selectedWalletId);
    }, [holdings, selectedWalletId]);

    const filteredTransactions = useMemo(() => {
        return selectedWalletId === 'all'
            ? transactions
            : transactions.filter(t => t.walletId === selectedWalletId);
    }, [transactions, selectedWalletId]);

    // Current Metrics
    const totalBalance = displayedHoldings.reduce((acc, h) => acc + (h.amount * h.asset.currentPrice), 0);
    const totalInvested = displayedHoldings.reduce((acc, h) => acc + (h.amount * h.avgPrice), 0);

    const unrealizedPL = totalBalance - totalInvested;
    const unrealizedPLPercent = totalInvested > 0 ? (unrealizedPL / totalInvested) * 100 : 0;

    const realizedPL = filteredTransactions.reduce((acc, t) => acc + (t.realizedPL || 0), 0);

    const sortedByPerformance = [...displayedHoldings].sort((a, b) => b.asset.change24h - a.asset.change24h);
    const bestPerformer = sortedByPerformance.length > 0 ? sortedByPerformance[0] : null;

    // Chart Data Generation
    const chartData = useMemo(() => {
        const now = new Date();
        const dataPoints: any[] = [];
        let daysToLookBack = 30;

        switch (timeRange) {
            case '7d': daysToLookBack = 7; break;
            case '30d': daysToLookBack = 30; break;
            case '90d': daysToLookBack = 90; break;
            case '1y': daysToLookBack = 365; break;
            case 'all': daysToLookBack = 365 * 2; break;
        }

        const uniqueAssetIds = Array.from(new Set(displayedHoldings.map(h => h.assetId)));

        for (let i = daysToLookBack; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            let point: any = { name: dateStr, total: 0 };

            uniqueAssetIds.forEach(assetId => {
                const currentHolding = displayedHoldings.find(h => h.assetId === assetId);
                if (!currentHolding) return;

                const txsAfterDate = filteredTransactions.filter(t =>
                    t.assetId === assetId && new Date(t.date) > date
                );

                let historicAmount = currentHolding.amount;
                txsAfterDate.forEach(t => {
                    if (t.type === 'buy') historicAmount -= t.amount;
                    if (t.type === 'sell') historicAmount += t.amount;
                });

                const randomVar = Math.sin(i * 0.5) * 5 + (Math.random() * 2);
                const historicPrice = currentHolding.asset.currentPrice * (1 - (i * 0.001)) + randomVar;

                const val = Math.max(0, historicAmount * historicPrice);

                point[currentHolding.asset.symbol] = val;
                point.total += val;
            });

            if (i % Math.ceil(daysToLookBack / 20) === 0 || i === 0) {
                dataPoints.push(point);
            }
        }
        return dataPoints;
    }, [displayedHoldings, filteredTransactions, timeRange]);

    const allocationData = displayedHoldings.map(h => ({
        name: h.asset.symbol,
        value: h.amount * h.asset.currentPrice
    })).sort((a, b) => b.value - a.value);

    const topAssetsData = allocationData.slice(0, 5);

    const sortedHoldings = useMemo(() => {
        let data = [...displayedHoldings];

        if (searchQuery) {
            data = data.filter(h =>
                h.asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                h.asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return data.sort((a, b) => {
            let aValue: number = 0;
            let bValue: number = 0;

            switch (sortConfig.key) {
                case 'value':
                    aValue = a.amount * a.asset.currentPrice;
                    bValue = b.amount * b.asset.currentPrice;
                    break;
                case 'pl':
                    aValue = (a.amount * a.asset.currentPrice) - (a.amount * a.avgPrice);
                    bValue = (b.amount * b.asset.currentPrice) - (b.amount * b.avgPrice);
                    break;
                case 'amount':
                    aValue = a.amount;
                    bValue = b.amount;
                    break;
                case 'avgPrice':
                    aValue = a.avgPrice;
                    bValue = b.avgPrice;
                    break;
                default:
                    // @ts-ignore
                    aValue = a.asset[sortConfig.key] || 0;
                    // @ts-ignore
                    bValue = b.asset[sortConfig.key] || 0;
            }

            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        });
    }, [displayedHoldings, searchQuery, sortConfig]);

    const handleSort = (key: any) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const chartColors = theme === 'dark' ? DARK_COLORS : COLORS;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('dashboard')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{t('welcomeBack')}</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <select
                            value={selectedWalletId}
                            onChange={(e) => setSelectedWalletId(e.target.value)}
                            className="appearance-none pl-10 pr-8 py-2.5 bg-white dark:bg-card border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer shadow-sm transition-all"
                        >
                            <option value="all">{t('allWallets')}</option>
                            {wallets.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                        <Wallet className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                    <button
                        onClick={() => setIsTransactionModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                    >
                        <Clock className="w-4 h-4" />
                        {t('addTransaction')}
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title={t('totalBalance')}
                    value={`$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    subValue={`Total Invested: $${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    icon={DollarSign}
                    type="neutral"
                />
                <StatCard
                    title="Unrealized P&L"
                    value={`$${Math.abs(unrealizedPL).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    subValue={`${unrealizedPL >= 0 ? '+' : ''}${unrealizedPLPercent.toFixed(2)}% Return`}
                    icon={TrendingUp}
                    type={unrealizedPL >= 0 ? 'positive' : 'negative'}
                />
                <StatCard
                    title="Realized P&L"
                    value={`$${Math.abs(realizedPL).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    subValue={`${realizedPL >= 0 ? 'Profit' : 'Loss'} realized`}
                    icon={ArrowRightLeft}
                    type={realizedPL >= 0 ? 'positive' : 'negative'}
                />
                <StatCard
                    title="Best Performer (24h)"
                    value={bestPerformer ? bestPerformer.asset.symbol : '-'}
                    subValue={bestPerformer ? `+${bestPerformer.asset.change24h}%` : '0%'}
                    icon={ArrowUpRight}
                    type="positive"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[420px]">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Portfolio Performance</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Historical value evolution over time</p>
                        </div>
                        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start">
                            {(['value', 'composition'] as ChartType[]).map(type => (
                                <button
                                    key={type}
                                    onClick={() => setActiveChart(type)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${activeChart === type
                                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {type === 'value' ? <TrendingUp className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                            <option value="1y">Last Year</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>

                    <div className="flex-1 w-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} strokeOpacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    minTickGap={30}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    tickFormatter={(val) => `$${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                                />
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#0f172a' : '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid ' + (theme === 'dark' ? '#1e293b' : '#e2e8f0'),
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                    labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                                    formatter={(value: any) => [`$${(Number(value) || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`]}
                                />

                                {activeChart === 'value' ? (
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                ) : (
                                    displayedHoldings.slice(0, 5).map((h, index) => (
                                        <Area
                                            key={h.asset.symbol}
                                            type="monotone"
                                            dataKey={h.asset.symbol}
                                            stackId="1"
                                            stroke={chartColors[index % chartColors.length]}
                                            fill={chartColors[index % chartColors.length]}
                                            fillOpacity={0.6}
                                        />
                                    ))
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-white dark:bg-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Distribution</h3>
                        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button onClick={() => setActiveChart('allocation')} className={`p-1.5 rounded-md ${activeChart === 'allocation' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>
                                <PieChartIcon className="w-4 h-4 text-slate-500" />
                            </button>
                            <button onClick={() => setActiveChart('value')} className={`p-1.5 rounded-md ${activeChart === 'value' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}>
                                <BarChart3 className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[200px] relative">
                        {activeChart === 'allocation' ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={allocationData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {allocationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topAssetsData} layout="vertical" margin={{ left: 10, right: 10 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={40} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {topAssetsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}

                        {activeChart === 'allocation' && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <p className="text-xs text-slate-400">Top</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">{topAssetsData[0]?.name || '-'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 space-y-2 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                        {allocationData.slice(0, 5).map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }}></div>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                                </div>
                                <span className="text-slate-500">{totalBalance > 0 ? Math.round((item.value / totalBalance) * 100) : 0}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Portfolio Assets Table */}
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Portfolio Assets</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Detailed view of your holdings performance</p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                placeholder="Search assets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('asset')}>Asset</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('amount')}>Balance</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('value')}>Value</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('pl')}>Total P&L</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {sortedHoldings.length > 0 ? sortedHoldings.map((holding) => {
                                const currentVal = holding.amount * holding.asset.currentPrice;
                                const costBasis = holding.amount * holding.avgPrice;
                                const pl = currentVal - costBasis;
                                const plPercent = costBasis > 0 ? (pl / costBasis) * 100 : 0;
                                const isPositive = pl >= 0;

                                return (
                                    <tr key={holding.assetId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-lg shadow-sm border border-slate-100 dark:border-slate-700">
                                                    {holding.asset.icon || holding.asset.symbol[0]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 dark:text-white">{holding.asset.name}</span>
                                                        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{holding.asset.symbol}</span>
                                                    </div>
                                                    <div className={`text-xs flex items-center mt-0.5 ${holding.asset.change24h >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                        {holding.asset.change24h >= 0 ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
                                                        {Math.abs(holding.asset.change24h)}% (24h)
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{holding.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
                                            <div className="text-xs text-slate-500">Avg: ${holding.avgPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">${holding.asset.currentPrice.toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">${currentVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                            <div className="text-xs text-slate-500">{totalBalance > 0 ? (currentVal / totalBalance * 100).toFixed(1) : 0}% of Portfolio</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className={`text-sm font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {isPositive ? '+' : ''}${Math.abs(pl).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </div>
                                            <div className={`text-xs font-medium inline-flex items-center ${isPositive ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-red-600/80 dark:text-red-400/80'}`}>
                                                {plPercent.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onQuickAction && onQuickAction('buy')}
                                                    className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                                                    title="Buy More"
                                                >
                                                    <ArrowDownLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onQuickAction && onQuickAction('sell')}
                                                    className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                                    title="Sell Asset"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                                <Search className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <p>No assets found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isTransactionModalOpen && (
                <TransactionModal
                    isOpen={isTransactionModalOpen}
                    onClose={() => setIsTransactionModalOpen(false)}
                    onSave={(tx) => {
                        console.log('Saved TX:', tx);
                        onAddTransaction?.(tx.walletId);
                        setIsTransactionModalOpen(false);
                    }}
                    assets={MOCK_ASSETS}
                    wallets={wallets}
                    holdings={displayedHoldings}
                />
            )}
        </div>
    );
};
