'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import { SelectInput } from '@/components/ui/select-input';
import { Plus, Trash2, Download, FileText } from 'lucide-react';
import {
  calculateInvoiceTotals,
  downloadInvoicePDF,
  nextInvoiceNumber,
  generateKid,
  MVA_RATES,
  validateInvoiceData,
  formatCurrency,
  type InvoiceData,
  type InvoiceItem,
  type BusinessInfo,
} from '@/lib/calculations/creator/invoice-generator';

const EMPTY_ITEM: InvoiceItem = {
  description: '',
  quantity: 1,
  unitPrice: 0,
};

const EMPTY_BUSINESS: BusinessInfo = {
  name: '',
  address: '',
  email: '',
  phone: '',
  orgNumber: '',
};

export function InvoiceGenerator() {
  const [invoiceNumber, setInvoiceNumber] = React.useState(() => `${new Date().getFullYear()}-001`);
  const [date, setDate] = React.useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [from, setFrom] = React.useState<BusinessInfo>(EMPTY_BUSINESS);
  const [to, setTo] = React.useState<BusinessInfo>(EMPTY_BUSINESS);
  const [items, setItems] = React.useState<InvoiceItem[]>([{ ...EMPTY_ITEM }]);
  const [taxRate, setTaxRate] = React.useState(25);
  const [accountNumber, setAccountNumber] = React.useState('');
  const [kid, setKid] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [currency, setCurrency] = React.useState('kr');
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const calculation = React.useMemo(() => {
    try {
      return calculateInvoiceTotals(items, taxRate);
    } catch {
      return { subtotal: 0, taxAmount: 0, total: 0, itemTotals: items.map(() => 0) };
    }
  }, [items, taxRate]);

  const updateFrom = (field: keyof BusinessInfo, value: string) => {
    setFrom(prev => ({ ...prev, [field]: value }));
  };

  const updateTo = (field: keyof BusinessInfo, value: string) => {
    setTo(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setItems(prev => [...prev, { ...EMPTY_ITEM }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleGeneratePDF = async () => {
    const invoiceData: InvoiceData = {
      invoiceNumber,
      date: new Date(date),
      dueDate: new Date(dueDate),
      from,
      to,
      items,
      taxRate: taxRate > 0 ? taxRate : undefined,
      notes: notes || undefined,
      currency,
      accountNumber: accountNumber || undefined,
      kid: kid || undefined,
    };

    const validation = validateInvoiceData(invoiceData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    setIsGenerating(true);

    try {
      await downloadInvoicePDF(invoiceData);
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Kunne ikke lage PDF-en']);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewInvoice = () => {
    setInvoiceNumber(nextInvoiceNumber(invoiceNumber));
    setKid('');
    setItems([{ ...EMPTY_ITEM }]);
    setErrors([]);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Fakturagenerator
        </CardTitle>
        <CardDescription>
          Lag en faktura med MVA, kontonummer og KID, og last ned som PDF
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invoice Details */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Fakturanummer</Label>
            <Input
              id="invoiceNumber"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="2026-001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Fakturadato</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Forfallsdato</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* From / To Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* From Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Fra (din virksomhet)</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="fromName">Firmanavn *</Label>
                <Input
                  id="fromName"
                  value={from.name}
                  onChange={(e) => updateFrom('name', e.target.value)}
                  placeholder="Firmanavn AS"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromAddress">Adresse *</Label>
                <textarea
                  id="fromAddress"
                  value={from.address}
                  onChange={(e) => updateFrom('address', e.target.value)}
                  placeholder="Storgata 1&#10;4611 Kristiansand"
                  className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromOrg">Organisasjonsnummer</Label>
                <Input
                  id="fromOrg"
                  value={from.orgNumber}
                  onChange={(e) => updateFrom('orgNumber', e.target.value)}
                  placeholder="123 456 789"
                  inputMode="numeric"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">E-post</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={from.email}
                    onChange={(e) => updateFrom('email', e.target.value)}
                    placeholder="post@firma.no"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromPhone">Telefon</Label>
                  <Input
                    id="fromPhone"
                    value={from.phone}
                    onChange={(e) => updateFrom('phone', e.target.value)}
                    placeholder="+47 400 00 000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* To Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Til (kunde)</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="toName">Kundens navn *</Label>
                <Input
                  id="toName"
                  value={to.name}
                  onChange={(e) => updateTo('name', e.target.value)}
                  placeholder="Kunde AS"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toAddress">Adresse *</Label>
                <textarea
                  id="toAddress"
                  value={to.address}
                  onChange={(e) => updateTo('address', e.target.value)}
                  placeholder="Kirkegata 2&#10;0153 Oslo"
                  className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toOrg">Organisasjonsnummer (valgfritt)</Label>
                <Input
                  id="toOrg"
                  value={to.orgNumber}
                  onChange={(e) => updateTo('orgNumber', e.target.value)}
                  placeholder="123 456 789"
                  inputMode="numeric"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="toEmail">E-post</Label>
                  <Input
                    id="toEmail"
                    type="email"
                    value={to.email}
                    onChange={(e) => updateTo('email', e.target.value)}
                    placeholder="kunde@eksempel.no"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toPhone">Telefon</Label>
                  <Input
                    id="toPhone"
                    value={to.phone}
                    onChange={(e) => updateTo('phone', e.target.value)}
                    placeholder="+47 900 00 000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Fakturalinjer</h3>
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-1" /> Legg til linje
            </Button>
          </div>
          
          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground px-2">
              <div className="col-span-5">Beskrivelse</div>
              <div className="col-span-2">Antall</div>
              <div className="col-span-2">Pris</div>
              <div className="col-span-2">Sum</div>
              <div className="col-span-1"></div>
            </div>
            
            {/* Items */}
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Beskrivelse av tjenesten eller varen"
                  />
                </div>
                <div className="col-span-2">
                  <NumberInput
                    value={item.quantity}
                    onChange={(v) => updateItem(index, 'quantity', v)}
                    min={1}
                    step={1}
                  />
                </div>
                <div className="col-span-2">
                  <NumberInput
                    value={item.unitPrice}
                    onChange={(v) => updateItem(index, 'unitPrice', v)}
                    min={0}
                    step={0.01}
                    unit={currency}
                  />
                </div>
                <div className="col-span-2 text-right font-medium">
                  {formatCurrency(calculation.itemTotals[index] || 0, currency)}
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax and Totals */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Sum eks. MVA</span>
              <span className="font-medium">{formatCurrency(calculation.subtotal, currency)}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">MVA</span>
                <SelectInput
                  id="mva"
                  label=""
                  value={String(taxRate)}
                  onChange={(v) => setTaxRate(Number(v))}
                  options={MVA_RATES.map(m => ({ value: String(m.value), label: m.label }))}
                />
              </div>
              <span className="font-medium">{formatCurrency(calculation.taxAmount, currency)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold">Å betale</span>
              <span className="text-xl font-bold">{formatCurrency(calculation.total, currency)}</span>
            </div>
          </div>
        </div>

        {/* Betalingsinformasjon */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Kontonummer</Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="1234.56.78903"
              inputMode="numeric"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kid">KID (valgfritt)</Label>
            <div className="flex gap-2">
              <Input
                id="kid"
                value={kid}
                onChange={(e) => setKid(e.target.value)}
                placeholder="Bare siffer"
                inputMode="numeric"
              />
              <Button type="button" variant="outline" onClick={() => setKid(generateKid(invoiceNumber))}>
                Lag KID
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              KID lages ut fra sifrene i fakturanummeret, med kontrollsiffer (modulus 10).
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Merknader (valgfritt)</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Betalingsvilkår, takk for oppdraget osv."
            className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm resize-none"
          />
        </div>

        {/* Currency Selection */}
        <div className="flex items-center gap-4">
          <Label htmlFor="currency">Valutategn</Label>
          <Input
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-20"
            maxLength={3}
          />
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            <p className="font-medium mb-2">Rett opp følgende:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleGeneratePDF} disabled={isGenerating}>
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Lager PDF …' : 'Last ned PDF'}
          </Button>
          <Button variant="outline" onClick={handleNewInvoice}>
            Ny faktura
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default InvoiceGenerator;
