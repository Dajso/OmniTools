'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { ResultDisplay } from '@/components/ui/result-display';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Users, Receipt, ArrowRight } from 'lucide-react';

interface Person {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

interface SplitResult {
  totalExpenses: number;
  perPersonShare: number;
  balances: Record<string, number>;
  settlements: Settlement[];
}

const createPerson = (name: string): Person => ({
  id: crypto.randomUUID(),
  name,
});

const createExpense = (paidBy: string, splitBetween: string[]): Expense => ({
  id: crypto.randomUUID(),
  description: '',
  amount: 0,
  paidBy,
  splitBetween,
});

export function TravelBudgetSplitter() {
  const [people, setPeople] = React.useState<Person[]>([
    createPerson('Person 1'),
    createPerson('Person 2'),
  ]);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [newPersonName, setNewPersonName] = React.useState('');
  const [results, setResults] = React.useState<SplitResult | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const addPerson = () => {
    if (newPersonName.trim()) {
      setPeople(prev => [...prev, createPerson(newPersonName.trim())]);
      setNewPersonName('');
    }
  };

  const removePerson = (id: string) => {
    if (people.length > 2) {
      setPeople(prev => prev.filter(p => p.id !== id));
      setExpenses(prev => prev.filter(e => 
        e.paidBy !== id && !e.splitBetween.includes(id)
      ).map(e => ({
        ...e,
        splitBetween: e.splitBetween.filter(pid => pid !== id),
      })));
    }
  };

  const addExpense = () => {
    if (people.length > 0) {
      setExpenses(prev => [...prev, createExpense(people[0].id, people.map(p => p.id))]);
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const updateExpense = (id: string, field: keyof Expense, value: string | number | string[]) => {
    setExpenses(prev => prev.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const toggleSplitPerson = (expenseId: string, personId: string) => {
    setExpenses(prev => prev.map(e => {
      if (e.id !== expenseId) return e;
      const isIncluded = e.splitBetween.includes(personId);
      return {
        ...e,
        splitBetween: isIncluded 
          ? e.splitBetween.filter(id => id !== personId)
          : [...e.splitBetween, personId],
      };
    }));
  };

  const calculate = React.useCallback(() => {
    try {
      setError(undefined);
      
      const validExpenses = expenses.filter(e => e.amount > 0 && e.splitBetween.length > 0);
      
      if (validExpenses.length === 0) {
        setResults(null);
        return;
      }

      // Calculate total and balances
      const totalExpenses = validExpenses.reduce((sum, e) => sum + e.amount, 0);
      const balances: Record<string, number> = {};
      
      // Initialize balances
      people.forEach(p => {
        balances[p.id] = 0;
      });

      // Calculate what each person paid and owes
      validExpenses.forEach(expense => {
        const sharePerPerson = expense.amount / expense.splitBetween.length;
        
        // Person who paid gets credit
        balances[expense.paidBy] += expense.amount;
        
        // Everyone in split owes their share
        expense.splitBetween.forEach(personId => {
          balances[personId] -= sharePerPerson;
        });
      });

      // Calculate settlements (simplified debt resolution)
      const settlements: Settlement[] = [];
      const debtors = Object.entries(balances)
        .filter(([, balance]) => balance < -0.01)
        .map(([id, balance]) => ({ id, balance }))
        .sort((a, b) => a.balance - b.balance);
      
      const creditors = Object.entries(balances)
        .filter(([, balance]) => balance > 0.01)
        .map(([id, balance]) => ({ id, balance }))
        .sort((a, b) => b.balance - a.balance);

      let debtorIndex = 0;
      let creditorIndex = 0;

      while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
        const debtor = debtors[debtorIndex];
        const creditor = creditors[creditorIndex];
        
        const amount = Math.min(-debtor.balance, creditor.balance);
        
        if (amount > 0.01) {
          settlements.push({
            from: debtor.id,
            to: creditor.id,
            amount: Math.round(amount * 100) / 100,
          });
        }

        debtor.balance += amount;
        creditor.balance -= amount;

        if (Math.abs(debtor.balance) < 0.01) debtorIndex++;
        if (Math.abs(creditor.balance) < 0.01) creditorIndex++;
      }

      const perPersonShare = totalExpenses / people.length;

      setResults({
        totalExpenses,
        perPersonShare,
        balances,
        settlements,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResults(null);
    }
  }, [expenses, people]);

  const reset = () => {
    setPeople([createPerson('Person 1'), createPerson('Person 2')]);
    setExpenses([]);
    setNewPersonName('');
    setResults(null);
    setError(undefined);
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const getPersonName = (id: string): string => {
    return people.find(p => p.id === id)?.name || 'Unknown';
  };

  return (
    <CalculatorBase
      title="Travel Budget Splitter"
      description="Split travel expenses fairly among your group"
      onReset={reset}
      error={error}
      results={results && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <ResultDisplay 
              label="Total Expenses" 
              value={`$${results.totalExpenses.toFixed(2)}`}
              highlight 
              copyable 
            />
            <ResultDisplay 
              label="Per Person (Equal)" 
              value={`$${results.perPersonShare.toFixed(2)}`}
              copyable 
            />
          </div>

          {/* Individual Balances */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Individual Balances</p>
            <div className="grid gap-2">
              {people.map(person => {
                const balance = results.balances[person.id] || 0;
                const isPositive = balance > 0.01;
                const isNegative = balance < -0.01;
                
                return (
                  <div 
                    key={person.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isPositive ? 'bg-green-50 text-green-700' :
                      isNegative ? 'bg-red-50 text-red-700' :
                      'bg-muted'
                    }`}
                  >
                    <span className="font-medium">{person.name}</span>
                    <span className="font-bold">
                      {isPositive ? '+' : ''}{balance.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Settlements */}
          {results.settlements.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Who Pays Whom</p>
              <div className="space-y-2">
                {results.settlements.map((settlement, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-red-600">
                          {getPersonName(settlement.from)}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-green-600">
                          {getPersonName(settlement.to)}
                        </span>
                      </div>
                      <span className="text-xl font-bold">
                        ${settlement.amount.toFixed(2)}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {results.settlements.length === 0 && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
              Everyone is settled up! No payments needed.
            </div>
          )}
        </div>
      )}
    >
      <div className="space-y-4">
        {/* People */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <p className="text-sm font-medium">People ({people.length})</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {people.map(person => (
              <div 
                key={person.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full"
              >
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => setPeople(prev => prev.map(p => 
                    p.id === person.id ? { ...p, name: e.target.value } : p
                  ))}
                  className="bg-transparent border-none text-sm w-24 focus:outline-none"
                />
                {people.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removePerson(person.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              placeholder="Add person..."
              className="flex-1 px-3 py-1.5 text-sm border rounded-md bg-background"
              onKeyDown={(e) => e.key === 'Enter' && addPerson()}
            />
            <Button type="button" variant="outline" size="sm" onClick={addPerson}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expenses */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <p className="text-sm font-medium">Expenses</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addExpense}>
              <Plus className="h-4 w-4 mr-1" />
              Add Expense
            </Button>
          </div>

          {expenses.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No expenses yet. Click "Add Expense" to start tracking.
            </p>
          )}

          {expenses.map((expense, index) => (
            <Card key={expense.id} className="p-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Expense {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Description</label>
                    <input
                      type="text"
                      value={expense.description}
                      onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                      placeholder="e.g., Dinner"
                      className="w-full px-3 py-1.5 text-sm border rounded-md bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Amount ($)</label>
                    <input
                      type="number"
                      value={expense.amount || ''}
                      onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-1.5 text-sm border rounded-md bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Paid by</label>
                  <select
                    value={expense.paidBy}
                    onChange={(e) => updateExpense(expense.id, 'paidBy', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border rounded-md bg-background"
                  >
                    {people.map(person => (
                      <option key={person.id} value={person.id}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Split between</label>
                  <div className="flex flex-wrap gap-2">
                    {people.map(person => (
                      <label 
                        key={person.id}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer text-sm ${
                          expense.splitBetween.includes(person.id)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={expense.splitBetween.includes(person.id)}
                          onChange={() => toggleSplitPerson(expense.id, person.id)}
                          className="sr-only"
                        />
                        {person.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </CalculatorBase>
  );
}

export default TravelBudgetSplitter;
