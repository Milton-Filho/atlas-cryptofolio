import { Holding, Insight, Transaction } from '@/lib/types';

// Constants for thresholds
const CONCENTRATION_THRESHOLD = 0.30; // 30%
const REBALANCE_DEVIATION_THRESHOLD = 0.15; // 15%
const SEVERE_DROP_THRESHOLD = -10; // -10% in 24h

// Mock BTC ID for comparisons
const BTC_ASSET_ID = '1';

export const analysisService = {

    /**
     * Calculates the Diversification Score (0-100)
     * Uses a simplified Herfindahl-Hirschman Index (HHI) approach
     */
    calculateDiversificationScore: (holdings: Holding[]): number => {
        if (holdings.length === 0) return 0;

        const totalValue = holdings.reduce((acc, h) => acc + (h.amount * h.asset.currentPrice), 0);
        if (totalValue === 0) return 0;

        let sumSquaredWeights = 0;

        holdings.forEach(h => {
            const weight = (h.amount * h.asset.currentPrice) / totalValue;
            sumSquaredWeights += weight * weight;
        });

        // Invert scale: HHI 1 (monopoly) -> Score 0. HHI 0 (perfect divers) -> Score 100
        const score = Math.max(0, Math.min(100, (1 - sumSquaredWeights) * 100 + (holdings.length * 2)));
        return Math.round(score);
    },

    /**
     * Generates analytical insights based on holdings and transactions
     */
    generateInsights: (holdings: Holding[], transactions: Transaction[]): Insight[] => {
        const insights: Insight[] = [];
        const totalValue = holdings.reduce((acc, h) => acc + (h.amount * h.asset.currentPrice), 0);

        // 1. Concentration Analysis
        holdings.forEach(h => {
            const value = h.amount * h.asset.currentPrice;
            const weight = value / totalValue;

            if (weight > CONCENTRATION_THRESHOLD) {
                insights.push({
                    id: `conc-${h.assetId}`,
                    category: 'concentration',
                    title: `High Concentration in ${h.asset.symbol}`,
                    description: `${h.asset.name} represents ${(weight * 100).toFixed(1)}% of your portfolio. Consider diversifying to reduce specific asset risk.`,
                    type: 'warning',
                    severity: 'high',
                    score: 90,
                    status: 'new',
                    date: new Date().toISOString(),
                    actionableData: {
                        assetId: h.assetId,
                        action: 'sell',
                        amount: (weight - 0.25) * totalValue / h.asset.currentPrice // Suggest reducing to 25%
                    }
                });
            }
        });

        // 2. Performance Analysis (vs BTC)
        const btcHolding = holdings.find(h => h.assetId === BTC_ASSET_ID);
        const btcPerformance = btcHolding ? btcHolding.asset.change24h : 2.4;

        const bestPerformer = holdings.reduce((prev, curr) => prev.asset.change24h > curr.asset.change24h ? prev : curr, holdings[0]);
        const worstPerformer = holdings.reduce((prev, curr) => prev.asset.change24h < curr.asset.change24h ? prev : curr, holdings[0]);

        if (bestPerformer && bestPerformer.asset.change24h > btcPerformance + 5) {
            insights.push({
                id: `perf-best-${bestPerformer.assetId}`,
                category: 'performance',
                title: `${bestPerformer.asset.symbol} Outperforming Market`,
                description: `${bestPerformer.asset.name} is up ${bestPerformer.asset.change24h}% (24h), significantly beating the benchmark.`,
                type: 'opportunity',
                severity: 'medium',
                score: 75,
                status: 'new',
                date: new Date().toISOString()
            });
        }

        if (worstPerformer && worstPerformer.asset.change24h < SEVERE_DROP_THRESHOLD) {
            insights.push({
                id: `perf-worst-${worstPerformer.assetId}`,
                category: 'performance',
                title: `Significant Drop in ${worstPerformer.asset.symbol}`,
                description: `${worstPerformer.asset.name} has dropped ${worstPerformer.asset.change24h}% in the last 24h. Review news or fundamentals.`,
                type: 'warning',
                severity: 'high',
                score: 85,
                status: 'new',
                date: new Date().toISOString()
            });
        }

        // 3. Rebalancing Suggestions
        if (holdings.length > 1) {
            const targetWeight = 1 / holdings.length;

            holdings.forEach(h => {
                const value = h.amount * h.asset.currentPrice;
                const weight = value / totalValue;
                const deviation = Math.abs(weight - targetWeight) / targetWeight;

                if (deviation > REBALANCE_DEVIATION_THRESHOLD) {
                    const isOverweight = weight > targetWeight;
                    const diffValue = Math.abs(value - (totalValue * targetWeight));
                    const diffAmount = diffValue / h.asset.currentPrice;

                    insights.push({
                        id: `reb-${h.assetId}`,
                        category: 'rebalancing',
                        title: `Rebalance Suggested: ${h.asset.symbol}`,
                        description: `${h.asset.symbol} is ${isOverweight ? 'overweight' : 'underweight'} by ${((weight - targetWeight) * 100).toFixed(1)}% relative to equal-weight target.`,
                        type: 'info',
                        severity: 'medium',
                        score: 60,
                        status: 'new',
                        date: new Date().toISOString(),
                        actionableData: {
                            assetId: h.assetId,
                            action: isOverweight ? 'sell' : 'buy',
                            amount: diffAmount
                        }
                    });
                }
            });
        }

        // 4. Temporal Analysis (Mock logic based on transactions)
        if (transactions.length > 5) {
            // Simple heuristic: count buys by day of week
            const dayCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
            transactions.forEach(t => {
                if (t.type === 'buy') {
                    const day = new Date(t.date).getDay();
                    dayCounts[day]++;
                }
            });
            // @ts-ignore
            const bestDay = Object.keys(dayCounts).reduce((a, b) => dayCounts[parseInt(a)] > dayCounts[parseInt(b)] ? a : b);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            insights.push({
                id: 'temp-activity',
                category: 'temporal',
                title: 'Activity Pattern Detected',
                description: `You tend to be most active on ${days[parseInt(bestDay)]}s. Historically, DCA strategies perform better mid-week.`,
                type: 'info',
                severity: 'low',
                score: 40,
                status: 'new',
                date: new Date().toISOString()
            });
        }

        return insights.sort((a, b) => (b.score || 0) - (a.score || 0));
    }
};
