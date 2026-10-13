'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Instagram, TrendingUp, Users, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import {
  calculateEngagementRate,
  estimateReach,
  formatEngagementRate,
  formatNumber,
  getFollowerTier,
  ENGAGEMENT_BENCHMARKS,
  FOLLOWER_TIER_BENCHMARKS,
  type InstagramEngagementResult,
} from '@/lib/calculations/creator/instagram-engagement';

const RATING_COLORS: Record<string, string> = {
  excellent: 'text-green-600 bg-green-100',
  good: 'text-blue-600 bg-blue-100',
  average: 'text-yellow-600 bg-yellow-100',
  below_average: 'text-orange-600 bg-orange-100',
  low: 'text-red-600 bg-red-100',
};

export function InstagramEngagementCalculator() {
  const [followers, setFollowers] = React.useState(10000);
  const [likes, setLikes] = React.useState(500);
  const [comments, setComments] = React.useState(25);
  const [shares, setShares] = React.useState(10);
  const [saves, setSaves] = React.useState(50);
  const [posts, setPosts] = React.useState(1);
  const [results, setResults] = React.useState<InstagramEngagementResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      setError(null);
      const result = calculateEngagementRate({
        followers,
        likes,
        comments,
        shares,
        saves,
        posts,
      });
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beregningsfeil');
      setResults(null);
    }
  }, [followers, likes, comments, shares, saves, posts]);

  const estimatedReach = results ? estimateReach(followers, results.engagementRate) : 0;
  const followerTier = getFollowerTier(followers);
  const tierData = FOLLOWER_TIER_BENCHMARKS[followerTier];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="h-5 w-5 text-pink-600" />
          Engasjementsrate på Instagram
        </CardTitle>
        <CardDescription>
          Regn ut engasjementsraten din på Instagram og sammenlign med bransjens normaltall
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Account Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            Kontoinformasjon
          </div>
          <NumberInput
            id="followers"
            label="Følgere totalt"
            value={followers}
            onChange={setFollowers}
            min={1}
            step={100}
          />
          <NumberInput
            id="posts"
            label="Antall innlegg (til snittet)"
            value={posts}
            onChange={setPosts}
            min={1}
            max={100}
            step={1}
          />
        </div>

        {/* Engagement Metrics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Engasjement (totalt for alle innleggene)
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="likes"
              label={
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3 text-red-500" /> Likerklikk
                </span>
              }
              value={likes}
              onChange={setLikes}
              min={0}
              step={10}
            />
            <NumberInput
              id="comments"
              label={
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3 text-blue-500" /> Kommentarer
                </span>
              }
              value={comments}
              onChange={setComments}
              min={0}
              step={1}
            />
            <NumberInput
              id="shares"
              label={
                <span className="flex items-center gap-1">
                  <Share2 className="h-3 w-3 text-green-500" /> Delinger
                </span>
              }
              value={shares}
              onChange={setShares}
              min={0}
              step={1}
            />
            <NumberInput
              id="saves"
              label={
                <span className="flex items-center gap-1">
                  <Bookmark className="h-3 w-3 text-purple-500" /> Lagringer
                </span>
              }
              value={saves}
              onChange={setSaves}
              min={0}
              step={1}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-4 pt-4 border-t">
            <ResultDisplay
              label="Engasjementsrate"
              value={formatEngagementRate(results.engagementRate)}
              highlight
              copyable
            />

            {/* Rating Badge */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Vurdering:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${RATING_COLORS[results.rating]}`}>
                {ENGAGEMENT_BENCHMARKS[results.rating].label}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              {results.benchmarkComparison}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Engasjement totalt"
                value={formatNumber(results.totalEngagements)}
              />
              <ResultDisplay
                label="Snitt per innlegg"
                value={formatNumber(results.averageEngagementsPerPost)}
              />
              <ResultDisplay
                label="Anslått rekkevidde"
                value={formatNumber(estimatedReach)}
              />
              <ResultDisplay
                label="Størrelse på konto"
                value={tierData.label}
              />
            </div>

            {/* Benchmark Comparison */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium">Normaltall etter antall følgere</p>
              <div className="space-y-2">
                {Object.entries(FOLLOWER_TIER_BENCHMARKS).map(([tier, data]) => (
                  <div
                    key={tier}
                    className={`flex justify-between text-sm p-2 rounded ${
                      tier === followerTier ? 'bg-primary/10 font-medium' : ''
                    }`}
                  >
                    <span>{data.label}</span>
                    <span>{data.avgEngagement}% i snitt</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Rating Scale */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium">Skala for engasjementsrate</p>
              <div className="space-y-2">
                {Object.entries(ENGAGEMENT_BENCHMARKS).map(([rating, data]) => (
                  <div
                    key={rating}
                    className={`flex justify-between text-sm p-2 rounded ${
                      rating === results.rating ? RATING_COLORS[rating] : ''
                    }`}
                  >
                    <span>{data.label} ({data.min}%+)</span>
                    <span className="text-muted-foreground">{data.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md space-y-2">
          <p className="font-medium">Slik fungerer det:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Engasjementsrate = (likerklikk + kommentarer + delinger + lagringer) ÷ følgere × 100</li>
            <li>Høyere engasjementsrate betyr et mer aktivt og engasjert publikum</li>
            <li>Engasjementsraten synker vanligvis når antall følgere øker</li>
            <li>Lagringer og delinger veier tungt i Instagram-algoritmen</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstagramEngagementCalculator;
