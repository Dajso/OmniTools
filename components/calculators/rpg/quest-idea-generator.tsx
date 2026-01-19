'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  generateQuest,
  type Quest,
  type QuestType,
  type QuestDifficulty,
} from '@/lib/calculations/rpg/quest-generator';

const QUEST_TYPES: { value: QuestType; label: string }[] = [
  { value: 'fetch', label: 'Fetch/Retrieve' },
  { value: 'rescue', label: 'Rescue' },
  { value: 'escort', label: 'Escort' },
  { value: 'eliminate', label: 'Eliminate' },
  { value: 'investigate', label: 'Investigate' },
  { value: 'defend', label: 'Defend' },
  { value: 'explore', label: 'Explore' },
  { value: 'negotiate', label: 'Negotiate' },
  { value: 'heist', label: 'Heist' },
  { value: 'competition', label: 'Competition' },
];

const DIFFICULTIES: { value: QuestDifficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: 'text-green-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'hard', label: 'Hard', color: 'text-orange-600' },
  { value: 'deadly', label: 'Deadly', color: 'text-red-600' },
];

export function QuestIdeaGenerator() {
  const [questType, setQuestType] = React.useState<QuestType | 'random'>('random');
  const [difficulty, setDifficulty] = React.useState<QuestDifficulty | 'random'>('random');
  const [quest, setQuest] = React.useState<Quest | null>(null);
  const [history, setHistory] = React.useState<Quest[]>([]);
  const [showTwist, setShowTwist] = React.useState(false);

  const handleGenerate = () => {
    const newQuest = generateQuest({
      type: questType === 'random' ? undefined : questType,
      difficulty: difficulty === 'random' ? undefined : difficulty,
    });
    setQuest(newQuest);
    setShowTwist(false);
    setHistory(prev => [newQuest, ...prev.slice(0, 4)]);
  };

  const loadFromHistory = (q: Quest) => {
    setQuest(q);
    setShowTwist(false);
  };

  const getDifficultyColor = (diff: QuestDifficulty): string => {
    return DIFFICULTIES.find(d => d.value === diff)?.color || '';
  };

  const formatReward = (quest: Quest): string => {
    const parts: string[] = [`${quest.reward.gold} gp`];
    if (quest.reward.items) {
      parts.push(...quest.reward.items);
    }
    if (quest.reward.reputation) {
      parts.push(quest.reward.reputation);
    }
    return parts.join(', ');
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Quest Idea Generator</CardTitle>
        <CardDescription>
          Generate random adventure hooks and quest ideas for your RPG campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="questType">Quest Type</Label>
            <select
              id="questType"
              value={questType}
              onChange={(e) => setQuestType(e.target.value as QuestType | 'random')}
              className="w-40 h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="random">Random</option>
              {QUEST_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as QuestDifficulty | 'random')}
              className="w-32 h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="random">Random</option>
              {DIFFICULTIES.map(diff => (
                <option key={diff.value} value={diff.value}>{diff.label}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleGenerate}>Generate Quest</Button>
        </div>

        {quest && (
          <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
            <div className="border-b pb-3">
              <h3 className="text-xl font-bold text-primary">{quest.title}</h3>
              <div className="flex gap-3 text-sm mt-1">
                <span className="capitalize bg-muted px-2 py-0.5 rounded">{quest.type}</span>
                <span className={`capitalize font-medium ${getDifficultyColor(quest.difficulty)}`}>
                  {quest.difficulty}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Hook</p>
              <p className="italic">&ldquo;{quest.hook}&rdquo;</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p>{quest.description}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Objective</p>
              <p className="font-medium">{quest.objective}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p>{quest.location}</p>
            </div>

            <div className="bg-background rounded p-3">
              <p className="text-sm font-medium text-muted-foreground mb-1">Quest Giver</p>
              <p className="font-medium">{quest.questGiver.name}</p>
              <p className="text-sm text-muted-foreground capitalize">({quest.questGiver.type})</p>
              <p className="text-sm mt-1">{quest.questGiver.description}</p>
              <p className="text-sm italic text-primary mt-1">
                Motivation: {quest.questGiver.motivation}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Complications</p>
              <ul className="space-y-1">
                {quest.complications.map((comp, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className={`
                      text-xs px-1.5 py-0.5 rounded uppercase font-medium
                      ${comp.severity === 'critical' ? 'bg-red-100 text-red-700' : ''}
                      ${comp.severity === 'major' ? 'bg-orange-100 text-orange-700' : ''}
                      ${comp.severity === 'minor' ? 'bg-yellow-100 text-yellow-700' : ''}
                    `}>
                      {comp.severity}
                    </span>
                    {comp.description}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Reward</p>
              <p className="font-medium text-primary">{formatReward(quest)}</p>
            </div>

            {quest.timeLimit && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time Limit</p>
                <p className="text-orange-600">{quest.timeLimit}</p>
              </div>
            )}

            {quest.secretTwist && (
              <div className="border-t pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTwist(!showTwist)}
                >
                  {showTwist ? 'Hide' : 'Reveal'} Secret Twist (GM Only)
                </Button>
                {showTwist && (
                  <p className="mt-2 text-sm bg-red-50 text-red-800 p-2 rounded border border-red-200">
                    🔒 {quest.secretTwist}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {history.length > 1 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Recent Quests</p>
            <div className="flex flex-wrap gap-2">
              {history.slice(1).map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => loadFromHistory(q)}
                  className="text-xs"
                >
                  {q.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Quest Types:</p>
          <ul className="grid grid-cols-2 gap-1 text-xs">
            <li><strong>Fetch:</strong> Retrieve an item or artifact</li>
            <li><strong>Rescue:</strong> Save someone in danger</li>
            <li><strong>Escort:</strong> Protect someone on a journey</li>
            <li><strong>Eliminate:</strong> Defeat a threat</li>
            <li><strong>Investigate:</strong> Solve a mystery</li>
            <li><strong>Defend:</strong> Protect a location</li>
            <li><strong>Explore:</strong> Map unknown territory</li>
            <li><strong>Negotiate:</strong> Broker peace or deals</li>
            <li><strong>Heist:</strong> Steal something valuable</li>
            <li><strong>Competition:</strong> Win a contest</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default QuestIdeaGenerator;
