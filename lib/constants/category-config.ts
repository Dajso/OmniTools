import {
    TrendingUp,
    Heart,
    Home as HomeIcon,
    ArrowRightLeft,
    Zap,
    GraduationCap,
    Music,
    Car,
    Hammer,
    Scissors,
    Briefcase,
    Cpu,
    Gamepad2,
    Flower2,
    Camera,
    Atom,
    Dice5,
    BarChart3,
    Clock,
    Plane,
    Smile,
    Coffee,
    Fish,
    Sun,
    ChefHat,
    Building2 as Building,
    PartyPopper,
    LucideIcon
} from 'lucide-react';

export interface CategoryConfig {
    name: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color: string;
    hoverColor: string;
    iconColor: string;
    bgColor: string;
}

/**
 * Alle kategorier bruker samme rolige Hjemmetavla-uttrykk (turkis aksent på
 * lys flate) i stedet for en egen farge per kategori.
 */
const calm = {
    color: 'bg-blue-50 text-blue-600 ring-1 ring-blue-200',
    hoverColor: 'hover:bg-blue-50',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
};

export const categoryConfig: Record<string, CategoryConfig> = {
    finance: {
        name: 'Økonomi',
        description: 'Lån, sparing, avgifter og hverdagsøkonomi',
        icon: TrendingUp,
        href: '/calculators/finance',
        ...calm,
    },
    health: {
        name: 'Helse og trening',
        description: 'KMI, kalorier, kosthold og velvære',
        icon: Heart,
        href: '/calculators/health',
        ...calm,
    },
    home: {
        name: 'Hjem og oppussing',
        description: 'Maling, betong, gulv og prosjekter',
        icon: HomeIcon,
        href: '/calculators/home',
        ...calm,
    },
    converter: {
        name: 'Omregnere',
        description: 'Lengde, vekt, temperatur og mer',
        icon: ArrowRightLeft,
        href: '/convert',
        ...calm,
    },
    productivity: {
        name: 'Tekst og verktøy',
        description: 'Tekstverktøy, generatorer og hjelpemidler',
        icon: Zap,
        href: '/calculators/productivity',
        ...calm,
    },
    academic: {
        name: 'Studier',
        description: 'Brøk, vitenskapelig notasjon og studieverktøy',
        icon: GraduationCap,
        href: '/calculators/academic',
        ...calm,
    },
    audio: {
        name: 'Lyd og musikk',
        description: 'BPM, stemmeapparat, frekvens og lyd',
        icon: Music,
        href: '/calculators/audio',
        ...calm,
    },
    auto: {
        name: 'Bil',
        description: 'Dekk, drivstoff, elbillading og mer',
        icon: Car,
        href: '/calculators/auto',
        ...calm,
    },
    construction: {
        name: 'Bygg',
        description: 'Gesims, rekkverk, takkonstruksjon og mer',
        icon: Hammer,
        href: '/calculators/construction',
        ...calm,
    },
    crafts: {
        name: 'Håndarbeid',
        description: 'Stoff, strikking og quilting',
        icon: Scissors,
        href: '/calculators/crafts',
        ...calm,
    },
    creator: {
        name: 'Innhold og nett',
        description: 'Fakturaer, signaturer og sosiale medier',
        icon: Briefcase,
        href: '/calculators/creator',
        ...calm,
    },
    electronics: {
        name: 'Elektronikk',
        description: 'Motstander, Ohms lov og kretser',
        icon: Cpu,
        href: '/calculators/electronics',
        ...calm,
    },
    fun: {
        name: 'Moro og livsstil',
        description: 'Kjærlighetstest, månefaser og mer',
        icon: Smile,
        href: '/calculators/fun',
        ...calm,
    },
    gaming: {
        name: 'Spill',
        description: 'Musefølsomhet og reaksjonstid',
        icon: Gamepad2,
        href: '/calculators/gaming',
        ...calm,
    },
    garden: {
        name: 'Hage',
        description: 'Jord, planteavstand og gjødsling',
        icon: Flower2,
        href: '/calculators/garden',
        ...calm,
    },
    photo: {
        name: 'Foto og video',
        description: 'Dybdeskarphet, gylden time og bildeformat',
        icon: Camera,
        href: '/calculators/photo',
        ...calm,
    },
    physics: {
        name: 'Fysikk',
        description: 'Kastbane, energi og tetthet',
        icon: Atom,
        href: '/calculators/physics',
        ...calm,
    },
    rpg: {
        name: 'Rollespill og brettspill',
        description: 'Terninger, navn og møter',
        icon: Dice5,
        href: '/calculators/rpg',
        ...calm,
    },
    stats: {
        name: 'Statistikk',
        description: 'Standardavvik, A/B-test og mer',
        icon: BarChart3,
        href: '/calculators/stats',
        ...calm,
    },
    time: {
        name: 'Tid og dato',
        description: 'Virkedager, alder og kalendere',
        icon: Clock,
        href: '/calculators/time',
        ...calm,
    },
    travel: {
        name: 'Reise',
        description: 'Tidssoner, valuta og pakkeliste',
        icon: Plane,
        href: '/calculators/travel',
        ...calm,
    },
    coffee: {
        name: 'Kaffe',
        description: 'Ekstraksjon, forhold, tidtakere og brygging',
        icon: Coffee,
        href: '/calculators/coffee',
        ...calm,
    },
    aquarium: {
        name: 'Akvarium og terrarium',
        description: 'Volum, besetning, CO₂, saltblanding og mer',
        icon: Fish,
        href: '/calculators/aquarium',
        ...calm,
    },
    solar: {
        name: 'Sol og off-grid',
        description: 'Paneler, batterier, vekselrettere og ledningstverrsnitt',
        icon: Sun,
        href: '/calculators/solar',
        ...calm,
    },
    baking: {
        name: 'Baking og matvitenskap',
        description: 'Hydrering, omregning, temperering og oppskrifter',
        icon: ChefHat,
        href: '/calculators/baking',
        ...calm,
    },
    realestate: {
        name: 'Eiendom',
        description: 'Yield, egenkapitalavkastning, utleie og kjøpskostnader',
        icon: Building,
        href: '/calculators/realestate',
        ...calm,
    },
    wedding: {
        name: 'Bryllup og selskap',
        description: 'Gjestetall, budsjett, tidslinje og logistikk',
        icon: PartyPopper,
        href: '/calculators/wedding',
        ...calm,
    },
};

export function getCategoryConfig(category: string): CategoryConfig | undefined {
    return categoryConfig[category.toLowerCase()];
}

export function getCategoryList(): CategoryConfig[] {
    return Object.values(categoryConfig);
}
