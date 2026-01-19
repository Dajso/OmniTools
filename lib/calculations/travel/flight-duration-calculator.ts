/**
 * Flight Duration Calculator
 * Calculates estimated flight duration between city pairs
 * 
 * Features:
 * - Calculate great circle distance between airports
 * - Estimate flight duration based on distance
 * - Account for typical flight speeds and overhead
 * - Support for major world airports
 * 
 * @module lib/calculations/travel/flight-duration-calculator
 * @see Requirements 16.5
 */

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface FlightDurationResult {
  departureAirport: Airport;
  arrivalAirport: Airport;
  distanceKm: number;
  distanceMiles: number;
  estimatedDurationMinutes: number;
  estimatedDurationFormatted: string;
  flightType: 'short-haul' | 'medium-haul' | 'long-haul' | 'ultra-long-haul';
}

/**
 * Major world airports with coordinates
 */
export const MAJOR_AIRPORTS: Airport[] = [
  // North America
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', latitude: 40.6413, longitude: -73.7781 },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', latitude: 33.9425, longitude: -118.4081 },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA', latitude: 41.9742, longitude: -87.9073 },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA', latitude: 32.8998, longitude: -97.0403 },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', latitude: 25.7959, longitude: -80.2870 },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA', latitude: 37.6213, longitude: -122.3790 },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA', latitude: 47.4502, longitude: -122.3088 },
  { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'USA', latitude: 42.3656, longitude: -71.0096 },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA', latitude: 33.6407, longitude: -84.4277 },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA', latitude: 39.8561, longitude: -104.6737 },
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada', latitude: 43.6777, longitude: -79.6248 },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada', latitude: 49.1967, longitude: -123.1815 },
  { code: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico', latitude: 19.4363, longitude: -99.0721 },
  
  // Europe
  { code: 'LHR', name: 'Heathrow', city: 'London', country: 'UK', latitude: 51.4700, longitude: -0.4543 },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', latitude: 49.0097, longitude: 2.5479 },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622 },
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Netherlands', latitude: 52.3105, longitude: 4.7683 },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas', city: 'Madrid', country: 'Spain', latitude: 40.4983, longitude: -3.5676 },
  { code: 'BCN', name: 'Barcelona–El Prat', city: 'Barcelona', country: 'Spain', latitude: 41.2974, longitude: 2.0833 },
  { code: 'FCO', name: 'Leonardo da Vinci–Fiumicino', city: 'Rome', country: 'Italy', latitude: 41.8003, longitude: 12.2389 },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', latitude: 48.3537, longitude: 11.7750 },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', latitude: 47.4647, longitude: 8.5492 },
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria', latitude: 48.1103, longitude: 16.5697 },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', latitude: 55.6180, longitude: 12.6508 },
  { code: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo', country: 'Norway', latitude: 60.1939, longitude: 11.1004 },
  { code: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'Sweden', latitude: 59.6519, longitude: 17.9186 },
  { code: 'HEL', name: 'Helsinki-Vantaa', city: 'Helsinki', country: 'Finland', latitude: 60.3172, longitude: 24.9633 },
  { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland', latitude: 53.4264, longitude: -6.2499 },
  { code: 'LIS', name: 'Lisbon Portela', city: 'Lisbon', country: 'Portugal', latitude: 38.7756, longitude: -9.1354 },
  { code: 'ATH', name: 'Athens International', city: 'Athens', country: 'Greece', latitude: 37.9364, longitude: 23.9445 },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', latitude: 41.2753, longitude: 28.7519 },
  { code: 'SVO', name: 'Sheremetyevo International', city: 'Moscow', country: 'Russia', latitude: 55.9726, longitude: 37.4146 },
  
  // Asia
  { code: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japan', latitude: 35.5494, longitude: 139.7798 },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', latitude: 35.7720, longitude: 140.3929 },
  { code: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China', latitude: 40.0799, longitude: 116.6031 },
  { code: 'PVG', name: 'Shanghai Pudong International', city: 'Shanghai', country: 'China', latitude: 31.1443, longitude: 121.8083 },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong', latitude: 22.3080, longitude: 113.9185 },
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', latitude: 1.3644, longitude: 103.9915 },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea', latitude: 37.4602, longitude: 126.4407 },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', latitude: 13.6900, longitude: 100.7501 },
  { code: 'DEL', name: 'Indira Gandhi International', city: 'Delhi', country: 'India', latitude: 28.5562, longitude: 77.1000 },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India', latitude: 19.0896, longitude: 72.8656 },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', latitude: 25.2532, longitude: 55.3657 },
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', latitude: 25.2731, longitude: 51.6081 },
  { code: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia', latitude: 2.7456, longitude: 101.7099 },
  { code: 'CGK', name: 'Soekarno-Hatta International', city: 'Jakarta', country: 'Indonesia', latitude: -6.1256, longitude: 106.6558 },
  { code: 'MNL', name: 'Ninoy Aquino International', city: 'Manila', country: 'Philippines', latitude: 14.5086, longitude: 121.0194 },
  { code: 'TPE', name: 'Taiwan Taoyuan International', city: 'Taipei', country: 'Taiwan', latitude: 25.0797, longitude: 121.2342 },
  
  // Oceania
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', latitude: -33.9399, longitude: 151.1753 },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', latitude: -37.6690, longitude: 144.8410 },
  { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', latitude: -27.3942, longitude: 153.1218 },
  { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', latitude: -37.0082, longitude: 174.7850 },
  
  // South America
  { code: 'GRU', name: 'São Paulo–Guarulhos International', city: 'São Paulo', country: 'Brazil', latitude: -23.4356, longitude: -46.4731 },
  { code: 'EZE', name: 'Ministro Pistarini International', city: 'Buenos Aires', country: 'Argentina', latitude: -34.8222, longitude: -58.5358 },
  { code: 'SCL', name: 'Arturo Merino Benítez International', city: 'Santiago', country: 'Chile', latitude: -33.3930, longitude: -70.7858 },
  { code: 'BOG', name: 'El Dorado International', city: 'Bogotá', country: 'Colombia', latitude: 4.7016, longitude: -74.1469 },
  { code: 'LIM', name: 'Jorge Chávez International', city: 'Lima', country: 'Peru', latitude: -12.0219, longitude: -77.1143 },
  
  // Africa & Middle East
  { code: 'JNB', name: 'O. R. Tambo International', city: 'Johannesburg', country: 'South Africa', latitude: -26.1392, longitude: 28.2460 },
  { code: 'CPT', name: 'Cape Town International', city: 'Cape Town', country: 'South Africa', latitude: -33.9715, longitude: 18.6021 },
  { code: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt', latitude: 30.1219, longitude: 31.4056 },
  { code: 'NBO', name: 'Jomo Kenyatta International', city: 'Nairobi', country: 'Kenya', latitude: -1.3192, longitude: 36.9278 },
  { code: 'CMN', name: 'Mohammed V International', city: 'Casablanca', country: 'Morocco', latitude: 33.3675, longitude: -7.5898 },
  { code: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv', country: 'Israel', latitude: 32.0055, longitude: 34.8854 },
];

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371;

// Conversion factor
const KM_TO_MILES = 0.621371;

// Average cruise speeds by flight type (km/h)
const CRUISE_SPEEDS = {
  'short-haul': 750,    // Regional jets
  'medium-haul': 850,   // Narrow-body jets
  'long-haul': 900,     // Wide-body jets
  'ultra-long-haul': 920, // Modern long-range aircraft
};

// Additional time for takeoff, landing, and taxiing (minutes)
const OVERHEAD_MINUTES = {
  'short-haul': 30,
  'medium-haul': 45,
  'long-haul': 60,
  'ultra-long-haul': 75,
};

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculates the great circle distance between two points using the Haversine formula
 * 
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateGreatCircleDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return EARTH_RADIUS_KM * c;
}

/**
 * Determines the flight type based on distance
 * 
 * @param distanceKm - Distance in kilometers
 * @returns Flight type classification
 */
export function getFlightType(distanceKm: number): 'short-haul' | 'medium-haul' | 'long-haul' | 'ultra-long-haul' {
  if (distanceKm < 1500) {
    return 'short-haul';
  } else if (distanceKm < 4000) {
    return 'medium-haul';
  } else if (distanceKm < 10000) {
    return 'long-haul';
  } else {
    return 'ultra-long-haul';
  }
}

/**
 * Estimates flight duration based on distance
 * 
 * @param distanceKm - Distance in kilometers
 * @returns Estimated duration in minutes
 */
export function estimateFlightDuration(distanceKm: number): number {
  const flightType = getFlightType(distanceKm);
  const cruiseSpeed = CRUISE_SPEEDS[flightType];
  const overhead = OVERHEAD_MINUTES[flightType];
  
  // Calculate cruise time in minutes
  const cruiseTimeMinutes = (distanceKm / cruiseSpeed) * 60;
  
  return Math.round(cruiseTimeMinutes + overhead);
}

/**
 * Formats duration in minutes to a readable string
 * 
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "5h 30m")
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
}

/**
 * Calculates flight duration between two airports
 * 
 * @param departureCode - IATA code of departure airport
 * @param arrivalCode - IATA code of arrival airport
 * @returns FlightDurationResult with distance and duration estimates
 */
export function calculateFlightDuration(
  departureCode: string,
  arrivalCode: string
): FlightDurationResult {
  const departure = getAirportByCode(departureCode);
  const arrival = getAirportByCode(arrivalCode);
  
  if (!departure) {
    throw new Error(`Unknown departure airport: ${departureCode}`);
  }
  
  if (!arrival) {
    throw new Error(`Unknown arrival airport: ${arrivalCode}`);
  }
  
  const distanceKm = calculateGreatCircleDistance(
    departure.latitude,
    departure.longitude,
    arrival.latitude,
    arrival.longitude
  );
  
  const distanceMiles = distanceKm * KM_TO_MILES;
  const durationMinutes = estimateFlightDuration(distanceKm);
  const flightType = getFlightType(distanceKm);
  
  return {
    departureAirport: departure,
    arrivalAirport: arrival,
    distanceKm: Math.round(distanceKm),
    distanceMiles: Math.round(distanceMiles),
    estimatedDurationMinutes: durationMinutes,
    estimatedDurationFormatted: formatDuration(durationMinutes),
    flightType,
  };
}

/**
 * Gets an airport by its IATA code
 */
export function getAirportByCode(code: string): Airport | undefined {
  return MAJOR_AIRPORTS.find(a => a.code.toUpperCase() === code.toUpperCase());
}

/**
 * Gets airports by city name
 */
export function getAirportsByCity(city: string): Airport[] {
  return MAJOR_AIRPORTS.filter(
    a => a.city.toLowerCase().includes(city.toLowerCase())
  );
}

/**
 * Gets airports by country
 */
export function getAirportsByCountry(country: string): Airport[] {
  return MAJOR_AIRPORTS.filter(
    a => a.country.toLowerCase().includes(country.toLowerCase())
  );
}

/**
 * Searches airports by name, city, or code
 */
export function searchAirports(query: string): Airport[] {
  const lowerQuery = query.toLowerCase();
  return MAJOR_AIRPORTS.filter(
    a => 
      a.code.toLowerCase().includes(lowerQuery) ||
      a.name.toLowerCase().includes(lowerQuery) ||
      a.city.toLowerCase().includes(lowerQuery)
  );
}
