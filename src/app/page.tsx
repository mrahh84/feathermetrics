"use client";
import { useEffect, useRef, useState } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";

export default function FinancialDashboard() {
  const [financialData, setFinancialData] = useState<any[]>([]); // {date, revenue, expenses, price}
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<any>(null);

  // Fetch and aggregate backend data
  useEffect(() => {
    async function fetchAndAggregate() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/flocks/");
        const flocks = await res.json();
        // Aggregate sales and expenses by date
        const byDate: Record<string, { revenue: number; expenses: number; price: number }> = {};
        flocks.forEach((flock: any) => {
          (flock.sales || []).forEach((sale: any) => {
            if (!byDate[sale.date]) byDate[sale.date] = { revenue: 0, expenses: 0, price: 0 };
            byDate[sale.date].revenue += sale.price;
            // Use sale price as a proxy for price fluctuation (or you can use another field)
            byDate[sale.date].price = sale.price / (sale.quantity || 1);
          });
          (flock.expenses || []).forEach((exp: any) => {
            if (!byDate[exp.date]) byDate[exp.date] = { revenue: 0, expenses: 0, price: 0 };
            byDate[exp.date].expenses += exp.cost;
          });
        });
        // Convert to sorted array
        const data = Object.entries(byDate)
          .map(([date, v]) => ({ date, ...v }))
          .sort((a, b) => a.date.localeCompare(b.date));
        setFinancialData(data);
        setFilteredData(data);
      } catch (e) {
        setFinancialData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAndAggregate();
  }, []);

  // Overview metrics
  const totalRevenue = filteredData.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = filteredData.reduce((sum, d) => sum + d.expenses, 0);
  const profitMargin = totalRevenue === 0 ? 0 : ((totalRevenue - totalExpenses) / totalRevenue);

  // Quarterly forecast (simple: avg of last 30 days projected for next 3 months)
  const last30 = filteredData.slice(-30);
  const avgRevenue = last30.reduce((sum, d) => sum + d.revenue, 0) / (last30.length || 1);
  const avgExpenses = last30.reduce((sum, d) => sum + d.expenses, 0) / (last30.length || 1);
  const months = ["July", "August", "September"];
  const forecast = months.map((m, i) => {
    const projRevenue = Math.round(avgRevenue * (1 + Math.random() * 0.05 - 0.02));
    const projExpenses = Math.round(avgExpenses * (1 + Math.random() * 0.05 - 0.02));
    const projProfit = projRevenue - projExpenses;
    return { month: m, revenue: projRevenue, expenses: projExpenses, profit: projProfit };
  });

  // Price chart data (last 30 days)
  const priceLabels = filteredData.slice(-30).map(d => d.date);
  const priceData = filteredData.slice(-30).map(d => d.price);

  // Chart.js integration
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    import('chart.js/auto').then(() => {
      // @ts-ignore
      const Chart = window.Chart;
      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: priceLabels,
          datasets: [{
            label: 'Price',
            data: priceData,
            borderColor: '#E0A96F',
            backgroundColor: 'rgba(224, 169, 111, 0.1)',
            tension: 0.3,
            pointRadius: 2,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { beginAtZero: false } }
        }
      });
    });
    // eslint-disable-next-line
  }, [priceLabels.join(), priceData.join()]);

  // Filtering
  function applyFilterToData(data: any[], start: string, end: string) {
    return data.filter(d => {
      return (!start || d.date >= start) && (!end || d.date <= end);
    });
  }
  function applyFilter() {
    setLoading(true);
    setTimeout(() => {
      setFilteredData(applyFilterToData(financialData, startDate, endDate));
      setLoading(false);
    }, 400);
  }

  // Format helpers
  function formatCurrency(val: number) {
    return '$' + val.toLocaleString();
  }
  function formatPercent(val: number) {
    return (val * 100).toFixed(1) + '%';
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Loading Indicator */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-[#E0A96F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#E0A96F" strokeWidth="4"></circle>
              <path className="opacity-75" fill="#E0A96F" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="mt-2 text-[#E0A96F] font-semibold">Loading...</span>
          </div>
        </div>
      )}
      <Breadcrumbs items={[{ label: "Dashboard" }]} />
      <h1 className="text-3xl font-bold text-[#E0A96F] mb-1">Financial Dashboard</h1>
      <p className="text-gray-500 mb-6">Monitor your financial health and projections in real time.</p>
      {/* Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">Total Revenue</span>
          <span className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">Total Expenses</span>
          <span className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses)}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">Profit Margin</span>
          <span className="text-2xl font-bold text-blue-600">{formatPercent(profitMargin)}</span>
        </div>
      </section>
      {/* Filters */}
      <section className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-xs text-gray-500 mb-1">Start Date</label>
          <input id="startDate" type="date" className="border border-[#E0A96F] rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#E0A96F]" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-xs text-gray-500 mb-1">End Date</label>
          <input id="endDate" type="date" className="border border-[#E0A96F] rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#E0A96F]" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <Button className="mt-4 sm:mt-6" onClick={applyFilter}>Apply Filter</Button>
      </section>
      {/* Real-time Price Fluctuation Line Graph */}
      <section className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-[#E0A96F]">Real-time Price Fluctuation</h2>
          <span className="text-xs text-gray-400">(Based on sales price, most recent 30 days)</span>
        </div>
        <canvas ref={chartRef} height={80}></canvas>
      </section>
      {/* Quarterly Forecasts */}
      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold text-[#E0A96F] mb-2">Quarterly Forecasts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {forecast.map(f => (
            <div key={f.month} className="bg-[#F2E7C1] rounded-lg p-4 flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1">{f.month}</span>
              <span className="text-green-600 font-bold">{formatCurrency(f.revenue)}</span>
              <span className="text-red-500 font-bold">{formatCurrency(f.expenses)}</span>
              <span className="text-blue-600 font-bold">{formatCurrency(f.profit)}</span>
              <span className="text-xs text-gray-400 mt-1">Revenue / Expenses / Profit</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
