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
 * Récupère toutes les niches depuis l'API sécurisée
 * L'API masque les données sensibles pour les niches verrouillées
 */
export async function fetchAllNiches(): Promise<{ niches: Niche[], hasActiveSubscription: boolean }> {
  try {
    const response = await fetch('/api/niches', {
      method: 'GET',
      credentials: 'include', // Important pour envoyer les cookies
    });

    if (!response.ok) {
      console.error('Error fetching niches:', response.statusText);
      return { niches: [], hasActiveSubscription: false };
    }

    const data = await response.json();
    
    return {
      niches: (data.niches || []).map(transformSupabaseToNiche),
      hasActiveSubscription: data.hasActiveSubscription || false,
    };
  } catch (error) {
    console.error('Error fetching niches:', error);
    return { niches: [], hasActiveSubscription: false };
  }
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
