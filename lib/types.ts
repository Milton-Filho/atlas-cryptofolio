
export interface Asset {
    id: string;
    symbol: string;
    name: string;
    currentPrice: number;
    change24h: number;
    icon: string;
}

export interface Wallet {
    id: string;
    name: string;
    type: 'Long-term' | 'Trading' | 'DeFi' | 'Long-term Vault' | 'Trading / Exchange' | 'DeFi / Yield Farming'; // Expanding types based on translation keys seen earlier
    balance: number;
    change24h: number;
    color: string;
    icon: string;
    description?: string;
    objective?: string;
    isArchived: boolean;
    isDefault: boolean;
    createdAt: string;
    organizationId?: string;
}

export interface Holding {
    assetId: string;
    walletId: string;
    amount: number;
    avgPrice: number;
    asset: Asset;
}

export interface Transaction {
    id: string;
    walletId: string;
    toWalletId?: string;
    type: 'buy' | 'sell' | 'transfer' | 'airdrop' | 'staking';
    assetId: string;
    amount: number;
    price: number;
    date: string;
    status: 'completed' | 'pending';
    notes?: string;
    fee?: number;
    exchange?: string;
    realizedPL?: number;
    attachments?: string[];
}

export type InsightCategory = 'concentration' | 'performance' | 'rebalancing' | 'temporal' | 'ai';
export type InsightSeverity = 'high' | 'medium' | 'low';

export interface Insight {
    id: string;
    title: string;
    description: string;
    category: InsightCategory;
    type: 'warning' | 'opportunity' | 'info';
    severity: InsightSeverity;
    date: string;
    status: 'new' | 'read' | 'applied';
    score?: number;
    actionableData?: {
        assetId?: string;
        action?: 'buy' | 'sell';
        amount?: number;
        targetPrice?: number;
    };
}

export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    source: string;
    url: string;
    date: string;
    relatedAsset?: string;
}
