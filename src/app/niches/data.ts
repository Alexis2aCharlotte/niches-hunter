import { supabase } from '@/lib/supabase';
import type { NicheRow } from '@/lib/database.types';

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

export interface TrendingApp {
  name: string;
  category: string;
  growth: string;
  description: string;
  strongMarket: string;
  estimatedMRR: string;
  keyPoints: string[];
  weakPoints: string[];
}

export interface MarketingStrategy {
  channel: string;
  strategy: string;
  estimatedCost: string;
}

export const APPLE_CATEGORIES = [
  "All",
  "Education",
  "Entertainment", 
  "Health & Fitness",
  "Lifestyle",
  "Productivity",
  "Finance",
  "Social Networking",
  "Games",
  "Photo & Video",
  "Utilities",
] as const;

export type AppleCategory = typeof APPLE_CATEGORIES[number];

export interface Niche {
  id: string;
  displayCode: string;
  title: string;
  category: AppleCategory;
  tags: string[];
  score: number;
  opportunity: string;
  gap: string;
  move: string;
  stats: {
    competition: string;
    potential: string;
    revenue: string;
    market: string;
    timeToMVP: string;
    difficulty: string;
  };
  marketAnalysis: {
    totalMarketSize: string;
    growthRate: string;
    targetAudience: string;
    geographicFocus: string[];
  };
  keyLearnings: string[];
  improvements: string[];
  marketingStrategies: MarketingStrategy[];
  monetization: {
    model: string;
    pricing: string;
    conversionRate: string;
  };
  techStack: string[];
  risks: string[];
  trending: TrendingApp[];
  locked?: boolean;
  hasPremium?: boolean;
  createdAt?: string;
  publishedAt?: string;
}

// ─────────────────────────────────────────────────────────────────
// TRANSFORMER: Supabase Row → Frontend Niche
// ─────────────────────────────────────────────────────────────────

function transformSupabaseToNiche(row: NicheRow): Niche {
  return {
    id: row.id,
    displayCode: row.display_code || row.id,
    title: row.title,
    category: row.category as AppleCategory,
    tags: row.tags || [],
    score: row.score || 0,
    opportunity: row.opportunity,
    gap: row.gap,
    move: row.move,
    stats: row.stats || {
      competition: "",
      potential: "",
      revenue: "",
      market: "",
      timeToMVP: "",
      difficulty: ""
    },
    marketAnalysis: row.market_analysis || {
      totalMarketSize: "",
      growthRate: "",
      targetAudience: "",
      geographicFocus: []
    },
    keyLearnings: row.key_learnings || [],
    improvements: row.improvements || [],
    marketingStrategies: row.marketing_strategies || [],
    monetization: row.monetization || {
      model: "",
      pricing: "",
      conversionRate: ""
    },
    techStack: row.tech_stack || [],
    risks: row.risks || [],
    trending: row.trending || [],
    locked: row.locked || false,
    hasPremium: row.has_premium || false,
    createdAt: row.created_at,
    publishedAt: row.published_at || undefined,
  };
}

// ─────────────────────────────────────────────────────────────────
// SUPABASE FUNCTIONS
// ─────────────────────────────────────────────────────────────────

/**
 * Récupère toutes les niches depuis Supabase
 */
export async function fetchAllNiches(): Promise<Niche[]> {
  const { data, error } = await supabase
    .from('niches')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching niches:', error);
    return [];
  }

  return (data || []).map(transformSupabaseToNiche);
}

/**
 * Récupère une niche par son display_code depuis Supabase
 */
export async function fetchNicheByCode(displayCode: string): Promise<Niche | null> {
  const { data, error } = await supabase
    .from('niches')
    .select('*')
    .eq('display_code', displayCode)
    .single();

  if (error) {
    console.error('Error fetching niche:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  return transformSupabaseToNiche(data);
}

/**
 * Récupère les niches par catégorie
 */
export async function fetchNichesByCategory(category: AppleCategory): Promise<Niche[]> {
  if (category === 'All') {
    return fetchAllNiches();
  }

  const { data, error } = await supabase
    .from('niches')
    .select('*')
    .eq('category', category)
    .order('score', { ascending: false });

  if (error) {
    console.error('Error fetching niches by category:', error);
    return [];
  }

  return (data || []).map(transformSupabaseToNiche);
}
