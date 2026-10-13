'use client';

import { labelNo, QUEST_TYPE_NAMES_NO, DIFFICULTY_NAMES_NO, QUEST_GIVER_NAMES_NO, SEVERITY_NAMES_NO } from '@/lib/calculations/rpg/labels';
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
  { value: 'fetch', label: 'Hent/skaff' },
  { value: 'rescue', label: 'Redning' },
  { value: 'escort', label: 'Eskorte' },
  { value: 'eliminate', label: 'Utrydd' },
  { value: 'investigate', label: 'Etterforsk' },
  { value: 'defend', label: 'Forsvar' },
  { value: 'explore', label: 'Utforsk' },
  { value: 'negotiate', label: 'Forhandle' },
  { value: 'heist', label: 'Kupp' },
  { value: 'competition', label: 'Konkurranse' },
];

const DIFFICULTIES: { value: QuestDifficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Lett', color: 'text-green-600' },
  { value: 'medium', label: 'Middels', color: 'text-yellow-600' },
  { value: 'hard', label: 'Vanskelig', color: 'text-orange-600' },
  { value: 'deadly', label: 'Dødelig', color: 'text-red-600' },
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
        <CardTitle>Oppdragsgenerator</CardTitle>
        <CardDescription>
          Lag tilfeldige eventyrkroker og oppdragsideer til rollespillkampanjen din
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="questType">Oppdragstype</Label>
            <select
              id="questType"
              value={questType}
              onChange={(e) => setQuestType(e.target.value as QuestType | 'random')}
              className="w-40 h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="random">Tilfeldig</option>
              {QUEST_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty">Vanskelighetsgrad</Label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as QuestDifficulty | 'random')}
              className="w-32 h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="random">Tilfeldig</option>
              {DIFFICULTIES.map(diff => (
                <option key={diff.value} value={diff.value}>{diff.label}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleGenerate}>Lag oppdrag</Button>
        </div>

        {quest && (
          <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
            <div className="border-b pb-3">
              <h3 className="text-xl font-bold text-primary">{quest.title}</h3>
              <div className="flex gap-3 text-sm mt-1">
                <span className="capitalize bg-muted px-2 py-0.5 rounded">{labelNo(QUEST_TYPE_NAMES_NO, quest.type)}</span>
                <span className={`capitalize font-medium ${getDifficultyColor(quest.difficulty)}`}>
                  {labelNo(DIFFICULTY_NAMES_NO, quest.difficulty)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Krok</p>
              <p className="italic">«{quest.hook}»</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Beskrivelse</p>
              <p>{quest.description}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Mål</p>
              <p className="font-medium">{quest.objective}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Sted</p>
              <p>{quest.location}</p>
            </div>

            <div className="bg-background rounded p-3">
              <p className="text-sm font-medium text-muted-foreground mb-1">Oppdragsgiver</p>
              <p className="font-medium">{quest.questGiver.name}</p>
              <p className="text-sm text-muted-foreground capitalize">({labelNo(QUEST_GIVER_NAMES_NO, quest.questGiver.type)})</p>
              <p className="text-sm mt-1">{quest.questGiver.description}</p>
              <p className="text-sm italic text-primary mt-1">
                Motivasjon: {quest.questGiver.motivation}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Komplikasjoner</p>
              <ul className="space-y-1">
                {quest.complications.map((comp, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className={`
                      text-xs px-1.5 py-0.5 rounded uppercase font-medium
                      ${comp.severity === 'critical' ? 'bg-red-100 text-red-700' : ''}
                      ${comp.severity === 'major' ? 'bg-orange-100 text-orange-700' : ''}
                      ${comp.severity === 'minor' ? 'bg-yellow-100 text-yellow-700' : ''}
                    `}>
                      {labelNo(SEVERITY_NAMES_NO, comp.severity)}
                    </span>
                    {comp.description}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Belønning</p>
              <p className="font-medium text-primary">{formatReward(quest)}</p>
            </div>

            {quest.timeLimit && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tidsfrist</p>
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
                  {showTwist ? 'Skjul' : 'Avslør'} Hemmelig vri (kun for spilleder)
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
            <p className="text-sm font-medium mb-2">Siste oppdrag</p>
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
          <p className="font-medium mb-1">Oppdragstyper:</p>
          <ul className="grid grid-cols-2 gap-1 text-xs">
            <li><strong>Hent:</strong> Skaff en gjenstand eller et artefakt</li>
            <li><strong>Redning:</strong> Red noen som er i fare</li>
            <li><strong>Eskorte:</strong> Beskytt noen på en reise</li>
            <li><strong>Utrydd:</strong> Beseir en trussel</li>
            <li><strong>Etterforsk:</strong> Løs en gåte</li>
            <li><strong>Forsvar:</strong> Beskytt et sted</li>
            <li><strong>Utforsk:</strong> Kartlegg ukjent land</li>
            <li><strong>Forhandle:</strong> Mekle fred eller avtaler</li>
            <li><strong>Kupp:</strong> Stjel noe verdifullt</li>
            <li><strong>Konkurranse:</strong> Vinn en konkurranse</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default QuestIdeaGenerator;
