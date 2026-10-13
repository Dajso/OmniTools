'use client';

import { labelNo, CLASS_NAMES_NO } from '@/lib/calculations/rpg/labels';
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import {
  calculateCharacterStats,
  formatModifier,
  getSkillDisplayName,
  getAbilityDisplayName,
  ALL_SKILLS,
  SKILL_ABILITIES,
  ABILITY_ABBREVIATIONS,
  CLASS_HIT_DICE,
  CLASS_SAVING_THROWS,
  STANDARD_ARRAY,
  calculatePointBuyCost,
  type AbilityScore,
  type AbilityScores,
  type SkillProficiencies,
  type ProficiencyLevel,
} from '@/lib/calculations/rpg/character-sheet-helper';

const ABILITIES: AbilityScore[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const CLASSES = Object.keys(CLASS_HIT_DICE);

export function CharacterSheetHelper() {
  const [level, setLevel] = React.useState(1);
  const [selectedClass, setSelectedClass] = React.useState('fighter');
  const [abilityScores, setAbilityScores] = React.useState<AbilityScores>({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });
  const [skillProficiencies, setSkillProficiencies] = React.useState<SkillProficiencies>({});
  const [savingThrowProficiencies, setSavingThrowProficiencies] = React.useState<AbilityScore[]>([]);

  // Update saving throws when class changes
  React.useEffect(() => {
    setSavingThrowProficiencies(CLASS_SAVING_THROWS[selectedClass] || []);
  }, [selectedClass]);

  const stats = calculateCharacterStats({
    level,
    abilityScores,
    skillProficiencies,
    savingThrowProficiencies,
    hitDice: CLASS_HIT_DICE[selectedClass],
  });

  const pointBuyCost = calculatePointBuyCost(abilityScores);

  const handleAbilityChange = (ability: AbilityScore, value: number) => {
    setAbilityScores(prev => ({
      ...prev,
      [ability]: Math.max(1, Math.min(30, value)),
    }));
  };

  const handleSkillProficiencyChange = (skill: string) => {
    setSkillProficiencies(prev => {
      const current = prev[skill] || 'none';
      const next: ProficiencyLevel = current === 'none' ? 'proficient' : current === 'proficient' ? 'expertise' : 'none';
      return { ...prev, [skill]: next };
    });
  };

  const handleSavingThrowToggle = (ability: AbilityScore) => {
    setSavingThrowProficiencies(prev => 
      prev.includes(ability) 
        ? prev.filter(a => a !== ability)
        : [...prev, ability]
    );
  };

  const applyStandardArray = () => {
    const sorted = [...STANDARD_ARRAY];
    setAbilityScores({
      strength: sorted[0],
      dexterity: sorted[1],
      constitution: sorted[2],
      intelligence: sorted[3],
      wisdom: sorted[4],
      charisma: sorted[5],
    });
  };

  const resetAll = () => {
    setLevel(1);
    setSelectedClass('fighter');
    setAbilityScores({
      strength: 10, dexterity: 10, constitution: 10,
      intelligence: 10, wisdom: 10, charisma: 10,
    });
    setSkillProficiencies({});
    setSavingThrowProficiencies(CLASS_SAVING_THROWS['fighter']);
  };

  // Group skills by ability
  const skillsByAbility = ABILITIES.reduce((acc, ability) => {
    acc[ability] = ALL_SKILLS.filter(skill => SKILL_ABILITIES[skill] === ability);
    return acc;
  }, {} as Record<AbilityScore, string[]>);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Karakterark-hjelper</CardTitle>
        <CardDescription>
          Regn ut egenskapsmodifikatorer, ferdighetsbonuser og andre verdier for D&D 5e-karakterer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="level">Karakternivå</Label>
            <Input
              id="level"
              type="number"
              min={1}
              max={20}
              value={level}
              onChange={(e) => setLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">Klasse</Label>
            <select
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              {CLASSES.map(cls => (
                <option key={cls} value={cls}>
                  {labelNo(CLASS_NAMES_NO, cls)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={applyStandardArray}>
            Bruk standardrekken
          </Button>
          <Button variant="outline" size="sm" onClick={resetAll}>
            Nullstill alt
          </Button>
        </div>

        {/* Ability Scores */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base font-semibold">Egenskapsverdier</Label>
            <span className="text-sm text-muted-foreground">
              Poengkjøp: {pointBuyCost}/27
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {ABILITIES.map(ability => (
              <div key={ability} className="text-center space-y-1">
                <Label className="text-xs uppercase tracking-wide">
                  {ABILITY_ABBREVIATIONS[ability]}
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={abilityScores[ability]}
                  onChange={(e) => handleAbilityChange(ability, parseInt(e.target.value) || 10)}
                  className="text-center"
                />
                <div className="text-lg font-bold text-primary">
                  {formatModifier(stats.abilityModifiers[ability])}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ResultDisplay label="Ferdighetsbonus" value={formatModifier(stats.proficiencyBonus)} />
          <ResultDisplay label="Initiativ" value={formatModifier(stats.initiative)} />
          <ResultDisplay label="Rustningsklasse (AC)" value={stats.armorClass} />
          <ResultDisplay label="Treffpoeng (HP)" value={stats.hitPointMaximum} />
        </div>

        {/* Passive Scores */}
        <div className="grid grid-cols-3 gap-3">
          <ResultDisplay label="Passiv oppmerksomhet" value={stats.passivePerception} />
          <ResultDisplay label="Passiv undersøkelse" value={stats.passiveInvestigation} />
          <ResultDisplay label="Passiv innsikt" value={stats.passiveInsight} />
        </div>

        {/* Saving Throws */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Redningskast</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {ABILITIES.map(ability => {
              const isProficient = savingThrowProficiencies.includes(ability);
              return (
                <button
                  key={ability}
                  onClick={() => handleSavingThrowToggle(ability)}
                  className={`
                    p-2 rounded-md border text-center transition-colors
                    ${isProficient 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-muted/30 border-border hover:bg-muted/50'}
                  `}
                >
                  <div className="text-xs uppercase">{ABILITY_ABBREVIATIONS[ability]}</div>
                  <div className="font-bold">{formatModifier(stats.savingThrows[ability])}</div>
                  {isProficient && <div className="text-xs">●</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Ferdigheter</Label>
          <p className="text-xs text-muted-foreground">
            Klikk for å bytte: Ingen → Dyktig (●) → Ekspert (●●)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ABILITIES.map(ability => (
              <div key={ability} className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground uppercase">
                  {ABILITY_ABBREVIATIONS[ability]}
                </div>
                {skillsByAbility[ability].map(skill => {
                  const proficiency = skillProficiencies[skill] || 'none';
                  return (
                    <button
                      key={skill}
                      onClick={() => handleSkillProficiencyChange(skill)}
                      className={`
                        w-full flex justify-between items-center px-2 py-1 rounded text-sm
                        transition-colors text-left
                        ${proficiency !== 'none' 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-muted/50'}
                      `}
                    >
                      <span className="flex items-center gap-1">
                        <span className="w-6 text-center">
                          {proficiency === 'expertise' ? '●●' : proficiency === 'proficient' ? '●' : '○'}
                        </span>
                        {getSkillDisplayName(skill)}
                      </span>
                      <span className="font-mono font-bold">
                        {formatModifier(stats.skillModifiers[skill])}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Reference Info */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md space-y-2">
          <p className="font-medium">Hurtigoversikt:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Egenskapsmodifikator = (verdi − 10) ÷ 2 (rundet ned)</li>
            <li>Ferdighetsbonus: +2 på nivå 1, øker hvert fjerde nivå</li>
            <li>Ferdighetsprøve = d20 + egenskapsmodifikator + ferdighetsbonus (hvis dyktig)</li>
            <li>Ekspertise dobler ferdighetsbonusen for den ferdigheten</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default CharacterSheetHelper;
