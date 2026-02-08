import { Asset, Wallet, Holding, Transaction, Insight } from './types';

export const MOCK_ASSETS: Asset[] = [
    { id: '1', symbol: 'BTC', name: 'Bitcoin', currentPrice: 64230.50, change24h: 2.4, icon: '₿' },
    { id: '2', symbol: 'ETH', name: 'Ethereum', currentPrice: 3450.12, change24h: -1.2, icon: 'Ξ' },
    { id: '3', symbol: 'SOL', name: 'Solana', currentPrice: 145.80, change24h: 5.7, icon: 'S' },
    { id: '4', symbol: 'LINK', name: 'Chainlink', currentPrice: 18.20, change24h: 0.5, icon: 'L' },
];

export const MOCK_WALLETS: Wallet[] = [
    {
        id: 'w1',
        name: 'Main Vault',
        type: 'Long-term',
        balance: 0, // Will be calculated
        change24h: 0,
        color: '#2563eb',
        icon: '🔒',
        isArchived: false,
        isDefault: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'w2',
        name: 'Trading Desktop',
        type: 'Trading',
        balance: 0,
        change24h: 0,
        color: '#16a34a',
        icon: '📈',
        isArchived: false,
        isDefault: false,
        createdAt: new Date().toISOString()
    }
];

export const MOCK_HOLDINGS: Holding[] = [
    {
        assetId: '1',
        walletId: 'w1',
        amount: 0.5,
        avgPrice: 55000,
        asset: MOCK_ASSETS[0]
    },
    {
        assetId: '2',
        walletId: 'w1',
        amount: 10,
        avgPrice: 2800,
        asset: MOCK_ASSETS[1]
    },
    {
        assetId: '3',
        walletId: 'w2',
        amount: 100,
        avgPrice: 80,
        asset: MOCK_ASSETS[2]
    }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 't1',
        walletId: 'w1',
        type: 'buy',
        assetId: '1',
        amount: 0.5,
        price: 55000,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        status: 'completed',
        notes: 'Initial buy'
    },
    {
        id: 't2',
        walletId: 'w1',
        type: 'buy',
        assetId: '2',
        amount: 10,
        price: 2800,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        status: 'completed'
    },
    {
        id: 't3',
        walletId: 'w2',
        type: 'buy',
        assetId: '3',
        amount: 100,
        price: 80,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        status: 'completed',
        notes: 'Trading entry'
    }
];
