/**
 * Citation Generator
 * Generates APA and MLA formatted citations for books and web pages
 * 
 * @module lib/calculations/academic/citation-generator
 * @see Requirements 15.3
 */

export type CitationStyle = 'apa' | 'mla';
export type SourceType = 'book' | 'website' | 'journal';

export interface Author {
  firstName: string;
  lastName: string;
}

export interface BookSource {
  type: 'book';
  authors: Author[];
  title: string;
  publisher: string;
  year: string;
  edition?: string;
  city?: string;
}

export interface WebsiteSource {
  type: 'website';
  authors: Author[];
  title: string;
  websiteName: string;
  url: string;
  publishDate?: string;
  accessDate: string;
}

export interface JournalSource {
  type: 'journal';
  authors: Author[];
  title: string;
  journalName: string;
  volume: string;
  issue?: string;
  pages: string;
  year: string;
  doi?: string;
}

export type Source = BookSource | WebsiteSource | JournalSource;

/**
 * Formats author name for APA style
 * Format: LastName, F. M.
 */
function formatAuthorAPA(author: Author): string {
  const firstInitial = author.firstName.charAt(0).toUpperCase();
  return `${author.lastName}, ${firstInitial}.`;
}

/**
 * Formats author name for MLA style
 * Format: LastName, FirstName (first author) or FirstName LastName (subsequent)
 */
function formatAuthorMLA(author: Author, isFirst: boolean): string {
  if (isFirst) {
    return `${author.lastName}, ${author.firstName}`;
  }
  return `${author.firstName} ${author.lastName}`;
}

/**
 * Formats multiple authors for APA style
 */
function formatAuthorsAPA(authors: Author[]): string {
  if (authors.length === 0) return '';
  if (authors.length === 1) return formatAuthorAPA(authors[0]);
  if (authors.length === 2) {
    return `${formatAuthorAPA(authors[0])} & ${formatAuthorAPA(authors[1])}`;
  }
  // 3+ authors: First author, et al.
  return `${formatAuthorAPA(authors[0])} mfl.`;
}

/**
 * Formats multiple authors for MLA style
 */
function formatAuthorsMLA(authors: Author[]): string {
  if (authors.length === 0) return '';
  if (authors.length === 1) return formatAuthorMLA(authors[0], true);
  if (authors.length === 2) {
    return `${formatAuthorMLA(authors[0], true)} og ${formatAuthorMLA(authors[1], false)}`;
  }
  // 3+ authors: First author, et al.
  return `${formatAuthorMLA(authors[0], true)} mfl.`;
}

/**
 * Formats a date for APA style (Year, Month Day)
 */
function formatDateAPA(dateStr: string): string {
  if (!dateStr) return 'u.å.';
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.toLocaleString('nb-NO', { month: 'long' });
    const day = date.getDate();
    return `${year}, ${day}. ${month}`;
  } catch {
    return dateStr;
  }
}

/**
 * Formats a date for MLA style (Day Month Year)
 */
function formatDateMLA(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.toLocaleString('nb-NO', { month: 'short' }).replace('.', '');
    const day = date.getDate();
    return `${day}. ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Generates APA citation for a book
 */
function generateBookAPA(source: BookSource): string {
  const authors = formatAuthorsAPA(source.authors);
  const year = source.year || 'u.å.';
  const title = source.title;
  const edition = source.edition ? ` (${source.edition} utg.)` : '';
  const publisher = source.publisher;
  
  return `${authors} (${year}). *${title}*${edition}. ${publisher}.`;
}

/**
 * Generates MLA citation for a book
 */
function generateBookMLA(source: BookSource): string {
  const authors = formatAuthorsMLA(source.authors);
  const title = source.title;
  const edition = source.edition ? `, ${source.edition} utg.` : '';
  const publisher = source.publisher;
  const year = source.year;
  
  return `${authors}. *${title}*${edition}. ${publisher}, ${year}.`;
}

/**
 * Generates APA citation for a website
 */
function generateWebsiteAPA(source: WebsiteSource): string {
  const authors = source.authors.length > 0 
    ? formatAuthorsAPA(source.authors) 
    : source.websiteName;
  const date = source.publishDate ? `(${formatDateAPA(source.publishDate)})` : '(u.å.)';
  const title = source.title;
  const siteName = source.authors.length > 0 ? source.websiteName : '';
  const url = source.url;
  
  let citation = `${authors}. ${date}. ${title}.`;
  if (siteName) citation += ` *${siteName}*.`;
  citation += ` ${url}`;
  
  return citation;
}

/**
 * Generates MLA citation for a website
 */
function generateWebsiteMLA(source: WebsiteSource): string {
  const authors = source.authors.length > 0 
    ? formatAuthorsMLA(source.authors) 
    : '';
  const title = source.title;
  const siteName = source.websiteName;
  const publishDate = source.publishDate ? formatDateMLA(source.publishDate) : '';
  const url = source.url;
  const accessDate = formatDateMLA(source.accessDate);
  
  let citation = authors ? `${authors}. ` : '';
  citation += `"${title}." *${siteName}*`;
  if (publishDate) citation += `, ${publishDate}`;
  citation += `, ${url}. Hentet ${accessDate}.`;
  
  return citation;
}

/**
 * Generates APA citation for a journal article
 */
function generateJournalAPA(source: JournalSource): string {
  const authors = formatAuthorsAPA(source.authors);
  const year = source.year || 'u.å.';
  const title = source.title;
  const journal = source.journalName;
  const volume = source.volume;
  const issue = source.issue ? `(${source.issue})` : '';
  const pages = source.pages;
  const doi = source.doi ? ` https://doi.org/${source.doi}` : '';
  
  return `${authors} (${year}). ${title}. *${journal}*, *${volume}*${issue}, ${pages}.${doi}`;
}

/**
 * Generates MLA citation for a journal article
 */
function generateJournalMLA(source: JournalSource): string {
  const authors = formatAuthorsMLA(source.authors);
  const title = source.title;
  const journal = source.journalName;
  const volume = source.volume;
  const issue = source.issue ? `, nr. ${source.issue}` : '';
  const year = source.year;
  const pages = source.pages;
  const doi = source.doi ? ` https://doi.org/${source.doi}` : '';
  
  return `${authors}. "${title}." *${journal}*, bd. ${volume}${issue}, ${year}, s. ${pages}.${doi}`;
}

/**
 * Generates a citation in the specified style
 */
export function generateCitation(source: Source, style: CitationStyle): string {
  switch (source.type) {
    case 'book':
      return style === 'apa' ? generateBookAPA(source) : generateBookMLA(source);
    case 'website':
      return style === 'apa' ? generateWebsiteAPA(source) : generateWebsiteMLA(source);
    case 'journal':
      return style === 'apa' ? generateJournalAPA(source) : generateJournalMLA(source);
    default:
      throw new Error('Ukjent kildetype');
  }
}

/**
 * Converts markdown-style italics (*text*) to HTML
 */
export function citationToHTML(citation: string): string {
  return citation.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/**
 * Removes markdown-style italics for plain text
 */
export function citationToPlainText(citation: string): string {
  return citation.replace(/\*/g, '');
}
