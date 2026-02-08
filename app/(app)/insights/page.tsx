import { InsightsView } from '@/components/insights/insights-view';

export default function InsightsPage() {
    // Start with empty data for first-time users
    // In a real app, this would fetch from Supabase based on the authenticated user
    return (
        <InsightsView
            holdings={[]}
            transactions={[]}
        />
    );
}
