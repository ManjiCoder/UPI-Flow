import { Bar, BarChart, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { appInfo } from '@/types/constant';

export const description = 'A stacked bar chart with a legend';

const chartData = [
  { date: '2024-07-15', credit: 450, debit: 300 },
  { date: '2024-07-16', credit: 380, debit: 420 },
  { date: '2024-07-17', credit: 520, debit: 120 },
  { date: '2024-07-18', credit: 140, debit: 550 },
  { date: '2024-07-19', credit: 600, debit: 350 },
  { date: '2024-07-20', credit: 480, debit: 400 },
];

const chartConfig = {
  running: {
    label: 'credit',
    color: 'hsl(var(--chart-1))',
  },
  swimming: {
    label: 'debit',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function MonthlyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{appInfo.title} - Monthly</CardTitle>
        <CardDescription>{appInfo.desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey='date'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString('en-US', {
                  weekday: 'short',
                });
              }}
            />
            <Bar
              dataKey='credit'
              stackId='a'
              fill='var(--color-running)'
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey='debit'
              stackId='a'
              fill='var(--color-swimming)'
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  className='w-[180px]'
                  formatter={(value, name, item, index) => (
                    <>
                      <div
                        className='h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]'
                        style={
                          {
                            '--color-bg': `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                      <div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
                        <span className='font-normal text-muted-foreground'>
                          Rs.
                        </span>
                        {value}
                      </div>
                      {/* Add this after the last item */}
                      {index === 1 && (
                        <div className='mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground'>
                          Total
                          <div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
                            <span className='font-normal text-muted-foreground'>
                              Rs.
                            </span>
                            {item.payload.credit + item.payload.debit}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
