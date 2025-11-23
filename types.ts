export interface CycleData {
  lastPeriodDate: Date;
  cycleLength: number;
  periodLength: number;
  isPregnant?: boolean;
  pregnancyStart?: Date; // Usually the Last Menstrual Period (LMP)
  logs: Record<string, DailyLog>; // key: YYYY-MM-DD
}

export interface DailyLog {
  intimacy?: 'protected' | 'unprotected' | null;
}

export enum CyclePhase {
  PERIOD = 'PERIOD',
  FERTILE = 'FERTILE',
  OVULATION = 'OVULATION',
  SAFE = 'SAFE',
}

export interface DayStatus {
  date: Date;
  phase: CyclePhase;
  isToday: boolean;
  isPeriodStart: boolean;
}