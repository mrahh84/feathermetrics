'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import {
  DollarSign,
  Egg,
  TrendingUp,
  TrendingDown,
  Activity,
  Feather,
} from 'lucide-react';
import { AIInsights } from './ai-insights';
import { format, parseISO } from 'date-fns';
import type { FlockData } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';

export function Dashboard() {
  const [flock, setFlock] = useState<FlockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlock() {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/flocks/1/');
        if (!response.ok) throw new Error('Failed to fetch flock data');
        const data = await response.json();
        setFlock({
          ...data,
          eggLogs: data.egg_logs,
          mortalityLogs: data.mortality_logs,
          feedLogs: data.feed_logs,
          sales: data.sales,
          expenses: data.expenses,
          initialCount: data.initial_count,
          acquisitionDate: data.acquisition_date,
        });
      } catch (err) {
        setError((err as Error).message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchFlock();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!flock) return <div>No flock data found.</div>;

  const { eggLogs, mortalityLogs, initialCount, sales, expenses } = flock;

  const totalEggs = eggLogs.reduce((sum, log) => sum + log.count, 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.price, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.cost, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalMortality = mortalityLogs.reduce((sum, log) => sum + log.count, 0);
  const mortalityRate = ((totalMortality / initialCount) * 100).toFixed(1);

  const eggChartData = eggLogs.slice(-14).map(log => ({
    date: format(parseISO(log.date), 'MMM d'),
    eggs: log.count,
  }));

  const financialChartData = [
    { name: 'Total Revenue', value: totalRevenue, fill: 'var(--color-Revenue)' },
    { name: 'Total Expenses', value: totalExpenses, fill: 'var(--color-Expenses)' },
  ];
  const financialChartConfig = {
    value: { label: 'Amount' },
    Revenue: { label: 'Revenue', color: 'hsl(var(--chart-2))' },
    Expenses: { label: 'Expenses', color: 'hsl(var(--chart-5))' },
  };

  const legendPayload = [
      {
          value: 'Revenue',
          color: 'hsl(var(--chart-2))'
      },
      {
          value: 'Expenses',
          color: 'hsl(var(--chart-5))'
      }
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">From all sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${netProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
             <p className="text-xs text-muted-foreground">Revenue minus expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Eggs Laid</CardTitle>
            <Egg className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEggs.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Since tracking began</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mortality Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mortalityRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totalMortality} birds from an initial {initialCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> Egg Production (Last 14 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{}} className="h-[300px] w-full">
              <LineChart data={eggChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={<ChartTooltipContent />}
                />
                <Line
                  type="monotone"
                  dataKey="eggs"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Feather className="h-5 w-5" /> Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={financialChartConfig} className="h-[300px] w-full">
               <BarChart accessibilityLayer data={financialChartData} layout="vertical" margin={{left: 10}}>
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  />
                <XAxis type="number" hide />
                <Tooltip cursor={{fill: 'hsl(var(--accent))'}} content={<ChartTooltipContent />} />
                <ChartLegend payload={legendPayload} content={<ChartLegendContent />} />
                <Bar dataKey="value" radius={5} />
               </BarChart>
             </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1">
        <AIInsights flockData={flock} />
      </div>
    </div>
  );
}
