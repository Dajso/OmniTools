import { Metadata } from 'next';
import { RegexTester } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Regex-tester – gratis kalkulator på nett',
  description: 'Test regulære uttrykk med live treff og grupper. Gratis og uten registrering.',
  keywords: ['regex', 'regulære uttrykk', 'regex-tester', 'mønstersøk'],
  alternates: { canonical: '/calculators/productivity/regex-tester' },
  openGraph: {
    title: 'Regex-tester',
    description: 'Test regulære uttrykk med live treff og grupper',
    url: '/calculators/productivity/regex-tester',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const faqs = [
  { question: 'Hva er et regulært uttrykk?', answer: 'Et mønster som beskriver tekst, brukt til søk, validering og erstatning.' },
  { question: 'Hva gjør flaggene?', answer: 'g finner alle treff, i ignorerer store og små bokstaver, m gjør at ^ og $ passer på hver linje, s lar . passe linjeskift og u slår på unicode.' },
  { question: 'Hvordan matcher jeg norske bokstaver?', answer: 'Bruk [a-zæøå] eller flagget u med \\p{L}. Mønsteret \\w dekker ikke æ, ø og å.' },
  { question: 'Sendes teksten min til en server?', answer: 'Nei, alt kjører i nettleseren.' },
];

export default function RegexTesterPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <ToolPageHeader
                toolId="regex-tester"
                title="Regex-tester"
                description="Test regulære uttrykk med live treff, uthevede treff og fangstgrupper. Med norske mønstre for telefon, dato og postnummer. Gratis og uten registrering."
                colorClass="bg-violet-100 text-violet-700"
            />
            <section aria-label="Regex-tester">
                <RegexTester />
            </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Vanlige tegn i regulære uttrykk</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Tegn</th>
                  <th className="text-left py-2 px-3">Betydning</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">.</td><td className="text-left py-2 px-3">Hvilket som helst tegn (unntatt linjeskift)</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">*</td><td className="text-left py-2 px-3">Null eller flere av det foregående</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">+</td><td className="text-left py-2 px-3">Ett eller flere av det foregående</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">?</td><td className="text-left py-2 px-3">Null eller ett av det foregående</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">^</td><td className="text-left py-2 px-3">Start på tekst eller linje</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">$</td><td className="text-left py-2 px-3">Slutt på tekst eller linje</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">\d</td><td className="text-left py-2 px-3">Et siffer (0–9)</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">\w</td><td className="text-left py-2 px-3">Ordtegn (a–z, A–Z, 0–9, _). Dekker ikke æ, ø og å</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">\s</td><td className="text-left py-2 px-3">Mellomromstegn</td></tr>
                <tr><td className="text-left py-2 px-3">{'\\p{L}'}</td><td className="text-left py-2 px-3">Hvilken som helst bokstav, også æ, ø og å (krever flagget u)</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">Regulære uttrykk fungerer i nesten alle programmeringsspråk, men syntaksen kan variere litt.</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Start enkelt</h3>
              <p className="text-sm text-muted-foreground">Bygg uttrykket bit for bit, og test mot flere eksempler, også de som ikke skal treffe.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Norske bokstaver</h3>
              <p className="text-sm text-muted-foreground">Bruk [a-zæøåA-ZÆØÅ] eller {'\\p{L}'} med flagget u i stedet for \w og [a-z].</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Unngå for generelle uttrykk</h3>
              <p className="text-sm text-muted-foreground">Uttrykk som .* kan være trege og gi uventede treff. Vær så presis som mulig.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Valider også på serveren</h3>
              <p className="text-sm text-muted-foreground">Skjemavalidering i nettleseren kan omgås. Sjekk data også på serversiden.</p>
            </div>
          </div>
        </section>

            <section className="mt-12" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-2xl font-semibold mb-6">FAQ</h2>
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border-b pb-6 last:border-b-0">
                            <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                            <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
