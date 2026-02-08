import { WalletsView } from '@/components/wallets/wallets-view';

export default function WalletsPage() {
    // Start with empty data for first-time users
    // In a real app, this would fetch from Supabase based on the authenticated user
    return (
        <WalletsView
            wallets={[]}
            holdings={[]}
        />
    );
}
