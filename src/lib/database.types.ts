// Types générés pour Supabase
// Correspond aux tables créées dans la DB

export interface Database {
  public: {
    Tables: {
      niches: {
        Row: NicheRow;
        Insert: NicheInsert;
        Update: Partial<NicheInsert>;
      };
      newsletter_editions: {
        Row: NewsletterEditionRow;
        Insert: NewsletterEditionInsert;
        Update: Partial<NewsletterEditionInsert>;
      };
      app_cooldowns: {
        Row: AppCooldownRow;
        Insert: AppCooldownInsert;
        Update: Partial<AppCooldownInsert>;
      };
      subscribers: {
        Row: SubscriberRow;
        Insert: SubscriberInsert;
        Update: Partial<SubscriberInsert>;
      };
      niche_purchases: {
        Row: NichePurchaseRow;
        Insert: NichePurchaseInsert;
        Update: Partial<NichePurchaseInsert>;
      };
      subscriptions: {
        Row: SubscriptionRow;
        Insert: SubscriptionInsert;
        Update: Partial<SubscriptionInsert>;
      };
      saved_niches: {
        Row: SavedNicheRow;
        Insert: SavedNicheInsert;
        Update: Partial<SavedNicheInsert>;
      };
      customers: {
        Row: CustomerRow;
        Insert: CustomerInsert;
        Update: Partial<CustomerInsert>;
      };
    };
  };
}

// ─────────────────────────────────────────────────────────────────
// NICHES
// ─────────────────────────────────────────────────────────────────

export interface NicheStats {
  competition: string;
  potential: string;
  revenue: string;
  market: string;
  timeToMVP: string;
  difficulty: string;
}

export interface NicheMarketAnalysis {
  totalMarketSize: string;
  growthRate: string;
  targetAudience: string;
  geographicFocus: string[];
}

export interface NicheMarketingStrategy {
  channel: string;
  strategy: string;
  estimatedCost: string;
}

export interface NicheMonetization {
  model: string;
  pricing: string;
  conversionRate: string;
}

export interface NicheTrendingApp {
  name: string;
  category: string;
  growth: string;
  description: string;
  strongMarket: string;
  estimatedMRR: string;
  keyPoints: string[];
  weakPoints: string[];
}

export interface NicheASOOptimization {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  appNameIdeas: string[];
}

export interface NicheRow {
  id: string;
  display_code: string;
  title: string;
  category: string;
  tags: string[];
  score: number;
  opportunity: string;
  gap: string;
  move: string;
  stats: NicheStats;
  market_analysis: NicheMarketAnalysis;
  key_learnings: string[];
  improvements: string[];
  risks: string[];
  tech_stack: string[];
  marketing_strategies: NicheMarketingStrategy[];
  monetization: NicheMonetization;
  trending: NicheTrendingApp[];
  aso_optimization: NicheASOOptimization | null;
  locked: boolean;
  has_premium: boolean;
  source_app_ids: string[];
  source_type: 'automated' | 'demand_based' | null;
  created_at: string;
  published_at: string | null;
}

export interface NicheInsert {
  id: string;
  title: string;
  category: string;
  tags?: string[];
  score?: number;
  opportunity: string;
  gap: string;
  move: string;
  stats?: NicheStats;
  market_analysis?: NicheMarketAnalysis;
  key_learnings?: string[];
  improvements?: string[];
  risks?: string[];
  tech_stack?: string[];
  marketing_strategies?: NicheMarketingStrategy[];
  monetization?: NicheMonetization;
  trending?: NicheTrendingApp[];
  aso_optimization?: NicheASOOptimization | null;
  locked?: boolean;
  has_premium?: boolean;
  source_app_ids?: string[];
  source_type?: 'automated' | 'demand_based' | null;
  published_at?: string | null;
}

// ─────────────────────────────────────────────────────────────────
// NEWSLETTER EDITIONS
// ─────────────────────────────────────────────────────────────────

export interface NewsletterNicheApp {
  id?: string;
  name: string;
  rank: number;
  country: string;
  category?: string;
  insight?: string;
}

export interface NewsletterNiche {
  niche_number: number;
  title: string;
  emoji?: string;
  color?: string;
  apps_count: number;
  opportunity?: string;
  weakness?: string;
  apps: NewsletterNicheApp[];
  cta_url?: string;
}

export interface NewsletterContent {
  niches: NewsletterNiche[];
  your_move?: {
    teaser: string;
    target_country?: string;
  };
}

export interface NewsletterEditionRow {
  id: string;
  edition_date: string;
  subject: string;
  niches: NewsletterContent;
  total_apps_mentioned: number;
  sent_at: string | null;
  total_recipients: number | null;
  open_rate: number | null;
  click_rate: number | null;
  created_at: string;
}

export interface NewsletterEditionInsert {
  edition_date: string;
  subject: string;
  niches: NewsletterContent;
  total_apps_mentioned?: number;
  sent_at?: string | null;
  total_recipients?: number | null;
  open_rate?: number | null;
  click_rate?: number | null;
}

// ─────────────────────────────────────────────────────────────────
// APP COOLDOWNS
// ─────────────────────────────────────────────────────────────────

export interface AppCooldownRow {
  id: string;
  app_id: string;
  app_name: string | null;
  newsletter_edition_id: string | null;
  niche_id: string | null;
  used_at: string;
  cooldown_until: string;
}

export interface AppCooldownInsert {
  app_id: string;
  app_name?: string | null;
  newsletter_edition_id?: string | null;
  niche_id?: string | null;
  cooldown_until?: string;
}

// ─────────────────────────────────────────────────────────────────
// SUBSCRIBERS
// ─────────────────────────────────────────────────────────────────

export interface SubscriberRow {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
  source: string;
}

export interface SubscriberInsert {
  email: string;
  is_active?: boolean;
  source?: string;
}

// ─────────────────────────────────────────────────────────────────
// NICHE PURCHASES
// ─────────────────────────────────────────────────────────────────

export interface NichePurchaseRow {
  id: string;
  user_id: string | null;
  niche_id: string;
  amount: number;
  currency: string;
  stripe_payment_id: string | null;
  stripe_session_id: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  completed_at: string | null;
}

export interface NichePurchaseInsert {
  user_id?: string | null;
  niche_id: string;
  amount: number;
  currency?: string;
  stripe_payment_id?: string | null;
  stripe_session_id?: string | null;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
}

// ─────────────────────────────────────────────────────────────────
// SUBSCRIPTIONS
// ─────────────────────────────────────────────────────────────────

export interface SubscriptionRow {
  id: string;
  user_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  canceled_at: string | null;
}

export interface SubscriptionInsert {
  user_id?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  status?: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
}

// ─────────────────────────────────────────────────────────────────
// SAVED NICHES (Favoris)
// ─────────────────────────────────────────────────────────────────

export interface SavedNicheRow {
  id: string;
  user_id: string;
  niche_id: string;
  saved_at: string;
}

export interface SavedNicheInsert {
  user_id: string;
  niche_id: string;
}

// ─────────────────────────────────────────────────────────────────
// CUSTOMERS (table unifiée des clients payants)
// ─────────────────────────────────────────────────────────────────

export interface CustomerRow {
  id: string;
  email: string;
  user_id: string | null;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  plan_type: 'monthly' | 'lifetime';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerInsert {
  email: string;
  user_id?: string | null;
  stripe_customer_id: string;
  stripe_subscription_id?: string | null;
  plan_type: 'monthly' | 'lifetime';
  status?: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
}

