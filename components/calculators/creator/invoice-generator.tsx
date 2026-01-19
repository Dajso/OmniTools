'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import { Plus, Trash2, Download, FileText } from 'lucide-react';
import {
  calculateInvoiceTotals,
  downloadInvoicePDF,
  generateInvoiceNumber,
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
};

export function InvoiceGenerator() {
  const [invoiceNumber, setInvoiceNumber] = React.useState(() => generateInvoiceNumber());
  const [date, setDate] = React.useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [from, setFrom] = React.useState<BusinessInfo>(EMPTY_BUSINESS);
  const [to, setTo] = React.useState<BusinessInfo>(EMPTY_BUSINESS);
  const [items, setItems] = React.useState<InvoiceItem[]>([{ ...EMPTY_ITEM }]);
  const [taxRate, setTaxRate] = React.useState(0);
  const [notes, setNotes] = React.useState('');
  const [currency, setCurrency] = React.useState('$');
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
      setErrors([err instanceof Error ? err.message : 'Failed to generate PDF']);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewInvoice = () => {
    setInvoiceNumber(generateInvoiceNumber());
    setItems([{ ...EMPTY_ITEM }]);
    setErrors([]);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice Generator
        </CardTitle>
        <CardDescription>
          Create professional invoices with PDF export
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invoice Details */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="INV-001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Invoice Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
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
            <h3 className="font-semibold">From (Your Business)</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="fromName">Business Name *</Label>
                <Input
                  id="fromName"
                  value={from.name}
                  onChange={(e) => updateFrom('name', e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromAddress">Address *</Label>
                <textarea
                  id="fromAddress"
                  value={from.address}
                  onChange={(e) => updateFrom('address', e.target.value)}
                  placeholder="123 Business St&#10;City, State 12345"
                  className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={from.email}
                    onChange={(e) => updateFrom('email', e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromPhone">Phone</Label>
                  <Input
                    id="fromPhone"
                    value={from.phone}
                    onChange={(e) => updateFrom('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* To Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Bill To (Client)</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="toName">Client Name *</Label>
                <Input
                  id="toName"
                  value={to.name}
                  onChange={(e) => updateTo('name', e.target.value)}
                  placeholder="Client Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toAddress">Address *</Label>
                <textarea
                  id="toAddress"
                  value={to.address}
                  onChange={(e) => updateTo('address', e.target.value)}
                  placeholder="456 Client Ave&#10;City, State 67890"
                  className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="toEmail">Email</Label>
                  <Input
                    id="toEmail"
                    type="email"
                    value={to.email}
                    onChange={(e) => updateTo('email', e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toPhone">Phone</Label>
                  <Input
                    id="toPhone"
                    value={to.phone}
                    onChange={(e) => updateTo('phone', e.target.value)}
                    placeholder="(555) 987-6543"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Line Items</h3>
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
          
          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground px-2">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-1"></div>
            </div>
            
            {/* Items */}
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Item description"
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
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(calculation.subtotal, currency)}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tax</span>
                <NumberInput
                  value={taxRate}
                  onChange={setTaxRate}
                  min={0}
                  max={100}
                  step={0.5}
                  unit="%"
                  className="w-20"
                />
              </div>
              <span className="font-medium">{formatCurrency(calculation.taxAmount, currency)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">{formatCurrency(calculation.total, currency)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment terms, thank you message, etc."
            className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm resize-none"
          />
        </div>

        {/* Currency Selection */}
        <div className="flex items-center gap-4">
          <Label htmlFor="currency">Currency Symbol</Label>
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
            <p className="font-medium mb-2">Please fix the following errors:</p>
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
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </Button>
          <Button variant="outline" onClick={handleNewInvoice}>
            New Invoice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default InvoiceGenerator;
