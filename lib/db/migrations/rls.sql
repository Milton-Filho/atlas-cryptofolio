-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Organizations
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (clerk_org_id = current_setting('request.headers', true)::json->>'x-clerk-org-id');

CREATE POLICY "Service role has full access to organizations"
  ON organizations FOR ALL
  USING (true);

-- Users
CREATE POLICY "Users can view users in their organization"
  ON users FOR SELECT
  USING (organization_id::text = current_setting('request.headers', true)::json->>'x-organization-id');

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (clerk_user_id = current_setting('request.headers', true)::json->>'x-clerk-user-id');

CREATE POLICY "Service role has full access to users"
  ON users FOR ALL
  USING (true);

-- Wallets
CREATE POLICY "Users can manage wallets in their organization"
  ON wallets FOR ALL
  USING (organization_id::text = current_setting('request.headers', true)::json->>'x-organization-id');

-- Assets (Public Read)
CREATE POLICY "Assets are publicly readable"
  ON assets FOR SELECT
  USING (true);

CREATE POLICY "Only service role can modify assets"
  ON assets FOR ALL
  USING (current_user = 'service_role');

-- Transactions
CREATE POLICY "Users can manage transactions in their organization"
  ON transactions FOR ALL
  USING (organization_id::text = current_setting('request.headers', true)::json->>'x-organization-id');

-- Holdings
CREATE POLICY "Users can view holdings in their organization"
  ON holdings FOR SELECT
  USING (organization_id::text = current_setting('request.headers', true)::json->>'x-organization-id');

CREATE POLICY "Service role has full access to holdings"
  ON holdings FOR ALL
  USING (true);

-- Price Snapshots (Public Read)
CREATE POLICY "Price snapshots are publicly readable"
  ON price_snapshots FOR SELECT
  USING (true);

CREATE POLICY "Only service role can insert price snapshots"
  ON price_snapshots FOR INSERT
  WITH CHECK (current_user = 'service_role');

-- Insights
CREATE POLICY "Users can manage insights in their organization"
  ON insights FOR ALL
  USING (organization_id::text = current_setting('request.headers', true)::json->>'x-organization-id');

-- News Bookmarks
CREATE POLICY "Users can manage their own bookmarks"
  ON news_bookmarks FOR ALL
  USING (user_id::text = current_setting('request.headers', true)::json->>'x-clerk-user-id');

-- Price Alerts
CREATE POLICY "Users can manage their own alerts"
  ON price_alerts FOR ALL
  USING (user_id::text = current_setting('request.headers', true)::json->>'x-clerk-user-id');
