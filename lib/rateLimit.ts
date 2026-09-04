import { createServiceClient } from './supabase/server';

const LIMITS = {
  free: {
    papersPerDay: 5,
    aiSolvesPerDay: 3,
    aiChecksPerDay: 2,
    mockMaker: false,
    thresholdGuesser: false,
    paperGuesser: false,
  },
  pro: {
    papersPerDay: Infinity,
    aiSolvesPerDay: 50,
    aiChecksPerDay: 30,
    mockMaker: true,
    thresholdGuesser: false,
    paperGuesser: false,
  },
  premium: {
    papersPerDay: Infinity,
    aiSolvesPerDay: Infinity,
    aiChecksPerDay: Infinity,
    mockMaker: true,
    thresholdGuesser: true,
    paperGuesser: true,
  },
} as const;

export type Plan = keyof typeof LIMITS;
export type FeatureKey = 'papers' | 'aiSolves' | 'aiChecks' | 'mockMaker' | 'thresholdGuesser' | 'paperGuesser';

export async function checkRateLimit(
  userId: string,
  feature: FeatureKey,
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const supabase = createServiceClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single();

  const plan = (profile?.plan ?? 'free') as Plan;
  const limits = LIMITS[plan];

  // Feature flags (boolean)
  if (feature === 'mockMaker' || feature === 'thresholdGuesser' || feature === 'paperGuesser') {
    const allowed = limits[feature];
    return { allowed, remaining: allowed ? 1 : 0, limit: 1 };
  }

  // Daily counters
  const limitsMap = {
    papers: limits.papersPerDay,
    aiSolves: limits.aiSolvesPerDay,
    aiChecks: limits.aiChecksPerDay,
  } as const;
  const limit = limitsMap[feature as 'papers' | 'aiSolves' | 'aiChecks'];
  if (limit === Infinity) return { allowed: true, remaining: Infinity, limit: Infinity };

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const table = `usage_${feature}`;
  const { count } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today.toISOString());

  const used = count ?? 0;
  const remaining = Math.max(0, limit - used);
  return { allowed: used < limit, remaining, limit };
}

export async function recordUsage(userId: string, feature: FeatureKey) {
  if (feature === 'mockMaker' || feature === 'thresholdGuesser' || feature === 'paperGuesser') return;
  const supabase = createServiceClient();
  const table = `usage_${feature}`;
  await supabase.from(table).insert({ user_id: userId });
}