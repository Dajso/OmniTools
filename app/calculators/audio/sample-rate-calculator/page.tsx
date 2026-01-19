import { Metadata } from 'next';
import { SampleRateCalculator } from '@/components/calculators/audio';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sample Rate Calculator - Audio File Size & Duration',
  description: 'Calculate audio file sizes and durations based on sample rate, bit depth, and channels. Includes Nyquist frequency and dynamic range calculations.',
  keywords: ['sample rate calculator', 'audio file size', 'bit depth', 'nyquist frequency', 'wav file size', 'audio duration'],
  alternates: { canonical: '/calculators/audio/sample-rate-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sample Rate Calculator',
  description: 'Calculate audio file sizes and technical specifications',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose calculation mode', text: 'Select whether to calculate file size from duration or duration from file size.' },
  { name: 'Set audio format', text: 'Choose sample rate, bit depth, and number of channels, or use a preset.' },
  { name: 'Enter your value', text: 'Input the duration or file size depending on your selected mode.' },
  { name: 'View results', text: 'See the calculated file size or duration along with technical specifications.' },
  { name: 'Check specs', text: 'Review Nyquist frequency, dynamic range, and SNR for your settings.' },
];

const faqs = [
  {
    question: 'What sample rate should I use?',
    answer: '44.1 kHz (CD quality) is sufficient for most music. 48 kHz is standard for video. Higher rates like 96 kHz or 192 kHz are used for professional recording and archival, but offer diminishing returns for playback.',
  },
  {
    question: 'What is bit depth?',
    answer: 'Bit depth determines the dynamic range (difference between quietest and loudest sounds). 16-bit provides 96 dB of range (CD quality). 24-bit provides 144 dB, useful for recording to allow headroom.',
  },
  {
    question: 'What is the Nyquist frequency?',
    answer: 'The Nyquist frequency is half the sample rate and represents the highest frequency that can be accurately captured. At 44.1 kHz, the Nyquist frequency is 22.05 kHz, above human hearing range.',
  },
  {
    question: 'Why are compressed files so much smaller?',
    answer: 'Compressed formats like MP3 and AAC use psychoacoustic models to remove sounds humans cannot easily perceive. This can reduce file size by 5-10x with minimal perceived quality loss.',
  },
  {
    question: 'What is dynamic range?',
    answer: 'Dynamic range is the ratio between the loudest and quietest sounds that can be represented. It is approximately 6 dB per bit, so 16-bit audio has about 96 dB of dynamic range.',
  },
];

const relatedTools = [
  { href: '/calculators/audio/bpm-tapper', title: 'BPM Tapper', description: 'Find the tempo of a song.' },
  { href: '/calculators/audio/note-frequency', title: 'Note to Frequency', description: 'Convert notes to frequencies.' },
  { href: '/calculators/productivity/aspect-ratio-calculator', title: 'Aspect Ratio Calculator', description: 'Calculate video dimensions.' },
];

export default function SampleRateCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sample-rate-calculator"
          title="Sample Rate Calculator"
          description="Calculate audio file sizes and durations based on sample rate, bit depth, and channels. View technical specifications like Nyquist frequency and dynamic range."
          colorClass="bg-teal-100 text-teal-600"
          category="Audio"
        />

        <section aria-label="Sample Rate Calculator">
          <SampleRateCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
