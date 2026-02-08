import { NewsView } from '@/components/news/news-view';

export default function NewsPage() {
    // Start with empty data for first-time users
    // In a real app, this would fetch from Supabase based on the authenticated user
    return (
        <NewsView
            holdings={[]}
        />
    );
}
