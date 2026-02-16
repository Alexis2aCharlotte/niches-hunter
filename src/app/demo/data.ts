// Données statiques pré-remplies pour la démo — aucun appel API
import type { Niche } from "../niches/data";

export const DEMO_NICHE: Niche = {
  id: "demo-0110",
  displayCode: "0110",
  title: "Flight Deals & Price Drop Alerts",
  category: "Lifestyle",
  tags: ["TRAVEL", "DEALS", "TIKTOK", "ALERTS"],
  score: 85,
  opportunity:
    "People scroll TikTok looking for flight deals like they scroll for memes. High intent, zero friction. They want to buy. The travel deal space is booming with creators driving millions of views on fare drops.",
  gap: "Hopper predicts prices. Skyscanner compares. But nobody runs a deal feed like a TikTok account — daily drops, urgency, viral sharing. There's no app that combines real-time deal alerts with a social-first, swipeable interface.",
  move: "Build the deal feed app. TikTok-first distribution. One studio did $70K/month in 10 months with this exact model. Focus on push notifications for price drops and a community-driven deal feed.",
  stats: {
    competition: "Medium",
    potential: "Very High",
    revenue: "$50K–$100K/mo",
    market: "🌍 Global",
    timeToMVP: "6–8 weeks",
    difficulty: "Medium",
  },
  marketAnalysis: {
    totalMarketSize: "$4.2B mobile travel market",
    growthRate: "+18% YoY",
    targetAudience: "Budget-conscious travelers aged 18–35, frequent TikTok users, digital nomads",
    geographicFocus: ["🇺🇸 United States", "🇬🇧 United Kingdom", "🇩🇪 Germany", "🇫🇷 France", "🇦🇺 Australia"],
  },
  keyLearnings: [
    "TikTok-first distribution drives 60%+ of installs for top travel deal apps",
    "Push notification timing is critical — deals expire fast, users want instant alerts",
    "Affiliate revenue from booking links converts at 3–5% with high intent users",
    "Community-sourced deals create a flywheel effect — users submit deals they find",
    "Gamification (deal streaks, savings tracker) increases retention by 40%",
    "Error fares and mistake prices generate the highest viral engagement",
  ],
  improvements: [
    "Add AI-powered price prediction to tell users when to buy vs wait",
    "Build a 'Deal Feed' with swipeable cards like TikTok for flight deals",
    "Create destination-based alerts — users pick dream destinations, get notified",
    "Implement social sharing with auto-generated deal cards for Instagram/TikTok",
    "Add group trip planning — friends vote on deals together",
    "Build browser extension for real-time price comparison on airline sites",
  ],
  marketingStrategies: [
    {
      channel: "TikTok Organic",
      strategy: "Post daily deal drops with urgency hooks ('$99 NYC→Paris, expires tonight'). Use trending sounds and countdown timers. Aim for 2–3 posts per day.",
      estimatedCost: "$0 (organic)",
    },
    {
      channel: "Push Notifications",
      strategy: "Send personalized deal alerts based on user preferences. Time-sensitive deals with countdown create FOMO and drive immediate action.",
      estimatedCost: "$50/mo (OneSignal)",
    },
    {
      channel: "Instagram Reels",
      strategy: "Repurpose TikTok content with travel aesthetic. Focus on aspirational destinations with price tags overlay. Partner with travel micro-influencers.",
      estimatedCost: "$500–$2K/mo",
    },
    {
      channel: "SEO & Content",
      strategy: "Target long-tail keywords like 'cheap flights to [destination] 2025'. Create deal roundup blog posts that rank and drive app installs.",
      estimatedCost: "$200/mo",
    },
  ],
  monetization: {
    model: "Freemium + Affiliate",
    pricing: "Free tier (3 alerts/week) → Pro $4.99/mo (unlimited alerts + early access)",
    conversionRate: "8–12% free-to-paid (travel apps benchmark)",
  },
  techStack: [
    "React Native",
    "Node.js",
    "Redis (deal caching)",
    "Puppeteer (price scraping)",
    "OneSignal (push notifications)",
    "Amadeus API (flights)",
    "Skyscanner API",
    "Firebase Analytics",
    "RevenueCat (subscriptions)",
  ],
  risks: [
    "Airlines may block scraping or change APIs without notice",
    "Deal accuracy — false alerts erode user trust quickly",
    "High competition from established players (Hopper, Google Flights)",
    "Affiliate program terms can change, affecting revenue",
    "Push notification fatigue if not properly personalized",
  ],
  trending: [
    {
      name: "AirClub",
      category: "Travel",
      growth: "+340%",
      description: "Flight deal tracking app with viral TikTok distribution. $70K+ MRR proven. Built a massive following by posting daily deal drops on TikTok.",
      strongMarket: "🇺🇸 US",
      estimatedMRR: "$70K+",
      keyPoints: ["TikTok-first growth strategy", "$70K+ MRR in 10 months", "Community-driven deal submissions"],
      weakPoints: ["Single platform risk on TikTok", "Limited international coverage"],
    },
    {
      name: "Hopper",
      category: "Travel",
      growth: "+25%",
      description: "AI-powered flight and hotel booking with price prediction technology. Tells users when to buy and when to wait for better prices.",
      strongMarket: "🇺🇸 US",
      estimatedMRR: "$15M+",
      keyPoints: ["Price prediction AI with 95% accuracy", "Massive user base (100M+ downloads)", "Freeze price feature"],
      weakPoints: ["Not deal-focused — more price tool", "Heavy app, complex UX"],
    },
    {
      name: "Secret Flying",
      category: "Travel",
      growth: "+45%",
      description: "Website and newsletter sharing mistake fares and flight deals worldwide. Loyal community of deal hunters with high engagement rates.",
      strongMarket: "🌍 Global",
      estimatedMRR: "$200K+",
      keyPoints: ["Error fare specialist", "Loyal community of 2M+ members", "Newsletter-first model"],
      weakPoints: ["No native app experience", "Website-only, no push alerts"],
    },
    {
      name: "Kiwi.com",
      category: "Travel",
      growth: "+15%",
      description: "Travel search engine specialized in combining flights from different airlines to find the cheapest routes.",
      strongMarket: "🇪🇺 Europe",
      estimatedMRR: "$5M+",
      keyPoints: ["Virtual interlining technology", "Nomad mode for flexible travelers"],
      weakPoints: ["Customer service issues", "Complex booking process"],
    },
  ],
  asoOptimization: {
    primaryKeywords: ["cheap flights", "flight deals", "price drop alerts", "travel deals", "airfare tracker"],
    secondaryKeywords: ["mistake fares", "error fares", "flight sales", "budget travel", "last minute flights", "flight price monitor"],
    appNameIdeas: [
      "FlyDrop — Flight Deal Alerts",
      "DealJet — Cheap Flight Finder",
      "FareSnap — Price Drop Alerts",
    ],
  },
  locked: false,
  hasPremium: true,
  sourceType: "automated",
  publishedAt: "2025-12-15T10:00:00Z",
};

// Projet pré-rempli pour le workspace demo
export const DEMO_PROJECT = {
  id: "demo-project-1",
  name: "FlyDrop — Flight Deal Alerts",
  status: "building" as const,
  nicheCode: "0110",
  nicheTitle: "Flight Deals & Price Drop Alerts",
  createdAt: "2025-11-20T10:00:00Z",
  updatedAt: "2026-02-10T14:30:00Z",
  quickNotes: "Focus on TikTok-first distribution. AirClub proved this model works — $70K MRR in 10 months.\nKey differentiator: AI price prediction + community deal submissions.\nPriority: finish push notifications before beta launch.",
  appStoreUrl: "",
  monthlyRevenue: 0,

  // Tasks tab
  tasks: [
    { id: "t1", text: "Set up React Native project with Expo", done: true },
    { id: "t2", text: "Integrate Amadeus Flight API", done: true },
    { id: "t3", text: "Build deal feed UI (swipeable cards)", done: true },
    { id: "t4", text: "Implement push notifications (OneSignal)", done: false },
    { id: "t5", text: "Add user preferences (destinations, budget)", done: false },
    { id: "t6", text: "Set up RevenueCat for subscriptions", done: false },
    { id: "t7", text: "Create TikTok content calendar", done: false },
    { id: "t8", text: "Beta launch on TestFlight", done: false },
  ],

  // Milestones tab
  milestones: [
    { id: "m1", title: "MVP Ready", date: "2026-01-15", done: true },
    { id: "m2", title: "Beta Launch", date: "2026-03-01", done: false },
    { id: "m3", title: "App Store Launch", date: "2026-04-01", done: false },
    { id: "m4", title: "$10K MRR", date: "2026-07-01", done: false },
  ],

  // Competitors tab
  competitors: [
    { id: "c1", name: "AirClub", url: "https://airclub.app", revenue: "$70K/mo", strengths: "TikTok viral growth, strong community", weaknesses: "US-only, single platform risk", notes: "Main competitor — proved the model works." },
    { id: "c2", name: "Hopper", url: "https://hopper.com", revenue: "$15M+/mo", strengths: "Price prediction AI, massive user base", weaknesses: "Not deal-focused, complex UX", notes: "Big player but different positioning." },
    { id: "c3", name: "Secret Flying", url: "https://secretflying.com", revenue: "$200K+/mo", strengths: "Error fare specialist, loyal 2M+ community", weaknesses: "No app, website-only", notes: "Newsletter model — no push alerts." },
  ],

  // Notes tab
  notes: [
    { id: "n1", title: "TikTok Content Strategy", content: "Post 2-3 times daily. Focus on urgency hooks like '$99 NYC→Paris, expires tonight'. Use trending sounds and countdown timers. Repost best performers on Instagram Reels.", category: "Research", pinned: true },
    { id: "n2", title: "Monetization Plan", content: "Free tier: 3 alerts/week. Pro $4.99/mo: unlimited alerts + early access to deals. Affiliate revenue from booking links (3-5% conversion). Target: $10K MRR by month 6.", category: "Idea", pinned: false },
    { id: "n3", title: "Beta Feedback Checklist", content: "1. Test push notification delivery speed\n2. Validate deal accuracy rate (target >95%)\n3. Measure swipe-to-book conversion rate\n4. Test on both iOS and Android", category: "To Do", pinned: false },
  ],

  // Resources tab
  resources: [
    { id: "r1", title: "Amadeus Flight API Docs", url: "https://developers.amadeus.com", type: "Tool", description: "Primary API for flight data and pricing" },
    { id: "r2", title: "How AirClub Hit $70K MRR", url: "https://example.com/airclub-case-study", type: "Article", description: "Case study on TikTok-first growth for travel apps" },
    { id: "r3", title: "RevenueCat Setup Guide", url: "https://revenuecat.com/docs", type: "Tool", description: "Subscription management for React Native" },
    { id: "r4", title: "ASO Optimization Course", url: "https://example.com/aso-course", type: "Course", description: "Complete guide to App Store Optimization for travel apps" },
  ],

  // SWOT tab
  swot: {
    strengths: ["TikTok-first distribution (proven model)", "AI price prediction differentiator", "Low MVP cost with React Native", "Community-driven deal submissions"],
    weaknesses: ["No existing user base", "API dependency on airlines", "Solo developer resource constraints"],
    opportunities: ["$4.2B mobile travel market growing 18% YoY", "No dominant TikTok-native deal app", "Group trip planning feature gap", "Browser extension market"],
    threats: ["Airlines blocking scraping/APIs", "Hopper expanding into deals", "TikTok algorithm changes", "Affiliate program term changes"],
  },

  // Market tab
  appName: "FlyDrop",
  appTagline: "Never miss a cheap flight again",
  targetAudience: "Budget-conscious travelers aged 18–35 who actively use TikTok and want instant deal alerts without searching multiple sites.",
  uniqueSellingPoint: "The only flight deal app built for TikTok-native users — swipeable deal cards, instant push alerts, and community-sourced error fares.",
  marketNotes: "Primary markets: US, UK, Germany, France, Australia. Focus on English-speaking markets first, expand to EU after $10K MRR. Partnership opportunities with travel influencers (10K-100K followers).",
  keywords: ["cheap flights", "flight deals", "price drop alerts", "error fares", "travel deals", "budget travel"],

  // Costs tab
  costs: [
    { id: "cost1", name: "Cursor Pro", amount: 20, frequency: "monthly" as const, category: "Tools" },
    { id: "cost2", name: "ChatGPT Plus", amount: 20, frequency: "monthly" as const, category: "Tools" },
    { id: "cost3", name: "Amadeus API", amount: 49, frequency: "monthly" as const, category: "APIs" },
    { id: "cost4", name: "OneSignal (Push)", amount: 50, frequency: "monthly" as const, category: "APIs" },
    { id: "cost5", name: "Apple Developer", amount: 99, frequency: "yearly" as const, category: "Subscriptions" },
    { id: "cost6", name: "Vercel Pro", amount: 20, frequency: "monthly" as const, category: "Hosting" },
  ],
};

// Niches sauvées pour le workspace demo
export const DEMO_SAVED_NICHES = [
  {
    nicheId: "0110",
    title: "Flight Deals & Price Drop Alerts",
    savedAt: "2025-11-18T08:00:00Z",
    hasProject: true,
  },
  {
    nicheId: "0045",
    title: "Sport Companion",
    savedAt: "2026-01-05T14:30:00Z",
    hasProject: false,
  },
];

// Validations pré-remplies pour le workspace demo
export const DEMO_VALIDATIONS = [
  {
    id: "v2",
    idea: "AI Cooking Assistant",
    score: 72,
    market: "$2.8B market",
    date: "2026-01-22",
    hasProject: true,
  },
  {
    id: "v3",
    idea: "Prayer Locker",
    score: 64,
    market: "$890M market",
    date: "2026-02-03",
    hasProject: false,
  },
];

// Projet 2 — AI Cooking Assistant (lancé, avec revenues)
export const DEMO_PROJECT_2 = {
  id: "demo-project-2",
  name: "CookAI — Smart Recipe Assistant",
  status: "launched" as const,
  nicheCode: "0072",
  nicheTitle: "AI Cooking Assistant",
  createdAt: "2026-01-25T09:00:00Z",
  updatedAt: "2026-02-14T18:00:00Z",
  quickNotes: "Launched on App Store 3 weeks ago. Organic growth from TikTok recipe videos.\nFocus now on retention — daily recipe suggestions and push notifications.\nApple featured us in 'New Apps We Love' last week!",
  appStoreUrl: "https://apps.apple.com/app/cookai",
  monthlyRevenue: 3200,

  // Tasks tab
  tasks: [
    { id: "t1", text: "Design recipe card UI", done: true },
    { id: "t2", text: "Integrate OpenAI API for recipe generation", done: true },
    { id: "t3", text: "Build grocery list feature", done: true },
    { id: "t4", text: "Add meal planning calendar", done: true },
    { id: "t5", text: "Implement dietary preferences (vegan, keto, etc.)", done: true },
    { id: "t6", text: "Set up RevenueCat subscriptions", done: true },
    { id: "t7", text: "Submit to App Store", done: true },
    { id: "t8", text: "Add social sharing for recipes", done: false },
    { id: "t9", text: "Build community recipe feed", done: false },
    { id: "t10", text: "Implement voice-guided cooking mode", done: false },
  ],

  // Milestones tab
  milestones: [
    { id: "m1", title: "MVP Ready", date: "2026-01-10", done: true },
    { id: "m2", title: "App Store Launch", date: "2026-01-25", done: true },
    { id: "m3", title: "1,000 Users", date: "2026-02-05", done: true },
    { id: "m4", title: "$5K MRR", date: "2026-03-15", done: false },
    { id: "m5", title: "10,000 Users", date: "2026-04-01", done: false },
  ],

  // Competitors tab
  competitors: [
    { id: "c1", name: "Whisk", url: "https://whisk.com", revenue: "$120K/mo", strengths: "Samsung-backed, large recipe database, grocery integration", weaknesses: "No AI generation, feels corporate", notes: "Big but not AI-native." },
    { id: "c2", name: "SideChef", url: "https://sidechef.com", revenue: "$80K/mo", strengths: "Step-by-step video guides, smart appliance integration", weaknesses: "Expensive premium, limited AI features", notes: "Good UX to learn from." },
    { id: "c3", name: "Paprika", url: "https://paprikaapp.com", revenue: "$200K/mo", strengths: "Loyal user base, great recipe organization", weaknesses: "No AI, outdated UI, one-time purchase model", notes: "Proves willingness to pay for cooking apps." },
  ],

  // Notes tab
  notes: [
    { id: "n1", title: "Launch Week Results", content: "1,247 downloads in first week. 68% from TikTok, 22% from App Store search, 10% direct.\nConversion to Pro: 9.2% — above benchmark!\nTop recipe requests: quick meals, meal prep, dietary restrictions.", category: "Research", pinned: true },
    { id: "n2", title: "Retention Strategy", content: "Daily push at 5pm: 'What should I cook tonight?'\nWeekly meal plan suggestion on Sunday morning.\nStreak rewards: 7-day cooking streak = unlock premium recipes.\nTarget: 30-day retention > 25%.", category: "Idea", pinned: true },
    { id: "n3", title: "User Feedback Summary", content: "Most requested features:\n1. Voice-guided cooking (hands-free)\n2. Ingredient substitution suggestions\n3. Nutritional info per recipe\n4. Shopping list sharing with family\n5. Leftovers recipe suggestions", category: "Research", pinned: false },
  ],

  // Resources tab
  resources: [
    { id: "r1", title: "OpenAI API Cookbook", url: "https://cookbook.openai.com", type: "Tool", description: "Best practices for recipe generation prompts" },
    { id: "r2", title: "Food App Monetization Guide", url: "https://example.com/food-app-guide", type: "Article", description: "How top food apps monetize — subscription vs ads vs affiliate" },
    { id: "r3", title: "Spoonacular API", url: "https://spoonacular.com/food-api", type: "Tool", description: "Nutritional data and ingredient database" },
    { id: "r4", title: "TikTok Food Creator Playbook", url: "https://example.com/tiktok-food", type: "Article", description: "How to grow a food account on TikTok from 0 to 100K" },
  ],

  // SWOT tab
  swot: {
    strengths: ["AI-native recipe generation (unique)", "Low cost per user (API-based)", "Strong TikTok organic growth", "High conversion rate (9.2%)"],
    weaknesses: ["OpenAI API cost scales with users", "No proprietary recipe database yet", "Single developer team"],
    opportunities: ["$2.8B food-tech app market growing fast", "Voice-guided cooking is untapped", "Partnership with grocery delivery apps", "B2B potential (meal kit companies)"],
    threats: ["OpenAI pricing changes", "Big players adding AI features", "Recipe copyright concerns", "User fatigue with AI-generated content"],
  },

  // Market tab
  appName: "CookAI",
  appTagline: "Your AI sous-chef in your pocket",
  targetAudience: "Home cooks aged 22–40 who want quick, personalized recipe ideas based on what they have in their fridge. Health-conscious, time-constrained, and comfortable with AI.",
  uniqueSellingPoint: "The only cooking app that generates unique recipes from your available ingredients using AI, with step-by-step guidance and automatic grocery lists.",
  marketNotes: "Launched Jan 25. App Store featured in 'New Apps We Love'. Primary market: US (72%), UK (15%), Canada (8%). Focus on English-speaking markets. TikTok content strategy driving 68% of installs.",
  keywords: ["AI cooking", "recipe generator", "meal planner", "smart recipes", "cooking assistant", "what to cook"],

  // Costs tab
  costs: [
    { id: "cost1", name: "OpenAI API", amount: 180, frequency: "monthly" as const, category: "APIs" },
    { id: "cost2", name: "Spoonacular API", amount: 29, frequency: "monthly" as const, category: "APIs" },
    { id: "cost3", name: "Vercel Pro", amount: 20, frequency: "monthly" as const, category: "Hosting" },
    { id: "cost4", name: "RevenueCat", amount: 0, frequency: "monthly" as const, category: "Tools" },
    { id: "cost5", name: "Apple Developer", amount: 99, frequency: "yearly" as const, category: "Subscriptions" },
    { id: "cost6", name: "Cursor Pro", amount: 20, frequency: "monthly" as const, category: "Tools" },
  ],

  // Revenue data (launched project)
  revenueHistory: [
    { month: "Jan 2026", amount: 480 },
    { month: "Feb 2026", amount: 3200 },
  ],
  revenueGoal: 5000,
  totalUsers: 3420,
  paidUsers: 315,
  conversionRate: 9.2,
};
