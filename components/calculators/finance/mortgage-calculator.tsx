'use client';

import * as React from 'react';
import { z } from 'zod';
import { CalculatorBase } from '@/components/calculators/calculator-base';
import { NumberInput } from '@/components/ui/number-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { SelectInput } from '@/components/ui/select-input';
import { useCalculator } from '@/lib/hooks/use-calculator';
import {
  calculateNorwegianLoan,
  calculateDownPaymentPercent,
  calculateDownPaymentFromPercent,
  type LoanType,
  type NorwegianLoanResults,
} from '@/lib/calculations/finance/mortgage';
import { formatCurrency, formatPercent } from '@/lib/utils/formatting';
import { cn } from '@/lib/utils';

/** Bankene krever normalt minst 15 % egenkapital (utlånsforskriften). */
const MIN_EQUITY_PERCENT = 15;

const kr = (v: number) => formatCurrency(v, { decimals: 0 });
const pct = (v: number) => formatPercent(v, { isDecimal: false });

const mortgageSchema = z.object({
  homePrice: z.number().min(10000, 'Boligprisen må være minst 10 000 kr').max(200000000, 'Boligprisen er for høy'),
  downPayment: z.number().min(0, 'Egenkapitalen kan ikke være negativ'),
  downPaymentPercent: z.number().min(0).max(99.99),
  loanType: z.enum(['annuity', 'serial']),
  loanTerm: z.number().refine((v) => [5, 10, 15, 20, 25, 30].includes(v), 'Velg en gyldig nedbetalingstid'),
  interestRate: z.number().min(0, 'Renten kan ikke være negativ').max(30, 'Renten er for høy'),
  establishmentFee: z.number().min(0, 'Gebyret kan ikke være negativt'),
  monthlyFee: z.number().min(0, 'Gebyret kan ikke være negativt'),
  commonCosts: z.number().min(0, 'Felleskostnadene kan ikke være negative'),
  propertyTax: z.number().min(0, 'Eiendomsskatten kan ikke være negativ'),
  homeInsurance: z.number().min(0, 'Forsikringen kan ikke være negativ'),
});

type MortgageFormInputs = z.infer<typeof mortgageSchema>;

interface MortgageResults extends NorwegianLoanResults {
  loanAmount: number;
  /** Første terminbeløp hvis renten stiger 3 prosentpoeng (bankenes stresstest) */
  stressFirstPayment: number;
  /** Boutgifter per måned første måned: termin + felleskostnader + eiendomsskatt + forsikring */
  housingCostFirstMonth: number;
}

const LOAN_TYPE_OPTIONS = [
  { value: 'annuity', label: 'Annuitetslån (like terminbeløp)' },
  { value: 'serial', label: 'Serielån (like avdrag)' },
];

const LOAN_TERM_OPTIONS = [5, 10, 15, 20, 25, 30].map((y) => ({ value: String(y), label: `${y} år` }));

const INITIAL_INPUTS: MortgageFormInputs = {
  homePrice: 4500000,
  downPayment: 675000,
  downPaymentPercent: 15,
  loanType: 'annuity',
  loanTerm: 25,
  interestRate: 5.5,
  establishmentFee: 1000,
  monthlyFee: 50,
  commonCosts: 0,
  propertyTax: 0,
  homeInsurance: 0,
};

function calculateMortgageFn(f: MortgageFormInputs): MortgageResults {
  const loanAmount = f.homePrice - f.downPayment;
  const base = {
    loanAmount,
    termYears: f.loanTerm,
    interestRate: f.interestRate,
    loanType: f.loanType as LoanType,
    establishmentFee: f.establishmentFee,
    monthlyFee: f.monthlyFee,
  };
  const loan = calculateNorwegianLoan(base);
  const stress = calculateNorwegianLoan({ ...base, interestRate: f.interestRate + 3 });
  return {
    ...loan,
    loanAmount,
    stressFirstPayment: stress.firstPayment,
    housingCostFirstMonth: loan.firstPayment + f.commonCosts + f.propertyTax / 12 + f.homeInsurance / 12,
  };
}

function Schedule({ schedule }: { schedule: NorwegianLoanResults['schedule'] }) {
  const [expanded, setExpanded] = React.useState(false);
  const rows = expanded ? schedule : schedule.slice(0, 12);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Nedbetalingsplan</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2">Termin</th>
              <th className="text-right py-2 px-2">Terminbeløp</th>
              <th className="text-right py-2 px-2">Avdrag</th>
              <th className="text-right py-2 px-2">Renter</th>
              <th className="text-right py-2 px-2">Restgjeld</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.month} className="border-b border-muted">
                <td className="py-2 px-2">{e.month}</td>
                <td className="text-right py-2 px-2">{kr(e.payment)}</td>
                <td className="text-right py-2 px-2">{kr(e.principal)}</td>
                <td className="text-right py-2 px-2">{kr(e.interest)}</td>
                <td className="text-right py-2 px-2">{kr(e.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {schedule.length > 12 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        >
          {expanded ? 'Vis færre' : `Vis alle ${schedule.length} terminer`}
        </button>
      )}
    </div>
  );
}

function CostBreakdown({ inputs, results }: { inputs: MortgageFormInputs; results: MortgageResults }) {
  const items = [
    { label: 'Avdrag', value: results.schedule[0].principal, color: 'bg-accent-600' },
    { label: 'Renter', value: results.schedule[0].interest, color: 'bg-accent-300' },
    { label: 'Termingebyr', value: inputs.monthlyFee, color: 'bg-gray-400' },
    { label: 'Felleskostnader', value: inputs.commonCosts, color: 'bg-gray-300' },
    { label: 'Eiendomsskatt', value: inputs.propertyTax / 12, color: 'bg-gray-500' },
    { label: 'Forsikring', value: inputs.homeInsurance / 12, color: 'bg-gray-200' },
  ].filter((i) => i.value > 0);

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">Boutgifter første måned</h4>
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-full', item.color)} />
            <span>{item.label}</span>
          </div>
          <span className="font-medium">{kr(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Boliglånskalkulator for Norge.
 * Annuitetslån og serielån, etableringsgebyr, termingebyr, felleskostnader,
 * eiendomsskatt, effektiv rente og bankenes stresstest (+3 prosentpoeng).
 */
export function MortgageCalculator() {
  const { inputs, setInput, results, errors, isValid, calculate, reset, isCalculating } =
    useCalculator<MortgageFormInputs, MortgageResults>({
      initialInputs: INITIAL_INPUTS,
      schema: mortgageSchema,
      calculate: calculateMortgageFn,
      storageKey: 'mortgage-calculator-no',
    });

  const handleHomePriceChange = (value: number) => {
    setInput('homePrice', value);
    setInput('downPayment', Math.round(calculateDownPaymentFromPercent(value, inputs.downPaymentPercent)));
  };

  const handleDownPaymentChange = (value: number) => {
    setInput('downPayment', value);
    setInput('downPaymentPercent', calculateDownPaymentPercent(inputs.homePrice, value));
  };

  const handleDownPaymentPercentChange = (value: number) => {
    setInput('downPaymentPercent', value);
    setInput('downPayment', Math.round(calculateDownPaymentFromPercent(inputs.homePrice, value)));
  };

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const isSerial = inputs.loanType === 'serial';
  const formula = isSerial
    ? 'Avdrag = Lån ÷ antall terminer. Renter = restgjeld × (rente ÷ 12)'
    : 'T = L × [r(1+r)^n] / [(1+r)^n − 1]';
  const formulaExplanation = isSerial
    ? 'Ved serielån er avdraget likt hver måned, så terminbeløpet synker etter hvert som renten faller.'
    : 'T = terminbeløp, L = lånebeløp, r = månedlig rente (årsrente ÷ 12), n = antall terminer.';

  return (
    <CalculatorBase
      title="Boliglånskalkulator"
      description="Beregn terminbeløp, renter og gebyrer på boliglånet"
      formula={formula}
      formulaExplanation={formulaExplanation}
      isCalculateDisabled={!isValid}
      isCalculating={isCalculating}
      onCalculate={calculate}
      onReset={reset}
      error={(errors as Record<string, string>)._calculation}
      results={
        results && (
          <div className="space-y-4">
            <ResultDisplay
              label={isSerial ? 'Første terminbeløp' : 'Terminbeløp per måned'}
              value={kr(results.firstPayment)}
              highlight
              copyable
            />
            {isSerial && (
              <p className="text-sm text-muted-foreground">
                Terminbeløpet synker til {kr(results.lastPayment)} i siste termin.
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Lånebeløp" value={kr(results.loanAmount)} copyable />
              <ResultDisplay label="Effektiv rente" value={pct(results.effectiveRate)} copyable />
              <ResultDisplay label="Sum renter" value={kr(results.totalInterest)} copyable />
              <ResultDisplay label="Sum gebyrer" value={kr(results.totalFees)} copyable />
              <ResultDisplay label="Totalt å betale" value={kr(results.totalPaid)} copyable />
              <ResultDisplay
                label="Boutgifter første måned"
                value={kr(results.housingCostFirstMonth)}
                copyable
              />
            </div>
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <p className="font-medium">Stresstest: renten stiger 3 prosentpoeng</p>
              <p className="mt-1 text-muted-foreground">
                Ved {pct(inputs.interestRate + 3)} rente blir første terminbeløp{' '}
                <strong>{kr(results.stressFirstPayment)}</strong> (
                {kr(results.stressFirstPayment - results.firstPayment)} mer per måned). Banken
                vurderer om du tåler dette når du søker om lån.
              </p>
            </div>
            <CostBreakdown inputs={inputs} results={results} />
            <Schedule schedule={results.schedule} />
          </div>
        )
      }
    >
      <NumberInput
        id="homePrice"
        label="Boligpris"
        value={inputs.homePrice}
        onChange={handleHomePriceChange}
        min={10000}
        max={200000000}
        step={50000}
        unit="kr"
        error={errors.homePrice}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="downPayment"
          label="Egenkapital"
          value={inputs.downPayment}
          onChange={handleDownPaymentChange}
          min={0}
          step={10000}
          unit="kr"
          error={errors.downPayment}
        />
        <NumberInput
          id="downPaymentPercent"
          label="Egenkapital i prosent"
          value={Math.round(inputs.downPaymentPercent * 100) / 100}
          onChange={handleDownPaymentPercentChange}
          min={0}
          max={99.99}
          step={0.5}
          unit="%"
          error={errors.downPaymentPercent}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectInput
          id="loanType"
          label="Lånetype"
          value={inputs.loanType}
          onChange={(v: string) => setInput('loanType', v as LoanType)}
          options={LOAN_TYPE_OPTIONS}
        />
        <SelectInput
          id="loanTerm"
          label="Nedbetalingstid"
          value={String(inputs.loanTerm)}
          onChange={(v: string) => setInput('loanTerm', parseInt(v, 10))}
          options={LOAN_TERM_OPTIONS}
          error={errors.loanTerm}
          required
        />
      </div>

      <NumberInput
        id="interestRate"
        label="Nominell rente"
        value={inputs.interestRate}
        onChange={(v) => setInput('interestRate', v)}
        min={0}
        max={30}
        step={0.05}
        unit="%"
        error={errors.interestRate}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="establishmentFee"
          label="Etableringsgebyr"
          value={inputs.establishmentFee}
          onChange={(v) => setInput('establishmentFee', v)}
          min={0}
          step={100}
          unit="kr"
          error={errors.establishmentFee}
        />
        <NumberInput
          id="monthlyFee"
          label="Termingebyr"
          value={inputs.monthlyFee}
          onChange={(v) => setInput('monthlyFee', v)}
          min={0}
          step={5}
          unit="kr/mnd"
          error={errors.monthlyFee}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <NumberInput
          id="commonCosts"
          label="Felleskostnader"
          value={inputs.commonCosts}
          onChange={(v) => setInput('commonCosts', v)}
          min={0}
          step={100}
          unit="kr/mnd"
          error={errors.commonCosts}
        />
        <NumberInput
          id="propertyTax"
          label="Eiendomsskatt"
          value={inputs.propertyTax}
          onChange={(v) => setInput('propertyTax', v)}
          min={0}
          step={500}
          unit="kr/år"
          error={errors.propertyTax}
        />
        <NumberInput
          id="homeInsurance"
          label="Forsikring"
          value={inputs.homeInsurance}
          onChange={(v) => setInput('homeInsurance', v)}
          min={0}
          step={500}
          unit="kr/år"
          error={errors.homeInsurance}
        />
      </div>

      {inputs.downPaymentPercent < MIN_EQUITY_PERCENT && (
        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          Banker krever normalt minst {MIN_EQUITY_PERCENT} % egenkapital ved boligkjøp (utlånsforskriften).
          Med lavere egenkapital må du ofte stille tilleggssikkerhet eller få et unntak fra banken.
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Dokumentavgift (2,5 % av kjøpesummen for selveierbolig) og tinglysingsgebyr kommer i tillegg til
        egenkapitalen. Se kalkulatoren for omkostninger ved boligkjøp.
      </p>
    </CalculatorBase>
  );
}

export default MortgageCalculator;
