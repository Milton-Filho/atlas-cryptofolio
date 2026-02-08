import { Holding, Insight, NewsItem } from '@/lib/types';

// MOCK SERVICE for Client-Side Demo
// In production, these should be Server Actions calling Google GenAI

export const generatePortfolioInsights = async (holdings: Holding[], language: string): Promise<Insight[]> => {
    // Mock Delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return [
        {
            id: 'ai-mock-1',
            title: 'Portfolio Analysis (AI)',
            description: 'Your portfolio shows a strong preference for Layer 1 protocols. While this offers stability, consider exposure to L2 scaling solutions or DeFi blue chips for higher potential alpha in the current cycle.',
            category: 'ai',
            type: 'info',
            severity: 'medium',
            score: 80,
            status: 'new',
            date: new Date().toISOString()
        },
        {
            id: 'ai-mock-2',
            title: 'Market Sentiment Scan',
            description: 'Recent news suggests increasing regulatory clarity in the EU. Your holdings in regulated assets like BTC and ETH are well-positioned.',
            category: 'ai',
            type: 'opportunity',
            severity: 'low',
            score: 60,
            status: 'new',
            date: new Date().toISOString()
        }
    ];
};

export const fetchCryptoNews = async (assets: string[], language: string): Promise<NewsItem[]> => {
    // Mock Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return [
        {
            id: 'news-1',
            title: 'Bitcoin Surpasses $65,000 Amid institutional Inflows',
            summary: 'BTC continues its rally as ETF inflows reach record highs this week.',
            source: 'CryptoDaily',
            url: '#',
            date: new Date().toISOString(),
            relatedAsset: 'Bitcoin'
        },
        {
            id: 'news-2',
            title: 'Ethereum Upgrade Goes Live Successfully',
            summary: 'The latest Dencun upgrade significantly reduces L2 transaction fees.',
            source: 'BlockWorks',
            url: '#',
            date: new Date(Date.now() - 86400000).toISOString(),
            relatedAsset: 'Ethereum'
        },
        {
            id: 'news-3',
            title: 'Solana Network Sees Record Activity',
            summary: 'Daily active addresses on Solana hit new all-time high driven by meme coin trading.',
            source: 'CoinDesk',
            url: '#',
            date: new Date(Date.now() - 172800000).toISOString(),
            relatedAsset: 'Solana'
        },
    ];
};
