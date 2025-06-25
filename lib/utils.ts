import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import {
  eachDayOfInterval,
  format,
  isSameDay,
  subDays,
  isValid,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --------------------------------------------------
// Converte de reais para “minor units” (centavos)
export function convertAmountToMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

// Converte de “minor units” (centavos) para reais
export function convertAmountFromMinorUnits(amount: number): number {
  return amount / 100;
}
// --------------------------------------------------

export function formatCurrency(value: number) {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }
  return ((current - previous) / previous) * 100;
}

export function fillMissingDays(
  activeDays: { date: Date; income: number; expenses: number }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length === 0) return [];

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  return allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));
    return found ?? { date: day, income: 0, expenses: 0 };
  });
}

type Period = { from: string | Date | undefined; to: string | Date | undefined };

export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const fromDate = period?.from ? new Date(period.from) : defaultFrom;
  const toDate = period?.to ? new Date(period.to) : defaultTo;

  if (!isValid(fromDate) || !isValid(toDate)) {
    return "Período Inválido!";
  }

  const formattedFrom = format(fromDate, "dd 'de' MMMM", { locale: ptBR });
  const formattedTo = format(toDate, "dd 'de' MMMM', 'yyyy", {
    locale: ptBR,
  });

  return `${formattedFrom} - ${formattedTo}`;
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = { addPrefix: false }
) {
  const result = new Intl.NumberFormat("pt-BR", {
    style: "percent",
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }
  return result;
}
