import { Metadata } from 'next';
import { ClearDataButton } from '@/components/layout/clear-data-button';

export const metadata: Metadata = {
  title: 'Personvern',
  description:
    'Kalkulator samler ikke inn personopplysninger. Alt du skriver inn blir værende i nettleseren din.',
  alternates: { canonical: '/personvern' },
};

export default function PersonvernPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Personvern</h1>

      <div className="mt-8 space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">Kort fortalt</h2>
          <p className="mt-2">
            Kalkulator samler ikke inn personopplysninger. Det finnes ingen innlogging, ingen
            sporing, ingen reklame og ingen informasjonskapsler (cookies) for statistikk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">Det du skriver inn</h2>
          <p className="mt-2">
            Alle beregninger skjer i nettleseren din. Tallene du fyller inn blir aldri sendt til en
            server, og vi kan ikke se dem.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">Det som lagres på enheten din</h2>
          <p className="mt-2">
            For at siden skal være praktisk lagrer nettleseren din noen få ting lokalt (i
            «localStorage»): favorittene dine, sist brukte verdier i noen kalkulatorer og om du har
            lukket installasjonsforslaget. Dette blir værende på din egen enhet. Siden fungerer
            også uten nett når du har installert den som app.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">Slett det som er lagret</h2>
          <p className="mt-2 mb-4">
            Du kan når som helst slette alt som er lagret i nettleseren din med knappen under, eller
            ved å tømme nettstedsdata i nettleserinnstillingene.
          </p>
          <ClearDataButton />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">Veiledende beregninger</h2>
          <p className="mt-2">
            Resultatene er veiledende og ikke rådgivning. Ved viktige beslutninger om økonomi, helse
            eller bygging bør du kontrollere tallene og snakke med en fagperson.
          </p>
        </section>
      </div>
    </div>
  );
}
