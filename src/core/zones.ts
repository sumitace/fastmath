import { Zone, ZoneScore } from './types';

export const ZONE_TABLE: ZoneScore[] = [
  { zone: 'bullseye', points: 100, label: 'BULLSEYE', maxRelativeError: 0.05 },
  { zone: 'green',    points: 80,  label: 'GREEN',    maxRelativeError: 0.10 },
  { zone: 'yellow',   points: 60,  label: 'YELLOW',   maxRelativeError: 0.20 },
  { zone: 'orange',   points: 40,  label: 'ORANGE',   maxRelativeError: 0.30 },
  { zone: 'red',      points: 10,  label: 'RED',      maxRelativeError: null },
];

export const ZONE_COLORS: Record<Zone, string> = {
  bullseye: '\x1b[96m',
  green:    '\x1b[92m',
  yellow:   '\x1b[93m',
  orange:   '\x1b[33m',
  red:      '\x1b[91m',
};

export const RESET = '\x1b[0m';
export const BOLD  = '\x1b[1m';
