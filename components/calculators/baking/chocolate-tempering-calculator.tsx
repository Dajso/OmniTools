'use client';

import * as React from 'react';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { getAllTemperingCurves } from '@/lib/calculations/baking/chocolate-tempering';

const curves = getAllTemperingCurves();

export function ChocolateTemperingCalculator() {
    return (
        <CalculatorBase title="Chocolate Tempering Temperatures" description="Quick reference for tempering curves"
            formula="Melt → Cool → Reheat to working temp" onCalculate={() => { }} onReset={() => { }}
            results={
                <div className="space-y-6">
                    {curves.map(c => (
                        <div key={c.type} className="rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-lg mb-3">{c.label}</h3>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-red-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 mb-1">1. Melt to</div>
                                    <div className="text-xl font-bold text-red-600">{c.meltC}°C</div>
                                    <div className="text-sm text-gray-500">{c.meltF}°F</div>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 mb-1">2. Cool to</div>
                                    <div className="text-xl font-bold text-blue-600">{c.coolC}°C</div>
                                    <div className="text-sm text-gray-500">{c.coolF}°F</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 mb-1">3. Work at</div>
                                    <div className="text-xl font-bold text-green-600">{c.workC}°C</div>
                                    <div className="text-sm text-gray-500">{c.workF}°F</div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-3">{c.tips}</p>
                        </div>
                    ))}
                </div>
            }
        >
            <div className="bg-amber-50 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-medium mb-1">How to temper chocolate:</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Melt ⅔ of chocolate to the melt temperature</li>
                    <li>Remove from heat, add remaining ⅓ chopped chocolate</li>
                    <li>Stir until cooled to cool temperature</li>
                    <li>Briefly reheat to working temperature</li>
                    <li>Test on parchment — should set within 5 minutes with a glossy finish</li>
                </ol>
            </div>
        </CalculatorBase>
    );
}

export default ChocolateTemperingCalculator;
