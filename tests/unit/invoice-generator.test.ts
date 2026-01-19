/**
 * Unit Tests: Invoice Generator
 * Feature: expanded-tools-categories
 * 
 * Tests for Invoice Generator calculation functions and PDF generation
 * @see Requirements 18.1, 18.11
 */

import { describe, it, expect } from 'vitest';
import {
  calculateInvoiceTotals,
  formatCurrency,
  formatInvoiceDate,
  generateInvoiceNumber,
  validateInvoiceData,
  generateInvoicePDF,
  type InvoiceData,
  type InvoiceItem,
} from '@/lib/calculations/creator/invoice-generator';

describe('Invoice Generator - calculateInvoiceTotals', () => {
  it('should calculate correct subtotal for single item', () => {
    const items: InvoiceItem[] = [
      { description: 'Web Development', quantity: 10, unitPrice: 100 },
    ];
    
    const result = calculateInvoiceTotals(items);
    
    expect(result.subtotal).toBe(1000);
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(1000);
    expect(result.itemTotals).toEqual([1000]);
  });

  it('should calculate correct subtotal for multiple items', () => {
    const items: InvoiceItem[] = [
      { description: 'Web Development', quantity: 10, unitPrice: 100 },
      { description: 'Design Work', quantity: 5, unitPrice: 50 },
      { description: 'Consulting', quantity: 2, unitPrice: 200 },
    ];
    
    const result = calculateInvoiceTotals(items);
    
    expect(result.subtotal).toBe(1650); // 1000 + 250 + 400
    expect(result.itemTotals).toEqual([1000, 250, 400]);
  });

  it('should calculate correct tax amount', () => {
    const items: InvoiceItem[] = [
      { description: 'Service', quantity: 1, unitPrice: 100 },
    ];
    
    const result = calculateInvoiceTotals(items, 10);
    
    expect(result.subtotal).toBe(100);
    expect(result.taxAmount).toBe(10);
    expect(result.total).toBe(110);
  });

  it('should handle zero tax rate', () => {
    const items: InvoiceItem[] = [
      { description: 'Service', quantity: 1, unitPrice: 100 },
    ];
    
    const result = calculateInvoiceTotals(items, 0);
    
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(100);
  });

  it('should handle empty items array', () => {
    const result = calculateInvoiceTotals([]);
    
    expect(result.subtotal).toBe(0);
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(0);
    expect(result.itemTotals).toEqual([]);
  });

  it('should throw error for negative tax rate', () => {
    const items: InvoiceItem[] = [
      { description: 'Service', quantity: 1, unitPrice: 100 },
    ];
    
    expect(() => calculateInvoiceTotals(items, -5)).toThrow('Tax rate cannot be negative');
  });

  it('should throw error for negative quantity', () => {
    const items: InvoiceItem[] = [
      { description: 'Service', quantity: -1, unitPrice: 100 },
    ];
    
    expect(() => calculateInvoiceTotals(items)).toThrow('Quantity cannot be negative');
  });

  it('should throw error for negative unit price', () => {
    const items: InvoiceItem[] = [
      { description: 'Service', quantity: 1, unitPrice: -100 },
    ];
    
    expect(() => calculateInvoiceTotals(items)).toThrow('Unit price cannot be negative');
  });
});

describe('Invoice Generator - formatCurrency', () => {
  it('should format currency with default symbol', () => {
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(99.99)).toBe('$99.99');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format currency with custom symbol', () => {
    expect(formatCurrency(100, '€')).toBe('€100.00');
    expect(formatCurrency(100, '£')).toBe('£100.00');
  });

  it('should round to two decimal places', () => {
    expect(formatCurrency(100.999)).toBe('$101.00');
    expect(formatCurrency(100.001)).toBe('$100.00');
  });
});

describe('Invoice Generator - formatInvoiceDate', () => {
  it('should format date correctly', () => {
    const date = new Date(2024, 0, 15); // January 15, 2024
    expect(formatInvoiceDate(date)).toBe('01/15/2024');
  });

  it('should pad single digit months and days', () => {
    const date = new Date(2024, 5, 5); // June 5, 2024
    expect(formatInvoiceDate(date)).toBe('06/05/2024');
  });
});

describe('Invoice Generator - generateInvoiceNumber', () => {
  it('should generate invoice number with default prefix', () => {
    const invoiceNumber = generateInvoiceNumber();
    expect(invoiceNumber).toMatch(/^INV-[A-Z0-9]+-[A-Z0-9]+$/);
  });

  it('should generate invoice number with custom prefix', () => {
    const invoiceNumber = generateInvoiceNumber('BILL');
    expect(invoiceNumber).toMatch(/^BILL-[A-Z0-9]+-[A-Z0-9]+$/);
  });

  it('should generate unique invoice numbers', () => {
    const numbers = new Set<string>();
    for (let i = 0; i < 100; i++) {
      numbers.add(generateInvoiceNumber());
    }
    expect(numbers.size).toBe(100);
  });
});

describe('Invoice Generator - validateInvoiceData', () => {
  const validInvoiceData: InvoiceData = {
    invoiceNumber: 'INV-001',
    date: new Date(),
    dueDate: new Date(),
    from: {
      name: 'My Company',
      address: '123 Main St',
      email: 'contact@company.com',
    },
    to: {
      name: 'Client Company',
      address: '456 Client Ave',
    },
    items: [
      { description: 'Service', quantity: 1, unitPrice: 100 },
    ],
  };

  it('should validate correct invoice data', () => {
    const result = validateInvoiceData(validInvoiceData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject missing invoice number', () => {
    const data = { ...validInvoiceData, invoiceNumber: '' };
    const result = validateInvoiceData(data);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invoice number is required');
  });

  it('should reject missing sender name', () => {
    const data = { ...validInvoiceData, from: { ...validInvoiceData.from, name: '' } };
    const result = validateInvoiceData(data);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Sender name is required');
  });

  it('should reject missing sender address', () => {
    const data = { ...validInvoiceData, from: { ...validInvoiceData.from, address: '' } };
    const result = validateInvoiceData(data);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Sender address is required');
  });

  it('should reject missing recipient name', () => {
    const data = { ...validInvoiceData, to: { ...validInvoiceData.to, name: '' } };
    const result = validateInvoiceData(data);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Recipient name is required');
  });

  it('should reject missing recipient address', () => {
    const data = { ...validInvoiceData, to: { ...validInvoiceData.to, address: '' } };
    const result = validateInvoiceData(data);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Recipient address is required');
  });

  it('should reject empty items array', () => {
    const data = { ...validInvoiceData, items: [] };
    const result = validateInvoiceData(data);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('At least one item is required');
  });

  it('should reject item with empty description', () => {
    const data = {
      ...validInvoiceData,
      items: [{ description: '', quantity: 1, unitPrice: 100 }],
    };
    const result = validateInvoiceData(data);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('Description is required'))).toBe(true);
  });

  it('should reject item with zero quantity', () => {
    const data = {
      ...validInvoiceData,
      items: [{ description: 'Service', quantity: 0, unitPrice: 100 }],
    };
    const result = validateInvoiceData(data);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('Quantity must be positive'))).toBe(true);
  });

  it('should reject negative tax rate', () => {
    const data = { ...validInvoiceData, taxRate: -5 };
    const result = validateInvoiceData(data);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Tax rate cannot be negative');
  });
});

describe('Invoice Generator - PDF Generation', () => {
  const validInvoiceData: InvoiceData = {
    invoiceNumber: 'INV-001',
    date: new Date(2024, 0, 15),
    dueDate: new Date(2024, 1, 15),
    from: {
      name: 'My Company LLC',
      address: '123 Main Street\nSuite 100\nNew York, NY 10001',
      email: 'billing@mycompany.com',
      phone: '(555) 123-4567',
    },
    to: {
      name: 'Client Corporation',
      address: '456 Client Avenue\nLos Angeles, CA 90001',
      email: 'accounts@client.com',
    },
    items: [
      { description: 'Web Development Services', quantity: 40, unitPrice: 150 },
      { description: 'UI/UX Design', quantity: 20, unitPrice: 125 },
      { description: 'Project Management', quantity: 10, unitPrice: 100 },
    ],
    taxRate: 8.5,
    notes: 'Payment due within 30 days. Thank you for your business!',
    currency: '$',
  };

  it('should generate PDF blob', async () => {
    const blob = await generateInvoicePDF(validInvoiceData);
    
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/pdf');
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should generate PDF with correct content type', async () => {
    const blob = await generateInvoicePDF(validInvoiceData);
    
    expect(blob.type).toBe('application/pdf');
  });

  it('should generate PDF for invoice without tax', async () => {
    const dataWithoutTax = { ...validInvoiceData, taxRate: 0 };
    const blob = await generateInvoicePDF(dataWithoutTax);
    
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should generate PDF for invoice without notes', async () => {
    const dataWithoutNotes = { ...validInvoiceData, notes: undefined };
    const blob = await generateInvoicePDF(dataWithoutNotes);
    
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should generate PDF with single item', async () => {
    const singleItemData = {
      ...validInvoiceData,
      items: [{ description: 'Single Service', quantity: 1, unitPrice: 500 }],
    };
    const blob = await generateInvoicePDF(singleItemData);
    
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });
});
