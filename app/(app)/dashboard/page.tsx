"use client";

import { DashboardView } from '@/components/dashboard/dashboard-view';

export default function DashboardPage() {
    // Start with empty data for first-time users
    // In a real app, this would fetch from Supabase based on the authenticated user
    return (
        <DashboardView
            holdings={[]}
            wallets={[]}
            transactions={[]}
            onAddTransaction={(walletId) => console.log('Add Transaction', walletId)}
            onQuickAction={(action) => console.log('Quick Action', action)}
        />
    );
}
