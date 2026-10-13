'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResultDisplay } from '@/components/ui/result-display';
import {
    generateCron,
    CRON_PRESETS,
    type CronParts,
} from '@/lib/calculations/productivity/cron-generator';
import { Copy, Check } from 'lucide-react';

const FIELD_OPTIONS = {
    minute: ['*', '0', '15', '30', '45', '*/5', '*/10', '*/15', '*/30'],
    hour: ['*', '0', '1', '2', '3', '6', '9', '12', '15', '18', '21', '*/2', '*/4', '*/6'],
    dayOfMonth: ['*', '1', '15', '*/2', '1,15'],
    month: ['*', '1', '3', '6', '9', '12', '*/3', '*/6'],
    dayOfWeek: ['*', '0', '1', '2', '3', '4', '5', '6', '1-5', '0,6'],
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CronGenerator() {
    const [parts, setParts] = React.useState<CronParts>({
        minute: '0',
        hour: '*',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '*',
    });
    const [copied, setCopied] = React.useState(false);

    const result = React.useMemo(() => generateCron(parts), [parts]);

    const updatePart = (field: keyof CronParts, value: string) => {
        setParts(prev => ({ ...prev, [field]: value }));
    };

    const applyPreset = (preset: typeof CRON_PRESETS[number]) => {
        setParts({ ...preset.parts });
    };

    const copyExpression = async () => {
        await navigator.clipboard.writeText(result.expression);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Cron-generator</CardTitle>
                <CardDescription>
                    Bygg cron-uttrykk med en visuell planlegger
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Presets */}
                <div className="space-y-2">
                    <Label>Hurtigvalg</Label>
                    <div className="flex flex-wrap gap-2">
                        {CRON_PRESETS.slice(0, 6).map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted transition-colors"
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cron Fields */}
                <div className="grid grid-cols-5 gap-2">
                    {(['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'] as const).map((field) => (
                        <div key={field} className="space-y-1.5">
                            <Label className="text-xs text-center block">
                                {field === 'dayOfMonth' ? 'Dag (måned)' :
                                    field === 'dayOfWeek' ? 'Dag (uke)' :
                                        field.charAt(0).toUpperCase() + field.slice(1)}
                            </Label>
                            <input
                                type="text"
                                value={parts[field]}
                                onChange={(e) => updatePart(field, e.target.value)}
                                className="w-full px-2 py-1.5 border rounded-md text-center text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <select
                                value={parts[field]}
                                onChange={(e) => updatePart(field, e.target.value)}
                                className="w-full px-1 py-1 border rounded-md text-xs"
                            >
                                {FIELD_OPTIONS[field].map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                {/* Day of Week Quick Select */}
                <div className="space-y-2">
                    <Label>Hurtigvalg for dager</Label>
                    <div className="flex gap-1">
                        {WEEKDAYS.map((day, index) => (
                            <button
                                key={day}
                                onClick={() => {
                                    const current = parts.dayOfWeek;
                                    if (current === '*') {
                                        updatePart('dayOfWeek', String(index));
                                    } else if (current.includes(String(index))) {
                                        const newValue = current.split(',').filter(d => d !== String(index)).join(',');
                                        updatePart('dayOfWeek', newValue || '*');
                                    } else {
                                        updatePart('dayOfWeek', current + ',' + index);
                                    }
                                }}
                                className={`px-2 py-1 text-xs border rounded transition-colors ${parts.dayOfWeek === '*' || parts.dayOfWeek.includes(String(index))
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Result */}
                <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-sm text-muted-foreground">Cron-uttrykk</Label>
                            <p className="text-xl font-mono font-bold">{result.expression}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={copyExpression}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <div>
                        <Label className="text-sm text-muted-foreground">Beskrivelse</Label>
                        <p className="text-sm font-medium">{result.description}</p>
                    </div>
                </div>

                {/* Expression Format Guide */}
                <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
                    <div className="font-mono mb-2">┌───────── minutt (0–59)</div>
                    <div className="font-mono mb-2">│ ┌─────── time (0–23)</div>
                    <div className="font-mono mb-2">│ │ ┌───── dag i måneden (1–31)</div>
                    <div className="font-mono mb-2">│ │ │ ┌─── måned (1–12)</div>
                    <div className="font-mono mb-2">│ │ │ │ ┌─ ukedag (0–6, søn = 0)</div>
                    <div className="font-mono">* * * * *</div>
                </div>

                {/* Syntax Reference */}
                <div className="text-xs text-muted-foreground space-y-1">
                    <p><code className="bg-muted px-1 rounded">*</code> = alle verdier</p>
                    <p><code className="bg-muted px-1 rounded">,</code> = liste (f.eks. 1,3,5)</p>
                    <p><code className="bg-muted px-1 rounded">-</code> = intervall (f.eks. 1-5)</p>
                    <p><code className="bg-muted px-1 rounded">/</code> = trinn (f.eks. */15 = hvert 15. minutt)</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default CronGenerator;
