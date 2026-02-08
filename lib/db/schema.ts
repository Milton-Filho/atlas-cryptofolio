import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  numeric,
  boolean,
  jsonb,
  index,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Organizations
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkOrgId: text('clerk_org_id').unique().notNull(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  plan: text('plan').notNull().default('free'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  clerkOrgIdIdx: index('idx_organizations_clerk_org_id').on(table.clerkOrgId),
  slugIdx: index('idx_organizations_slug').on(table.slug),
}));

// Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: text('clerk_user_id').unique().notNull(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  
  preferredCurrency: text('preferred_currency').default('USD'),
  timezone: text('timezone').default('UTC'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  clerkUserIdIdx: index('idx_users_clerk_user_id').on(table.clerkUserId),
  organizationIdIdx: index('idx_users_organization_id').on(table.organizationId),
  emailIdx: index('idx_users_email').on(table.email),
}));

// Wallets
export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  name: text('name').notNull(),
  description: text('description'),
  goal: text('goal'),
  color: text('color').default('#3b82f6'),
  icon: text('icon').default('wallet'),
  isDefault: boolean('is_default').default(false),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  organizationIdIdx: index('idx_wallets_organization_id').on(table.organizationId),
  userIdIdx: index('idx_wallets_user_id').on(table.userId),
  createdAtIdx: index('idx_wallets_created_at').on(table.createdAt),
}));

// Assets
export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  coingeckoId: text('coingecko_id').unique().notNull(),
  symbol: text('symbol').notNull(),
  name: text('name').notNull(),
  
  logoUrl: text('logo_url'),
  description: text('description'),
  websiteUrl: text('website_url'),
  categories: text('categories').array(),
  
  currentPriceUsd: numeric('current_price_usd', { precision: 20, scale: 8 }),
  marketCapUsd: numeric('market_cap_usd', { precision: 20, scale: 2 }),
  volume24hUsd: numeric('volume_24h_usd', { precision: 20, scale: 2 }),
  priceChange24h: numeric('price_change_24h', { precision: 10, scale: 4 }),
  lastUpdated: timestamp('last_updated', { withTimezone: true }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  coingeckoIdIdx: index('idx_assets_coingecko_id').on(table.coingeckoId),
  symbolIdx: index('idx_assets_symbol').on(table.symbol),
  nameIdx: index('idx_assets_name').on(table.name),
}));

// Transactions
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  walletId: uuid('wallet_id').notNull().references(() => wallets.id, { onDelete: 'cascade' }),
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'restrict' }),
  
  type: text('type').notNull(),
  quantity: numeric('quantity', { precision: 20, scale: 8 }).notNull(),
  pricePerUnitUsd: numeric('price_per_unit_usd', { precision: 20, scale: 8 }).notNull(),
  totalValueUsd: numeric('total_value_usd', { precision: 20, scale: 2 }).notNull(),
  feeUsd: numeric('fee_usd', { precision: 20, scale: 2 }).default('0'),
  
  exchange: text('exchange'),
  notes: text('notes'),
  receiptUrl: text('receipt_url'),
  
  transactionDate: timestamp('transaction_date', { withTimezone: true }).notNull(),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  organizationIdIdx: index('idx_transactions_organization_id').on(table.organizationId),
  walletIdIdx: index('idx_transactions_wallet_id').on(table.walletId),
  assetIdIdx: index('idx_transactions_asset_id').on(table.assetId),
  dateIdx: index('idx_transactions_date').on(table.transactionDate),
  typeIdx: index('idx_transactions_type').on(table.type),
}));

// Holdings
export const holdings = pgTable('holdings', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  walletId: uuid('wallet_id').notNull().references(() => wallets.id, { onDelete: 'cascade' }),
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'restrict' }),
  
  totalQuantity: numeric('total_quantity', { precision: 20, scale: 8 }).notNull().default('0'),
  averageBuyPriceUsd: numeric('average_buy_price_usd', { precision: 20, scale: 8 }).notNull().default('0'),
  totalInvestedUsd: numeric('total_invested_usd', { precision: 20, scale: 2 }).notNull().default('0'),
  realizedPnlUsd: numeric('realized_pnl_usd', { precision: 20, scale: 2 }).notNull().default('0'),
  
  lastCalculatedAt: timestamp('last_calculated_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  organizationIdIdx: index('idx_holdings_organization_id').on(table.organizationId),
  walletIdIdx: index('idx_holdings_wallet_id').on(table.walletId),
  assetIdIdx: index('idx_holdings_asset_id').on(table.assetId),
}));

// Price Snapshots
export const priceSnapshots = pgTable('price_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  
  priceUsd: numeric('price_usd', { precision: 20, scale: 8 }).notNull(),
  marketCapUsd: numeric('market_cap_usd', { precision: 20, scale: 2 }),
  volume24hUsd: numeric('volume_24h_usd', { precision: 20, scale: 2 }),
  
  snapshotAt: timestamp('snapshot_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  assetIdIdx: index('idx_price_snapshots_asset_id').on(table.assetId),
  snapshotAtIdx: index('idx_price_snapshots_snapshot_at').on(table.snapshotAt),
}));

// Insights
export const insights = pgTable('insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  walletId: uuid('wallet_id').references(() => wallets.id, { onDelete: 'cascade' }),
  
  type: text('type').notNull(),
  severity: text('severity').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  metadata: jsonb('metadata'),
  
  isRead: boolean('is_read').default(false),
  isApplied: boolean('is_applied').default(false),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  organizationIdIdx: index('idx_insights_organization_id').on(table.organizationId),
  walletIdIdx: index('idx_insights_wallet_id').on(table.walletId),
  typeIdx: index('idx_insights_type').on(table.type),
  createdAtIdx: index('idx_insights_created_at').on(table.createdAt),
}));

// News Bookmarks
export const newsBookmarks = pgTable('news_bookmarks', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  newsUrl: text('news_url').notNull(),
  title: text('title').notNull(),
  source: text('source'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  organizationIdIdx: index('idx_news_bookmarks_organization_id').on(table.organizationId),
  userIdIdx: index('idx_news_bookmarks_user_id').on(table.userId),
  createdAtIdx: index('idx_news_bookmarks_created_at').on(table.createdAt),
}));

// Price Alerts
export const priceAlerts = pgTable('price_alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  
  type: text('type').notNull(),
  targetPriceUsd: numeric('target_price_usd', { precision: 20, scale: 8 }).notNull(),
  isTriggered: boolean('is_triggered').default(false),
  triggeredAt: timestamp('triggered_at', { withTimezone: true }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  organizationIdIdx: index('idx_price_alerts_organization_id').on(table.organizationId),
  userIdIdx: index('idx_price_alerts_user_id').on(table.userId),
  assetIdIdx: index('idx_price_alerts_asset_id').on(table.assetId),
}));

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  wallets: many(wallets),
  transactions: many(transactions),
  holdings: many(holdings),
  insights: many(insights),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  wallets: many(wallets),
  newsBookmarks: many(newsBookmarks),
  priceAlerts: many(priceAlerts),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [wallets.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
  holdings: many(holdings),
  insights: many(insights),
}));

export const assetsRelations = relations(assets, ({ many }) => ({
  transactions: many(transactions),
  holdings: many(holdings),
  priceSnapshots: many(priceSnapshots),
  priceAlerts: many(priceAlerts),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  organization: one(organizations, {
    fields: [transactions.organizationId],
    references: [organizations.id],
  }),
  wallet: one(wallets, {
    fields: [transactions.walletId],
    references: [wallets.id],
  }),
  asset: one(assets, {
    fields: [transactions.assetId],
    references: [assets.id],
  }),
}));
