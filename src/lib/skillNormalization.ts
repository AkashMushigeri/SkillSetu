/**
 * src/lib/skillNormalization.ts
 *
 * Centralized skill name normalization, synonym resolution, quality tier
 * classification, and a pluggable skill-matching interface.
 *
 * This module is the single source of truth for skill name resolution across
 * both the Industry→Candidate and Student→Opportunity matching engines.
 */

export type MatchQuality = 'EXCELLENT' | 'STRONG' | 'GOOD' | 'FAIR' | 'POOR';

export const matchQualityMeta: Record<MatchQuality, { label: string; colorClass: string }> = {
  EXCELLENT: { label: 'Excellent', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  STRONG: { label: 'Strong', colorClass: 'bg-teal-100 text-teal-800 border-teal-200' },
  GOOD: { label: 'Good', colorClass: 'bg-blue-100 text-blue-800 border-blue-200' },
  FAIR: { label: 'Fair', colorClass: 'bg-amber-100 text-amber-800 border-amber-200' },
  POOR: { label: 'Poor', colorClass: 'bg-rose-100 text-rose-800 border-rose-200' },
};

export function getQualityTier(score: number): MatchQuality {
  if (score >= 85) return 'EXCELLENT';
  if (score >= 75) return 'STRONG';
  if (score >= 60) return 'GOOD';
  if (score >= 40) return 'FAIR';
  return 'POOR';
}

/**
 * Maps canonical skill names to their known synonyms/aliases.
 * Keys are normalized canonical names (lowercase, no punctuation).
 */
export const SKILL_SYNONYMS: Record<string, string[]> = {
  python: ['python3', 'python 3', 'py', 'python scripting'],
  'machine learning': ['ml', 'machine-learning'],
  'deep learning': ['dl'],
  sql: ['structured query language'],
  'react': ['reactjs', 'react.js'],
  'next.js': ['nextjs', 'next js', 'nextjs13', 'next js 13', 'react next'],
  'tensorflow': ['tf', 'tensor flow', 'tensorflow 2.x'],
  'pytorch': ['torch'],
  'javascript': ['js'],
  'typescript': ['ts', 'typescript.js'],
  'kubernetes': ['k8s'],
  'aws': ['amazon web services', 'amazon aws'],
  'java': ['java 8', 'java 11', 'java 17'],
  'spring boot': ['springboot'],
  'node.js': ['nodejs', 'node'],
};

/** Normalizes a skill name for comparison. */
export function normalizeSkillName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\+\+/g, 'plusplus')
    .replace(/#/g, 'sharp')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

let _synonymReverseMap: Map<string, string> | null = null;

function buildSynonymReverseMap(): Map<string, string> {
  if (_synonymReverseMap) return _synonymReverseMap;
  const map = new Map<string, string>();
  for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    const normCanonical = normalizeSkillName(canonical);
    map.set(normCanonical, normCanonical);
    for (const syn of synonyms) {
      const normSyn = normalizeSkillName(syn);
      if (!map.has(normSyn)) {
        map.set(normSyn, normCanonical);
      }
    }
  }
  _synonymReverseMap = map;
  return map;
}

const synonymReverseMap = buildSynonymReverseMap();

/**
 * Returns the canonical normalized form of a skill name.
 * If the input matches a known synonym, returns the canonical name.
 * Otherwise returns the normalized input.
 */
export function getCanonicalSkillName(name: string): string {
  const normalized = normalizeSkillName(name);
  return synonymReverseMap.get(normalized) || normalized;
}

/**
 * Returns all canonical names that the input could resolve to.
 * Useful for debugging / logging unmatched skills.
 */
export function getPossibleCanonicalNames(name: string): string[] {
  const normalized = normalizeSkillName(name);
  const match = synonymReverseMap.get(normalized);
  return match ? [match] : [normalized];
}

/**
 * Checks if two skill names refer to the same skill.
 * Uses canonical name comparison so related tools do not count as the same skill.
 */
export function matchSkillNames(a: string, b: string): boolean {
  if (!a || !b) return false;
  return getCanonicalSkillName(a) === getCanonicalSkillName(b);
}

export interface SkillMatcher {
  match(a: string, b: string): boolean;
}

export class SynonymSkillMatcher implements SkillMatcher {
  match(a: string, b: string): boolean {
    return matchSkillNames(a, b);
  }
}

export const defaultSkillMatcher: SkillMatcher = new SynonymSkillMatcher();
