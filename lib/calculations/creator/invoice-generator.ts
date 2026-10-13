/**
 * Fakturagenerator med PDF-eksport
 *
 * Lager fakturaer tilpasset norske regler: organisasjonsnummer med MVA,
 * MVA-satser, kontonummer og KID. PDF-en lages i nettleseren med jspdf,
 * så ingenting sendes til en server.
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
  /** Organisasjonsnummer (9 siffer) */
  orgNumber?: string;
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
  /** MVA-sats i prosent (25, 15, 12 eller 0) */
  taxRate?: number;
  notes?: string;
  currency?: string;
  /** Kontonummer (11 siffer) */
  accountNumber?: string;
  /** KID-nummer */
  kid?: string;
}

export interface InvoiceCalculation {
  subtotal: number;
  taxAmount: number;
  total: number;
  itemTotals: number[];
}

/** MVA-satser som gjelder i Norge */
export const MVA_RATES = [
  { value: 25, label: '25 % (alminnelig sats)' },
  { value: 15, label: '15 % (matvarer)' },
  { value: 12, label: '12 % (persontransport, overnatting, kino m.m.)' },
  { value: 0, label: '0 % (fritatt / utenfor avgiftsområdet)' },
] as const;

/**
 * Regner ut totaler for fakturaen
 *
 * @param items - Fakturalinjer
 * @param taxRate - MVA-sats i prosent (f.eks. 25 for 25 %)
 */
export function calculateInvoiceTotals(
  items: InvoiceItem[],
  taxRate: number = 0
): InvoiceCalculation {
  if (taxRate < 0) throw new Error('MVA-satsen kan ikke være negativ');

  const itemTotals = items.map(item => {
    if (item.quantity < 0) throw new Error('Antall kan ikke være negativt');
    if (item.unitPrice < 0) throw new Error('Prisen kan ikke være negativ');
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
 * Formaterer beløp på norsk måte: «1 234,50 kr»
 *
 * @param value - Beløp
 * @param currency - Valutategn eller -kode (standard: «kr»)
 */
export function formatCurrency(value: number, currency: string = 'kr'): string {
  const num = new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${num} ${currency}`.trim();
}

/**
 * Formaterer dato for faktura (dd.mm.åååå)
 */
export function formatInvoiceDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

const onlyDigits = (value: string) => value.replace(/[\s.\-]/g, '');

/** Sjekker organisasjonsnummer (9 siffer, modulus 11) */
export function isValidOrgNumber(value: string): boolean {
  const digits = onlyDigits(value);
  if (!/^\d{9}$/.test(digits)) return false;
  const weights = [3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((s, w, i) => s + w * Number(digits[i]), 0);
  let check = 11 - (sum % 11);
  if (check === 11) check = 0;
  if (check === 10) return false;
  return check === Number(digits[8]);
}

/** Sjekker kontonummer (11 siffer, modulus 11) */
export function isValidAccountNumber(value: string): boolean {
  const digits = onlyDigits(value);
  if (!/^\d{11}$/.test(digits)) return false;
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((s, w, i) => s + w * Number(digits[i]), 0);
  let check = 11 - (sum % 11);
  if (check === 11) check = 0;
  if (check === 10) return false;
  return check === Number(digits[10]);
}

/** Formaterer org.nr. som «974 760 673» */
export function formatOrgNumber(value: string): string {
  const d = onlyDigits(value);
  return /^\d{9}$/.test(d) ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : value;
}

/** Formaterer kontonummer som «1234.56.78903» */
export function formatAccountNumber(value: string): string {
  const d = onlyDigits(value);
  return /^\d{11}$/.test(d) ? `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6)}` : value;
}

/**
 * Lager et KID-nummer med kontrollsiffer (modulus 10) ut fra sifrene i grunnlaget,
 * for eksempel fakturanummeret. Gir tomt resultat hvis grunnlaget ikke har siffer.
 */
export function generateKid(base: string): string {
  const digits = base.replace(/\D/g, '');
  if (digits.length === 0 || digits.length > 24) return '';
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    // Vekt 2 for siffer lengst til høyre, deretter vekt 1, 2, 1, ...
    const weight = i % 2 === 0 ? 2 : 1;
    const product = Number(digits[digits.length - 1 - i]) * weight;
    sum += product > 9 ? product - 9 : product;
  }
  return digits + String((10 - (sum % 10)) % 10);
}

/**
 * Øker det siste tallet i et fakturanummer med 1 (2026-001 → 2026-002)
 */
export function nextInvoiceNumber(current: string): string {
  const match = /^(.*?)(\d+)(\D*)$/.exec(current.trim());
  if (!match) return current ? `${current}-2` : '1';
  const [, head, num, tail] = match;
  const next = String(Number(num) + 1).padStart(num.length, '0');
  return `${head}${next}${tail}`;
}

/**
 * Lager faktura som PDF
 *
 * @param data - Fakturadata
 * @returns Blob med PDF
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Blob> {
  const doc = new jsPDF();
  const currency = data.currency || 'kr';
  const calculation = calculateInvoiceTotals(data.items, data.taxRate);
  // jsPDFs standardfonter takler ikke hardt mellomrom, så vi bytter det med vanlig mellomrom
  const money = (v: number) => formatCurrency(v, currency).replace(/ | /g, ' ');

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const right = pageWidth - margin;
  const contentWidth = pageWidth - 2 * margin;

  let yPos = margin;

  // Tittel
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FAKTURA', margin, yPos);

  // Fakturanummer og datoer (høyrejustert)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fakturanr.: ${data.invoiceNumber}`, right, yPos, { align: 'right' });
  yPos += 6;
  doc.text(`Fakturadato: ${formatInvoiceDate(data.date)}`, right, yPos, { align: 'right' });
  yPos += 6;
  doc.text(`Forfallsdato: ${formatInvoiceDate(data.dueDate)}`, right, yPos, { align: 'right' });

  yPos += 15;

  const hasMva = !!data.taxRate && data.taxRate > 0;
  const orgLine = (b: BusinessInfo, withMva: boolean) =>
    b.orgNumber ? `Org.nr. ${formatOrgNumber(b.orgNumber)}${withMva ? ' MVA' : ''}` : '';

  const blockLines = (b: BusinessInfo, withMva: boolean): string[] => [
    b.name,
    ...b.address.split('\n'),
    ...(orgLine(b, withMva) ? [orgLine(b, withMva)] : []),
    ...(b.email ? [b.email] : []),
    ...(b.phone ? [b.phone] : []),
  ];

  // Fra (venstre) og Til (høyre)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Fra:', margin, yPos);
  doc.text('Til:', pageWidth / 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const fromLines = blockLines(data.from, hasMva);
  const toLines = blockLines(data.to, false);
  fromLines.forEach((line, i) => doc.text(line, margin, yPos + 6 + i * 5));
  toLines.forEach((line, i) => doc.text(line, pageWidth / 2, yPos + 6 + i * 5));
  yPos += 6 + Math.max(fromLines.length, toLines.length) * 5 + 10;

  // Tabellhode
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPos - 5, contentWidth, 8, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Beskrivelse', margin + 2, yPos);
  doc.text('Antall', margin + 100, yPos, { align: 'right' });
  doc.text('Pris', margin + 130, yPos, { align: 'right' });
  doc.text('Beløp', right - 2, yPos, { align: 'right' });

  yPos += 8;

  // Linjer
  doc.setFont('helvetica', 'normal');
  data.items.forEach((item, index) => {
    const itemTotal = calculation.itemTotals[index];
    doc.text(item.description.substring(0, 40), margin + 2, yPos);
    doc.text(String(item.quantity).replace('.', ','), margin + 100, yPos, { align: 'right' });
    doc.text(money(item.unitPrice), margin + 130, yPos, { align: 'right' });
    doc.text(money(itemTotal), right - 2, yPos, { align: 'right' });
    yPos += 7;
  });

  yPos += 5;

  // Summer
  const totalsX = margin + 100;
  doc.setFont('helvetica', 'normal');
  doc.text('Sum eks. MVA:', totalsX, yPos);
  doc.text(money(calculation.subtotal), right - 2, yPos, { align: 'right' });
  yPos += 6;

  if (hasMva) {
    doc.text(`MVA (${String(data.taxRate).replace('.', ',')} %):`, totalsX, yPos);
    doc.text(money(calculation.taxAmount), right - 2, yPos, { align: 'right' });
    yPos += 6;
  }

  doc.setFont('helvetica', 'bold');
  doc.text('Å betale:', totalsX, yPos);
  doc.text(money(calculation.total), right - 2, yPos, { align: 'right' });

  yPos += 15;

  // Betalingsinformasjon
  if (data.accountNumber || data.kid) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Betalingsinformasjon', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    if (data.accountNumber) {
      doc.text(`Kontonummer: ${formatAccountNumber(data.accountNumber)}`, margin, yPos);
      yPos += 5;
    }
    if (data.kid) {
      doc.text(`KID: ${data.kid}`, margin, yPos);
      yPos += 5;
    }
    doc.text(`Forfallsdato: ${formatInvoiceDate(data.dueDate)}`, margin, yPos);
    yPos += 10;
  }

  // Merknader
  if (data.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Merknader:', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    const noteLines = doc.splitTextToSize(data.notes, contentWidth);
    doc.text(noteLines, margin, yPos);
  }

  return doc.output('blob');
}

/**
 * Laster ned faktura-PDF
 *
 * @param data - Fakturadata
 * @param filename - Valgfritt filnavn (standard: faktura-{nummer}.pdf)
 */
export async function downloadInvoicePDF(
  data: InvoiceData,
  filename?: string
): Promise<void> {
  const blob = await generateInvoicePDF(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `faktura-${data.invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Lager et unikt fakturanummer
 *
 * Merk: i regnskapet skal fakturanumre være fortløpende. Bruk gjerne
 * nextInvoiceNumber for å telle videre fra forrige faktura.
 *
 * @param prefix - Valgfritt prefiks
 */
export function generateInvoiceNumber(prefix: string = 'FAKT'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Validerer fakturadata
 */
export function validateInvoiceData(data: InvoiceData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.invoiceNumber?.trim()) {
    errors.push('Fakturanummer må fylles ut');
  }

  if (!data.from?.name?.trim()) {
    errors.push('Avsenderens navn må fylles ut');
  }

  if (!data.from?.address?.trim()) {
    errors.push('Avsenderens adresse må fylles ut');
  }

  if (data.from?.orgNumber?.trim() && !isValidOrgNumber(data.from.orgNumber)) {
    errors.push('Organisasjonsnummeret til avsender er ikke gyldig (9 siffer)');
  }

  if (!data.to?.name?.trim()) {
    errors.push('Mottakerens navn må fylles ut');
  }

  if (!data.to?.address?.trim()) {
    errors.push('Mottakerens adresse må fylles ut');
  }

  if (data.to?.orgNumber?.trim() && !isValidOrgNumber(data.to.orgNumber)) {
    errors.push('Organisasjonsnummeret til mottaker er ikke gyldig (9 siffer)');
  }

  if (data.accountNumber?.trim() && !isValidAccountNumber(data.accountNumber)) {
    errors.push('Kontonummeret er ikke gyldig (11 siffer)');
  }

  if (data.kid?.trim() && !/^\d{2,25}$/.test(data.kid.trim())) {
    errors.push('KID må bestå av 2–25 siffer');
  }

  if (!data.items || data.items.length === 0) {
    errors.push('Minst én fakturalinje må fylles ut');
  } else {
    data.items.forEach((item, index) => {
      if (!item.description?.trim()) {
        errors.push(`Linje ${index + 1}: Beskrivelse må fylles ut`);
      }
      if (item.quantity <= 0) {
        errors.push(`Linje ${index + 1}: Antall må være større enn 0`);
      }
      if (item.unitPrice < 0) {
        errors.push(`Linje ${index + 1}: Prisen kan ikke være negativ`);
      }
    });
  }

  if (data.taxRate !== undefined && data.taxRate < 0) {
    errors.push('MVA-satsen kan ikke være negativ');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
