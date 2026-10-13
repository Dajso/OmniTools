'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectInput } from '@/components/ui/select-input';
import { ResultDisplay } from '@/components/ui/result-display';
import { Plus, Trash2, Copy, Check } from 'lucide-react';
import { 
  generateCitation,
  citationToHTML,
  citationToPlainText,
  type CitationStyle,
  type SourceType,
  type Author,
  type Source,
} from '@/lib/calculations/academic/citation-generator';

const STYLE_OPTIONS = [
  { value: 'apa', label: 'APA (7. utgave)' },
  { value: 'mla', label: 'MLA (9. utgave)' },
];

const SOURCE_OPTIONS = [
  { value: 'book', label: 'Bok' },
  { value: 'website', label: 'Nettside' },
  { value: 'journal', label: 'Tidsskriftartikkel' },
];

const createEmptyAuthor = (): Author => ({
  firstName: '',
  lastName: '',
});

export function CitationGenerator() {
  const [style, setStyle] = React.useState<CitationStyle>('apa');
  const [sourceType, setSourceType] = React.useState<SourceType>('book');
  const [authors, setAuthors] = React.useState<Author[]>([createEmptyAuthor()]);
  const [copied, setCopied] = React.useState(false);
  
  // Book fields
  const [title, setTitle] = React.useState('');
  const [publisher, setPublisher] = React.useState('');
  const [year, setYear] = React.useState('');
  const [edition, setEdition] = React.useState('');
  
  // Website fields
  const [websiteName, setWebsiteName] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [publishDate, setPublishDate] = React.useState('');
  const [accessDate, setAccessDate] = React.useState(new Date().toISOString().split('T')[0]);
  
  // Journal fields
  const [journalName, setJournalName] = React.useState('');
  const [volume, setVolume] = React.useState('');
  const [issue, setIssue] = React.useState('');
  const [pages, setPages] = React.useState('');
  const [doi, setDoi] = React.useState('');

  const [citation, setCitation] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | undefined>();

  const addAuthor = () => {
    setAuthors(prev => [...prev, createEmptyAuthor()]);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      setAuthors(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateAuthor = (index: number, field: keyof Author, value: string) => {
    setAuthors(prev => prev.map((a, i) => 
      i === index ? { ...a, [field]: value } : a
    ));
  };

  const generateCitationText = () => {
    try {
      setError(undefined);
      
      const validAuthors = authors.filter(a => a.lastName.trim());
      
      let source: Source;
      
      switch (sourceType) {
        case 'book':
          if (!title.trim()) {
            setError('Skriv inn tittel på boka');
            return;
          }
          source = {
            type: 'book',
            authors: validAuthors,
            title: title.trim(),
            publisher: publisher.trim(),
            year: year.trim(),
            edition: edition.trim() || undefined,
          };
          break;
          
        case 'website':
          if (!title.trim() || !url.trim()) {
            setError('Skriv inn tittel på siden og nettadresse');
            return;
          }
          source = {
            type: 'website',
            authors: validAuthors,
            title: title.trim(),
            websiteName: websiteName.trim(),
            url: url.trim(),
            publishDate: publishDate || undefined,
            accessDate: accessDate,
          };
          break;
          
        case 'journal':
          if (!title.trim() || !journalName.trim()) {
            setError('Skriv inn tittel på artikkelen og navn på tidsskriftet');
            return;
          }
          source = {
            type: 'journal',
            authors: validAuthors,
            title: title.trim(),
            journalName: journalName.trim(),
            volume: volume.trim(),
            issue: issue.trim() || undefined,
            pages: pages.trim(),
            year: year.trim(),
            doi: doi.trim() || undefined,
          };
          break;
          
        default:
          throw new Error('Ukjent kildetype');
      }
      
      const result = generateCitation(source, style);
      setCitation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke lage kildehenvisning');
      setCitation(null);
    }
  };

  const copyToClipboard = async () => {
    if (!citation) return;
    try {
      await navigator.clipboard.writeText(citationToPlainText(citation));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = citationToPlainText(citation);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reset = () => {
    setAuthors([createEmptyAuthor()]);
    setTitle('');
    setPublisher('');
    setYear('');
    setEdition('');
    setWebsiteName('');
    setUrl('');
    setPublishDate('');
    setJournalName('');
    setVolume('');
    setIssue('');
    setPages('');
    setDoi('');
    setCitation(null);
    setError(undefined);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Kildehenvisning (APA/MLA)</CardTitle>
        <CardDescription>Lag kildehenvisninger i APA og MLA for bøker, nettsider og tidsskriftartikler</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SelectInput
            id="style"
            label="Henvisningsstil"
            value={style}
            onChange={(v) => setStyle(v as CitationStyle)}
            options={STYLE_OPTIONS}
          />
          <SelectInput
            id="sourceType"
            label="Type kilde"
            value={sourceType}
            onChange={(v) => {
              setSourceType(v as SourceType);
              setCitation(null);
            }}
            options={SOURCE_OPTIONS}
          />
        </div>

        {/* Authors Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Forfattere</label>
            <Button type="button" variant="outline" size="sm" onClick={addAuthor} className="gap-1">
              <Plus className="h-4 w-4" />
              Legg til forfatter
            </Button>
          </div>
          {authors.map((author, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={author.firstName}
                onChange={(e) => updateAuthor(index, 'firstName', e.target.value)}
                placeholder="Fornavn"
                className="flex-1"
              />
              <Input
                value={author.lastName}
                onChange={(e) => updateAuthor(index, 'lastName', e.target.value)}
                placeholder="Etternavn"
                className="flex-1"
              />
              {authors.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeAuthor(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Common Fields */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            {sourceType === 'book' ? 'Tittel på boka' : sourceType === 'website' ? 'Tittel på siden' : 'Tittel på artikkelen'}
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Skriv inn ${sourceType === 'book' ? 'tittel på boka' : sourceType === 'website' ? 'tittel på siden' : 'tittel på artikkelen'}`}
          />
        </div>

        {/* Book-specific fields */}
        {sourceType === 'book' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="publisher" className="text-sm font-medium">Forlag</label>
                <Input id="publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="Navn på forlaget" />
              </div>
              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium">År</label>
                <Input id="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="edition" className="text-sm font-medium">Utgave (valgfritt)</label>
              <Input id="edition" value={edition} onChange={(e) => setEdition(e.target.value)} placeholder="for eksempel 2." />
            </div>
          </>
        )}

        {/* Website-specific fields */}
        {sourceType === 'website' && (
          <>
            <div className="space-y-2">
              <label htmlFor="websiteName" className="text-sm font-medium">Navn på nettstedet</label>
              <Input id="websiteName" value={websiteName} onChange={(e) => setWebsiteName(e.target.value)} placeholder="for eksempel Store norske leksikon" />
            </div>
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">Nettadresse</label>
              <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="publishDate" className="text-sm font-medium">Publiseringsdato (valgfritt)</label>
                <Input id="publishDate" type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="accessDate" className="text-sm font-medium">Dato hentet</label>
                <Input id="accessDate" type="date" value={accessDate} onChange={(e) => setAccessDate(e.target.value)} />
              </div>
            </div>
          </>
        )}

        {/* Journal-specific fields */}
        {sourceType === 'journal' && (
          <>
            <div className="space-y-2">
              <label htmlFor="journalName" className="text-sm font-medium">Navn på tidsskriftet</label>
              <Input id="journalName" value={journalName} onChange={(e) => setJournalName(e.target.value)} placeholder="Navn på tidsskriftet" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="volume" className="text-sm font-medium">Årgang/bind</label>
                <Input id="volume" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="12" />
              </div>
              <div className="space-y-2">
                <label htmlFor="issue" className="text-sm font-medium">Nummer (valgfritt)</label>
                <Input id="issue" value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="3" />
              </div>
              <div className="space-y-2">
                <label htmlFor="journalYear" className="text-sm font-medium">År</label>
                <Input id="journalYear" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="pages" className="text-sm font-medium">Sider</label>
                <Input id="pages" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="45-67" />
              </div>
              <div className="space-y-2">
                <label htmlFor="doi" className="text-sm font-medium">DOI (valgfritt)</label>
                <Input id="doi" value={doi} onChange={(e) => setDoi(e.target.value)} placeholder="10.1000/xyz123" />
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md" role="alert">
            {error}
          </div>
        )}

        {/* Citation Result */}
        {citation && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Kildehenvisning ({style.toUpperCase()})</p>
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-1">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Kopiert!' : 'Kopier'}
              </Button>
            </div>
            <div 
              className="p-4 bg-muted/50 rounded-md text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: citationToHTML(citation) }}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={generateCitationText}>Lag kildehenvisning</Button>
        <Button variant="outline" onClick={reset}>Nullstill</Button>
      </CardFooter>
    </Card>
  );
}

export default CitationGenerator;
