export interface MonthlyChart {
  date: string;
  credit: number | null | undefined;
  debit: number | null | undefined;
}
export interface MonthlyChartProps {
  chartData: MonthlyChart[];
}
