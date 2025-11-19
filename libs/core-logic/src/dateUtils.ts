import { startOfDay, isAfter, isBefore, differenceInDays, parseISO, isToday } from 'date-fns';

export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;

  return startOfDay(d1).getTime() === startOfDay(d2).getTime();
};

export const isConsecutiveDay = (previousDate: Date | string, currentDate: Date | string): boolean => {
  const prev = typeof previousDate === 'string' ? parseISO(previousDate) : previousDate;
  const curr = typeof currentDate === 'string' ? parseISO(currentDate) : currentDate;

  const daysDiff = differenceInDays(startOfDay(curr), startOfDay(prev));
  return daysDiff === 1;
};

export const resetToMidnight = (date: Date | string): Date => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return startOfDay(d);
};

export const getDaysBetween = (startDate: Date | string, endDate: Date | string): number => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  return Math.abs(differenceInDays(startOfDay(end), startOfDay(start)));
};

export const isDateBeforeToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(startOfDay(d), startOfDay(new Date()));
};

export const isDateAfterToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isAfter(startOfDay(d), startOfDay(new Date()));
};

export const isTodayDate = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isToday(d);
};

export const getTodayDateString = (): string => {
  return startOfDay(new Date()).toISOString().split('T')[0];
};
