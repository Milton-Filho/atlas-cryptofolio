import { TransactionsView } from '@/components/transactions/transactions-view';
import { MOCK_ASSETS } from '@/lib/mock-data';

export default function TransactionsPage() {
    // Start with empty transactions for first-time users
    // Keep MOCK_ASSETS as reference for asset selection
    return (
        <TransactionsView
            transactions={[]}
            assets={MOCK_ASSETS}
        />
    );
}
