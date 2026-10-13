# Kalkulator – Hjemmetavla

Norsk samling av gratis kalkulatorer og omregnere, bygget på [OmniTools](https://github.com/Dajso/OmniTools) og tilpasset Norge:

- Beløp i norske kroner (NOK), norske tallformat (desimalkomma, mellomrom som tusenskille)
- Metriske enheter som standard (m, kg, °C, liter, l/100 km, kW/hk)
- Norske regler og eksempler: MVA, feriepenger, dokumentavgift, TEK17, norske helligdager, norsk tid med sommertid m.m.
- Norsk brukergrensesnitt og innhold. Verktøy som bare gir mening i USA er fjernet.
- Design i tråd med Hjemmetavla.

## Teknologi

Next.js 15 (App Router, statisk eksport), React 19, TypeScript, Tailwind CSS, zod, Vitest + fast-check.

## Utvikling

```bash
npm install
npm run dev        # http://localhost:3000
npm run test       # kjør tester (Vitest)
npx tsc --noEmit   # typesjekk
npm run build      # statisk eksport til out/
```

## Drift

`Dockerfile` bygger siden og serverer den med nginx (`nginx.conf`). Omdirigeringer for flyttede verktøy ligger i `nginx.conf`.
Sett `NEXT_PUBLIC_SITE_URL` og `NEXT_PUBLIC_BASE_URL` hvis siden skal ligge på et annet domene enn `https://kalkulator.hjemmetavla.no`.

## Struktur

- `lib/constants/tool-registry.ts` – alle verktøy (navn, beskrivelse, sti, nøkkelord)
- `lib/constants/category-config.ts` – kategorier
- `components/calculators/<kategori>/` – komponentene
- `lib/calculations/<kategori>/` – beregningslogikk
- `app/calculators/<kategori>/<verktøy>/page.tsx` – sider med bruksanvisning og vanlige spørsmål
- `lib/utils/formatting.ts` – formatering av kroner, tall og prosent (nb-NO)

## Lisens

MIT
