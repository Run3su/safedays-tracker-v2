import { 
  addDays, 
  differenceInDays, 
  format, 
  isSameDay, 
  subDays, 
  isBefore, 
  isAfter,
  startOfDay,
  isValid,
  addWeeks
} from 'date-fns';
import { CycleData, CyclePhase } from '../types';

export const calculateNextPeriod = (lastPeriodDate: Date, cycleLength: number): Date => {
  return addDays(lastPeriodDate, cycleLength);
};

export const calculateOvulationDate = (nextPeriodDate: Date): Date => {
  // Ovulation is typically 14 days before the next period
  return subDays(nextPeriodDate, 14);
};

export const getPhaseForDate = (targetDate: Date, cycleData: CycleData): CyclePhase => {
  const { lastPeriodDate, cycleLength, periodLength = 5 } = cycleData;
  const tDate = startOfDay(targetDate);
  const lDate = startOfDay(lastPeriodDate);

  // If the target date is before the recorded last period, we can't accurately predict without history
  // For this app version, we assume the cycle repeats indefinitely forward/backward based on length
  const daysSinceLastPeriod = differenceInDays(tDate, lDate);
  const dayInCycle = ((daysSinceLastPeriod % cycleLength) + cycleLength) % cycleLength; // Handle negative modulo

  // Period: Days 0 to periodLength-1
  if (dayInCycle < periodLength) {
    return CyclePhase.PERIOD;
  }

  // Calculate Ovulation Day Index
  // If cycle is 28, Ovulation is day 14 (Index 14).
  // Formula: Length - 14
  const ovulationDayIndex = cycleLength - 14;

  // Ovulation Day
  if (dayInCycle === ovulationDayIndex) {
    return CyclePhase.OVULATION;
  }

  // Fertile Window: 5 days before ovulation + ovulation + 1 day after
  // Indices: [Ovulation - 5] to [Ovulation + 1]
  if (dayInCycle >= ovulationDayIndex - 5 && dayInCycle <= ovulationDayIndex + 1) {
    return CyclePhase.FERTILE;
  }

  return CyclePhase.SAFE;
};

export const getCycleOverview = (cycleData: CycleData) => {
  const today = startOfDay(new Date());
  
  // Determine which cycle iteration "today" falls into to show relevant "next" dates
  const lDate = startOfDay(cycleData.lastPeriodDate);
  const daysDiff = differenceInDays(today, lDate);
  const cyclesPassed = Math.floor(daysDiff / cycleData.cycleLength);
  
  // The start of the "current" cycle iteration relative to today
  let activePeriodStart = lDate;
  while (differenceInDays(today, activePeriodStart) >= cycleData.cycleLength) {
    activePeriodStart = addDays(activePeriodStart, cycleData.cycleLength);
  }

  const nextPeriod = addDays(activePeriodStart, cycleData.cycleLength);
  const ovulation = calculateOvulationDate(nextPeriod);
  const fertileStart = subDays(ovulation, 5);
  const fertileEnd = addDays(ovulation, 1);

  return {
    nextPeriod,
    ovulation,
    fertileStart,
    fertileEnd,
    daysUntilPeriod: differenceInDays(nextPeriod, today),
    daysUntilOvulation: differenceInDays(ovulation, today),
    isOvulationPassed: isAfter(today, ovulation),
  };
};

// --- Pregnancy Utils ---

export const calculateDueDate = (lmpDate: Date): Date => {
  // Naegele's rule: LMP + 280 days (40 weeks)
  return addDays(lmpDate, 280);
};

export const getPregnancyProgress = (lmpDate: Date) => {
  const today = startOfDay(new Date());
  const start = startOfDay(lmpDate);
  
  const totalDays = differenceInDays(today, start);
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  
  const dueDate = calculateDueDate(lmpDate);
  const daysLeft = differenceInDays(dueDate, today);
  
  // Trimesters
  // 1st: 0-13 weeks
  // 2nd: 14-26 weeks
  // 3rd: 27-40 weeks
  let trimester = 1;
  if (weeks >= 14 && weeks < 27) trimester = 2;
  if (weeks >= 27) trimester = 3;

  return {
    weeks,
    days,
    trimester,
    daysLeft,
    dueDate,
    progressPercent: Math.min(100, Math.max(0, (totalDays / 280) * 100))
  };
};

export const formatDate = (date: Date, formatStr: string = 'MMM d'): string => {
  return isValid(date) ? format(date, formatStr) : '--';
};