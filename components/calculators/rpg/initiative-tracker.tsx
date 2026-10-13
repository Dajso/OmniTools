'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ChevronUp, ChevronDown, Play, RotateCcw, Skull, Heart } from 'lucide-react';
import { rollDice } from '@/lib/calculations/rpg/dice-roller';

interface Combatant {
  id: number;
  name: string;
  initiative: number;
  hp?: number;
  maxHp?: number;
  ac?: number;
  isPlayer: boolean;
  conditions: string[];
  isDefeated: boolean;
}

const CONDITIONS = [
  'Blendet', 'Sjarmert', 'Døv', 'Livredd', 'Grepet',
  'Udyktig', 'Usynlig', 'Lammet', 'Forstenet', 'Forgiftet',
  'Liggende', 'Fastholdt', 'Bedøvet', 'Bevisstløs', 'Utmattet',
];

export function InitiativeTracker() {
  const [combatants, setCombatants] = React.useState<Combatant[]>([]);
  const [currentTurn, setCurrentTurn] = React.useState(0);
  const [round, setRound] = React.useState(1);
  const [isInCombat, setIsInCombat] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [newInitiative, setNewInitiative] = React.useState('');
  const [newHp, setNewHp] = React.useState('');
  const [newAc, setNewAc] = React.useState('');
  const [isPlayer, setIsPlayer] = React.useState(true);
  const idRef = React.useRef(0);

  const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);

  const addCombatant = () => {
    if (!newName.trim()) return;

    const initiative = newInitiative ? parseInt(newInitiative) : rollDice('1d20').total;
    const hp = newHp ? parseInt(newHp) : undefined;

    idRef.current += 1;
    const newCombatant: Combatant = {
      id: idRef.current,
      name: newName.trim(),
      initiative,
      hp,
      maxHp: hp,
      ac: newAc ? parseInt(newAc) : undefined,
      isPlayer,
      conditions: [],
      isDefeated: false,
    };

    setCombatants(prev => [...prev, newCombatant]);
    setNewName('');
    setNewInitiative('');
    setNewHp('');
    setNewAc('');
  };

  const removeCombatant = (id: number) => {
    setCombatants(prev => prev.filter(c => c.id !== id));
  };

  const updateInitiative = (id: number, delta: number) => {
    setCombatants(prev => prev.map(c => 
      c.id === id ? { ...c, initiative: c.initiative + delta } : c
    ));
  };

  const updateHp = (id: number, delta: number) => {
    setCombatants(prev => prev.map(c => {
      if (c.id !== id || c.hp === undefined) return c;
      const newHp = Math.max(0, c.hp + delta);
      return { 
        ...c, 
        hp: newHp,
        isDefeated: newHp === 0,
      };
    }));
  };

  const toggleCondition = (id: number, condition: string) => {
    setCombatants(prev => prev.map(c => {
      if (c.id !== id) return c;
      const hasCondition = c.conditions.includes(condition);
      return {
        ...c,
        conditions: hasCondition 
          ? c.conditions.filter(cond => cond !== condition)
          : [...c.conditions, condition],
      };
    }));
  };

  const toggleDefeated = (id: number) => {
    setCombatants(prev => prev.map(c => 
      c.id === id ? { ...c, isDefeated: !c.isDefeated } : c
    ));
  };

  const startCombat = () => {
    if (combatants.length === 0) return;
    setIsInCombat(true);
    setCurrentTurn(0);
    setRound(1);
  };

  const nextTurn = () => {
    const activeCombatants = sortedCombatants.filter(c => !c.isDefeated);
    if (activeCombatants.length === 0) return;

    let nextIndex = currentTurn + 1;
    
    // Skip defeated combatants
    while (nextIndex < sortedCombatants.length && sortedCombatants[nextIndex].isDefeated) {
      nextIndex++;
    }

    if (nextIndex >= sortedCombatants.length) {
      // New round
      setRound(prev => prev + 1);
      // Find first non-defeated combatant
      nextIndex = sortedCombatants.findIndex(c => !c.isDefeated);
      if (nextIndex === -1) nextIndex = 0;
    }

    setCurrentTurn(nextIndex);
  };

  const resetCombat = () => {
    setIsInCombat(false);
    setCurrentTurn(0);
    setRound(1);
    setCombatants(prev => prev.map(c => ({
      ...c,
      hp: c.maxHp,
      conditions: [],
      isDefeated: false,
    })));
  };

  const clearAll = () => {
    setCombatants([]);
    setIsInCombat(false);
    setCurrentTurn(0);
    setRound(1);
  };

  const rollAllInitiative = () => {
    setCombatants(prev => prev.map(c => ({
      ...c,
      initiative: rollDice('1d20').total,
    })));
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Initiativliste</CardTitle>
        <CardDescription>
          Hold styr på kamprekkefølge, HP og tilstander i møtene dine
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Combatant Form */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1 lg:col-span-2">
              <Label htmlFor="name" className="text-xs">Navn</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Goblin, kriger osv."
                onKeyDown={(e) => e.key === 'Enter' && addCombatant()}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="initiative" className="text-xs">Initiativ</Label>
              <Input
                id="initiative"
                type="number"
                value={newInitiative}
                onChange={(e) => setNewInitiative(e.target.value)}
                placeholder="Automatisk kast"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hp" className="text-xs">HP</Label>
              <Input
                id="hp"
                type="number"
                value={newHp}
                onChange={(e) => setNewHp(e.target.value)}
                placeholder="Valgfritt"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ac" className="text-xs">AC</Label>
              <Input
                id="ac"
                type="number"
                value={newAc}
                onChange={(e) => setNewAc(e.target.value)}
                placeholder="Valgfritt"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPlayer}
                onChange={(e) => setIsPlayer(e.target.checked)}
                className="rounded"
              />
              Spillerkarakter
            </label>
            <Button onClick={addCombatant} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Legg til
            </Button>
          </div>
        </div>

        {/* Combat Controls */}
        {combatants.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {!isInCombat ? (
              <>
                <Button onClick={startCombat}>
                  <Play className="h-4 w-4 mr-2" />
                  Start kamp
                </Button>
                <Button variant="outline" onClick={rollAllInitiative}>
                  Kast initiativ for alle
                </Button>
              </>
            ) : (
              <>
                <Button onClick={nextTurn}>
                  Neste tur
                </Button>
                <Button variant="outline" onClick={resetCombat}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Nullstill
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={clearAll}>
              Fjern alle
            </Button>
          </div>
        )}

        {/* Round Counter */}
        {isInCombat && (
          <div className="text-center bg-primary/10 rounded-lg p-3">
            <span className="text-lg font-bold">Runde {round}</span>
          </div>
        )}

        {/* Combatant List */}
        {sortedCombatants.length > 0 ? (
          <div className="space-y-2">
            {sortedCombatants.map((combatant, index) => (
              <div
                key={combatant.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                  ${isInCombat && index === currentTurn ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50'}
                  ${combatant.isDefeated ? 'opacity-50' : ''}
                `}
              >
                {/* Initiative */}
                <div className="flex flex-col items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => updateInitiative(combatant.id, 1)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold w-8 text-center">
                    {combatant.initiative}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => updateInitiative(combatant.id, -1)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Name and Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate ${combatant.isPlayer ? 'text-blue-600' : 'text-red-600'}`}>
                      {combatant.name}
                    </span>
                    {combatant.ac && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">
                        AC {combatant.ac}
                      </span>
                    )}
                  </div>
                  
                  {/* Conditions */}
                  {combatant.conditions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {combatant.conditions.map(cond => (
                        <span
                          key={cond}
                          className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded cursor-pointer"
                          onClick={() => toggleCondition(combatant.id, cond)}
                        >
                          {cond} ×
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* HP Controls */}
                {combatant.hp !== undefined && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={() => updateHp(combatant.id, -1)}
                    >
                      -
                    </Button>
                    <span className={`w-16 text-center font-mono ${
                      combatant.hp === 0 ? 'text-red-600' :
                      combatant.hp <= (combatant.maxHp || 0) / 2 ? 'text-orange-600' : ''
                    }`}>
                      {combatant.hp}/{combatant.maxHp}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-green-600"
                      onClick={() => updateHp(combatant.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleDefeated(combatant.id)}
                    title={combatant.isDefeated ? 'Gjenopplive' : 'Beseir'}
                  >
                    {combatant.isDefeated ? (
                      <Heart className="h-4 w-4 text-green-600" />
                    ) : (
                      <Skull className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive"
                    onClick={() => removeCombatant(combatant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Legg til deltakere for å begynne å følge initiativet
          </div>
        )}

        {/* Conditions Quick Add */}
        {combatants.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Legg til tilstand</p>
            <div className="flex flex-wrap gap-1">
              {CONDITIONS.map(condition => (
                <Button
                  key={condition}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    const current = sortedCombatants[currentTurn];
                    if (current) toggleCondition(current.id, condition);
                  }}
                  disabled={!isInCombat}
                >
                  {condition}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <p className="font-medium mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>La initiativ stå tomt for å kaste 1d20 automatisk</li>
            <li>Blå navn er spillere, røde er fiender</li>
            <li>Klikk på tilstander for å fjerne dem</li>
            <li>Bruk hodeskallen for å markere beseirede deltakere</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default InitiativeTracker;
