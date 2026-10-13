'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { getAllTemperingCurves } from '@/lib/calculations/baking/chocolate-tempering';

const curves = getAllTemperingCurves();

export function ChocolateTemperingCalculator() {
    return (
        <CalculatorBase title="Temperering av sjokolade" description="Hurtigoversikt over temperaturer"
            formula="Smelt → avkjøl → varm opp til arbeidstemperatur" onCalculate={() => { }} onReset={() => { }}
            results={
                <div className="space-y-6">
                    {curves.map(c => (
                        <div key={c.type} className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-lg mb-3">{c.label}</h3>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-red-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 mb-1">1. Smelt til</div>
                                    <div className="text-xl font-bold text-red-600">{c.meltC}°C</div>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 mb-1">2. Avkjøl til</div>
                                    <div className="text-xl font-bold text-blue-600">{c.coolC}°C</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 mb-1">3. Arbeid på</div>
                                    <div className="text-xl font-bold text-green-600">{c.workC}°C</div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-3">{c.tips}</p>
                        </div>
                    ))}
                </div>
            }
        >
            <div className="bg-amber-50 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-medium mb-1">Slik tempererer du sjokolade:</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Smelt ⅔ av sjokoladen til smeltetemperaturen</li>
                    <li>Ta av varmen og rør inn resten (⅓) i hakkede biter</li>
                    <li>Rør til sjokoladen er avkjølt til angitt temperatur</li>
                    <li>Varm raskt opp igjen til arbeidstemperaturen</li>
                    <li>Test på bakepapir: sjokoladen skal stivne innen 5 minutter og være blank</li>
                </ol>
            </div>
        </CalculatorBase>
    );
}

export default ChocolateTemperingCalculator;
