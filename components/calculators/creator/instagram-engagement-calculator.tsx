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
      setError(err instanceof Error ? err.message : 'Calculation error');
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
          Instagram Engagement Calculator
        </CardTitle>
        <CardDescription>
          Calculate your Instagram engagement rate and compare to industry benchmarks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Account Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            Account Information
          </div>
          <NumberInput
            id="followers"
            label="Total Followers"
            value={followers}
            onChange={setFollowers}
            min={1}
            step={100}
          />
          <NumberInput
            id="posts"
            label="Number of Posts (to average)"
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
            Engagement Metrics (total across posts)
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              id="likes"
              label={
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3 text-red-500" /> Likes
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
                  <MessageCircle className="h-3 w-3 text-blue-500" /> Comments
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
                  <Share2 className="h-3 w-3 text-green-500" /> Shares
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
                  <Bookmark className="h-3 w-3 text-purple-500" /> Saves
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
              label="Engagement Rate"
              value={formatEngagementRate(results.engagementRate)}
              highlight
              copyable
            />

            {/* Rating Badge */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Rating:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${RATING_COLORS[results.rating]}`}>
                {ENGAGEMENT_BENCHMARKS[results.rating].label}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              {results.benchmarkComparison}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Total Engagements"
                value={formatNumber(results.totalEngagements)}
              />
              <ResultDisplay
                label="Avg per Post"
                value={formatNumber(results.averageEngagementsPerPost)}
              />
              <ResultDisplay
                label="Estimated Reach"
                value={formatNumber(estimatedReach)}
              />
              <ResultDisplay
                label="Follower Tier"
                value={tierData.label}
              />
            </div>

            {/* Benchmark Comparison */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium">Industry Benchmarks by Follower Count</p>
              <div className="space-y-2">
                {Object.entries(FOLLOWER_TIER_BENCHMARKS).map(([tier, data]) => (
                  <div
                    key={tier}
                    className={`flex justify-between text-sm p-2 rounded ${
                      tier === followerTier ? 'bg-primary/10 font-medium' : ''
                    }`}
                  >
                    <span>{data.label}</span>
                    <span>{data.avgEngagement}% avg</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Rating Scale */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium">Engagement Rate Scale</p>
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
          <p className="font-medium">How it works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Engagement Rate = (Likes + Comments + Shares + Saves) / Followers × 100</li>
            <li>Higher engagement rates indicate a more active, engaged audience</li>
            <li>Engagement typically decreases as follower count increases</li>
            <li>Saves and shares are weighted heavily by the Instagram algorithm</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstagramEngagementCalculator;
