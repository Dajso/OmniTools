/**
 * Invoice Generator with PDF Export
 * 
 * Generates professional invoices with PDF export functionality
 * using jspdf library for client-side PDF generation.
 * 
 * @module lib/calculations/creator/invoice-generator
 * @see Requirements 18.1, 18.11
 */

import { jsPDF } from 'jspdf';

export interface BusinessInfo {
  name: string;
  address: string;
  email?: string;
  phone?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  from: BusinessInfo;
  to: BusinessInfo;
  items: InvoiceItem[];
  taxRate?: number;
  notes?: string;
  currency?: string;
}

export interface InvoiceCalculation {
  subtotal: number;
  taxAmount: number;
  total: number;
  itemTotals: number[];
}

/**
 * Calculate invoice totals
 * 
 * @param items - Invoice line items
 * @param taxRate - Tax rate as percentage (e.g., 10 for 10%)
 * @returns Calculated invoice totals
 */
export function calculateInvoiceTotals(
  items: InvoiceItem[],
  taxRate: number = 0
): InvoiceCalculation {
  if (taxRate < 0) throw new Error('Tax rate cannot be negative');

  const itemTotals = items.map(item => {
    if (item.quantity < 0) throw new Error('Quantity cannot be negative');
    if (item.unitPrice < 0) throw new Error('Unit price cannot be negative');
    return item.quantity * item.unitPrice;
  });

  const subtotal = itemTotals.reduce((sum, total) => sum + total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return {
    subtotal,
    taxAmount,
    total,
    itemTotals,
  };
}


/**
 * Format currency value
 * 
 * @param value - Numeric value
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = '$'): string {
  return `${currency}${value.toFixed(2)}`;
}

/**
 * Format date for invoice display
 * 
 * @param date - Date object
 * @returns Formatted date string (MM/DD/YYYY)
 */
export function formatInvoiceDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

/**
 * Generate invoice PDF
 * 
 * Creates a professional PDF invoice with all provided details.
 * Uses jspdf for client-side PDF generation without server requests.
 * 
 * @param data - Invoice data
 * @returns Promise resolving to PDF Blob
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Blob> {
  const doc = new jsPDF();
  const currency = data.currency || '$';
  const calculation = calculateInvoiceTotals(data.items, data.taxRate);
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  let yPos = margin;

  // Header - Invoice title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', margin, yPos);
  
  // Invoice number and dates (right aligned)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${data.invoiceNumber}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 6;
  doc.text(`Date: ${formatInvoiceDate(data.date)}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 6;
  doc.text(`Due Date: ${formatInvoiceDate(data.dueDate)}`, pageWidth - margin, yPos, { align: 'right' });
  
  yPos += 15;

  // From section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('From:', margin, yPos);
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(data.from.name, margin, yPos);
  yPos += 5;
  
  // Handle multi-line address
  const fromAddressLines = data.from.address.split('\n');
  fromAddressLines.forEach(line => {
    doc.text(line, margin, yPos);
    yPos += 5;
  });
  
  if (data.from.email) {
    doc.text(data.from.email, margin, yPos);
    yPos += 5;
  }
  if (data.from.phone) {
    doc.text(data.from.phone, margin, yPos);
    yPos += 5;
  }

  // To section (positioned to the right)
  const toStartY = yPos - (fromAddressLines.length * 5 + (data.from.email ? 5 : 0) + (data.from.phone ? 5 : 0) + 11);
  let toYPos = toStartY;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', pageWidth / 2, toYPos);
  toYPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(data.to.name, pageWidth / 2, toYPos);
  toYPos += 5;
  
  const toAddressLines = data.to.address.split('\n');
  toAddressLines.forEach(line => {
    doc.text(line, pageWidth / 2, toYPos);
    toYPos += 5;
  });
  
  if (data.to.email) {
    doc.text(data.to.email, pageWidth / 2, toYPos);
    toYPos += 5;
  }
  if (data.to.phone) {
    doc.text(data.to.phone, pageWidth / 2, toYPos);
  }

  yPos = Math.max(yPos, toYPos) + 15;

  // Items table header
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', margin + 2, yPos);
  doc.text('Qty', margin + 90, yPos);
  doc.text('Unit Price', margin + 115, yPos);
  doc.text('Amount', margin + 150, yPos);
  
  yPos += 8;

  // Items
  doc.setFont('helvetica', 'normal');
  data.items.forEach((item, index) => {
    const itemTotal = calculation.itemTotals[index];
    doc.text(item.description.substring(0, 40), margin + 2, yPos);
    doc.text(String(item.quantity), margin + 90, yPos);
    doc.text(formatCurrency(item.unitPrice, currency), margin + 115, yPos);
    doc.text(formatCurrency(itemTotal, currency), margin + 150, yPos);
    yPos += 7;
  });

  yPos += 5;

  // Totals section
  const totalsX = margin + 115;
  
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, yPos);
  doc.text(formatCurrency(calculation.subtotal, currency), margin + 150, yPos);
  yPos += 6;

  if (data.taxRate && data.taxRate > 0) {
    doc.text(`Tax (${data.taxRate}%):`, totalsX, yPos);
    doc.text(formatCurrency(calculation.taxAmount, currency), margin + 150, yPos);
    yPos += 6;
  }

  doc.setFont('helvetica', 'bold');
  doc.text('Total:', totalsX, yPos);
  doc.text(formatCurrency(calculation.total, currency), margin + 150, yPos);
  
  yPos += 15;

  // Notes section
  if (data.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Notes:', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    const noteLines = doc.splitTextToSize(data.notes, contentWidth);
    doc.text(noteLines, margin, yPos);
  }

  // Return as Blob
  return doc.output('blob');
}

/**
 * Download invoice PDF
 * 
 * Convenience function to generate and download the invoice PDF.
 * 
 * @param data - Invoice data
 * @param filename - Optional filename (default: invoice-{number}.pdf)
 */
export async function downloadInvoicePDF(
  data: InvoiceData,
  filename?: string
): Promise<void> {
  const blob = await generateInvoicePDF(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `invoice-${data.invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a unique invoice number
 * 
 * @param prefix - Optional prefix for the invoice number
 * @returns Generated invoice number
 */
export function generateInvoiceNumber(prefix: string = 'INV'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Validate invoice data
 * 
 * @param data - Invoice data to validate
 * @returns Validation result with errors if any
 */
export function validateInvoiceData(data: InvoiceData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.invoiceNumber?.trim()) {
    errors.push('Invoice number is required');
  }

  if (!data.from?.name?.trim()) {
    errors.push('Sender name is required');
  }

  if (!data.from?.address?.trim()) {
    errors.push('Sender address is required');
  }

  if (!data.to?.name?.trim()) {
    errors.push('Recipient name is required');
  }

  if (!data.to?.address?.trim()) {
    errors.push('Recipient address is required');
  }

  if (!data.items || data.items.length === 0) {
    errors.push('At least one item is required');
  } else {
    data.items.forEach((item, index) => {
      if (!item.description?.trim()) {
        errors.push(`Item ${index + 1}: Description is required`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be positive`);
      }
      if (item.unitPrice < 0) {
        errors.push(`Item ${index + 1}: Unit price cannot be negative`);
      }
    });
  }

  if (data.taxRate !== undefined && data.taxRate < 0) {
    errors.push('Tax rate cannot be negative');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
