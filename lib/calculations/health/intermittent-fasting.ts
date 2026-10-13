/**
 * Intermittent Fasting Timer
 * 
 * Tracks fasting windows and provides timing information.
 * 
 * @module lib/calculations/health/intermittent-fasting
 * @see Requirements 6.4
 */

export type FastingProtocol = '16:8' | '18:6' | '20:4' | '5:2' | 'custom';

export interface FastingInputs {
  protocol: FastingProtocol;
  startTime: Date;
  customFastHours?: number;
}

export interface FastingResults {
  fastingHours: number;
  eatingHours: number;
  fastEndTime: Date;
  eatingWindowEnd: Date;
  currentStatus: 'fasting' | 'eating';
  hoursRemaining: number;
  minutesRemaining: number;
  percentComplete: number;
  phases: Array<{ name: string; startHour: number; description: string; reached: boolean }>;
}

const PROTOCOL_HOURS: Record<FastingProtocol, { fast: number; eat: number }> = {
  '16:8': { fast: 16, eat: 8 },
  '18:6': { fast: 18, eat: 6 },
  '20:4': { fast: 20, eat: 4 },
  '5:2': { fast: 24, eat: 0 }, // Full day fast
  'custom': { fast: 16, eat: 8 },
};

const FASTING_PHASES = [
  { name: 'Mett fase', startHour: 0, description: 'Kroppen fordøyer og tar opp næring' },
  { name: 'Tidlig faste', startHour: 4, description: 'Blodsukkeret stabiliserer seg' },
  { name: 'Fastefase', startHour: 8, description: 'Glykogenlagrene tømmes' },
  { name: 'Fettforbrenning', startHour: 12, description: 'Kroppen går over til å bruke fett som energi' },
  { name: 'Ketose begynner', startHour: 16, description: 'Produksjonen av ketoner øker' },
  { name: 'Dyp ketose', startHour: 18, description: 'Økt fettforbrenning og autofagi' },
  { name: 'Autofagi på topp', startHour: 24, description: 'Cellene rydder opp på høyt nivå' },
];

export function calculateFasting(inputs: FastingInputs): FastingResults {
  const { protocol, startTime, customFastHours } = inputs;
  const now = new Date();

  const hours = protocol === 'custom' && customFastHours 
    ? { fast: customFastHours, eat: 24 - customFastHours }
    : PROTOCOL_HOURS[protocol];

  const fastingHours = hours.fast;
  const eatingHours = hours.eat;

  // Calculate fast end time
  const fastEndTime = new Date(startTime);
  fastEndTime.setHours(fastEndTime.getHours() + fastingHours);

  // Calculate eating window end
  const eatingWindowEnd = new Date(fastEndTime);
  eatingWindowEnd.setHours(eatingWindowEnd.getHours() + eatingHours);

  // Calculate current status
  const hoursSinceStart = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const currentStatus: 'fasting' | 'eating' = hoursSinceStart < fastingHours ? 'fasting' : 'eating';

  // Calculate time remaining
  let hoursRemaining: number;
  let targetTime: Date;

  if (currentStatus === 'fasting') {
    targetTime = fastEndTime;
  } else {
    targetTime = eatingWindowEnd;
  }

  const msRemaining = Math.max(0, targetTime.getTime() - now.getTime());
  hoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));

  // Calculate percent complete
  const percentComplete = currentStatus === 'fasting'
    ? Math.min(100, (hoursSinceStart / fastingHours) * 100)
    : Math.min(100, ((hoursSinceStart - fastingHours) / eatingHours) * 100);

  // Determine which phases have been reached
  const phases = FASTING_PHASES.map(phase => ({
    ...phase,
    reached: hoursSinceStart >= phase.startHour,
  }));

  return {
    fastingHours,
    eatingHours,
    fastEndTime,
    eatingWindowEnd,
    currentStatus,
    hoursRemaining,
    minutesRemaining,
    percentComplete: Math.round(percentComplete),
    phases,
  };
}

export function getProtocolOptions(): Array<{ value: FastingProtocol; label: string; description: string }> {
  return [
    { value: '16:8', label: '16:8', description: '16 timer faste og 8 timer spising (mest brukt)' },
    { value: '18:6', label: '18:6', description: '18 timer faste og 6 timer spising' },
    { value: '20:4', label: '20:4', description: '20 timer faste og 4 timer spising (krigerdiett)' },
    { value: '5:2', label: '5:2', description: '5 dager med vanlig spising og 2 dager med faste' },
    { value: 'custom', label: 'Egendefinert', description: 'Velg ditt eget fastevindu' },
  ];
}
