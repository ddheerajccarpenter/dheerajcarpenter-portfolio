"use client";

import { useState } from "react";
import { Button, Card, Label } from "@/components/ui";
import { BarChart3, TrendingUp, Users, Clock, ArrowUpRight, ArrowDownRight, Globe, Laptop, Globe2 } from "lucide-react";

// Types for data structures
interface StatCard {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<any>;
}

interface AnalyticsData {
  stats: StatCard[];
  chartData: { label: string; value: number }[];
  sources: { source: string; count: number; percentage: number }[];
  pages: { path: string; views: number; unique: number; avgTime: string }[];
  devices: { device: string; count: number; percentage: number }[];
  countries: { country: string; code: string; views: number; percentage: number }[];
}

// Generate deterministic mock data based on selected filter
const getMockAnalytics = (filter: string): AnalyticsData => {
  switch (filter) {
    case "today":
      return {
        stats: [
          { label: "Total Visitors", value: "142", change: "+12.4%", isPositive: true, icon: Users },
          { label: "Page Views", value: "489", change: "+8.2%", isPositive: true, icon: BarChart3 },
          { label: "Bounce Rate", value: "41.2%", change: "-2.1%", isPositive: true, icon: TrendingUp },
          { label: "Avg. Session Time", value: "2m 14s", change: "+14s", isPositive: true, icon: Clock },
        ],
        chartData: [
          { label: "9 AM", value: 12 },
          { label: "11 AM", value: 45 },
          { label: "1 PM", value: 78 },
          { label: "3 PM", value: 120 },
          { label: "5 PM", value: 95 },
          { label: "7 PM", value: 110 },
          { label: "9 PM", value: 29 },
        ],
        sources: [
          { source: "Direct / None", count: 210, percentage: 43 },
          { source: "Google", count: 145, percentage: 30 },
          { source: "LinkedIn", count: 83, percentage: 17 },
          { source: "GitHub", count: 51, percentage: 10 },
        ],
        pages: [
          { path: "/", views: 245, unique: 110, avgTime: "1m 45s" },
          { path: "/projects", views: 132, unique: 78, avgTime: "2m 30s" },
          { path: "/about", views: 72, unique: 45, avgTime: "1m 15s" },
          { path: "/contact", views: 40, unique: 22, avgTime: "3m 05s" },
        ],
        devices: [
          { device: "Desktop", count: 318, percentage: 65 },
          { device: "Mobile", count: 146, percentage: 30 },
          { device: "Tablet", count: 25, percentage: 5 },
        ],
        countries: [
          { country: "India", code: "IN", views: 245, percentage: 50 },
          { country: "United States", code: "US", views: 146, percentage: 30 },
          { country: "United Kingdom", code: "GB", views: 49, percentage: 10 },
          { country: "Germany", code: "DE", views: 49, percentage: 10 },
        ],
      };
    case "30days":
      return {
        stats: [
          { label: "Total Visitors", value: "3,842", change: "+18.9%", isPositive: true, icon: Users },
          { label: "Page Views", value: "12,940", change: "+14.2%", isPositive: true, icon: BarChart3 },
          { label: "Bounce Rate", value: "43.5%", change: "+0.8%", isPositive: false, icon: TrendingUp },
          { label: "Avg. Session Time", value: "2m 35s", change: "+18s", isPositive: true, icon: Clock },
        ],
        chartData: [
          { label: "Week 1", value: 2400 },
          { label: "Week 2", value: 3100 },
          { label: "Week 3", value: 2900 },
          { label: "Week 4", value: 4540 },
        ],
        sources: [
          { source: "Google", count: 5434, percentage: 42 },
          { source: "Direct / None", count: 3882, percentage: 30 },
          { source: "LinkedIn", count: 2329, percentage: 18 },
          { source: "GitHub", count: 1295, percentage: 10 },
        ],
        pages: [
          { path: "/", views: 6470, unique: 3120, avgTime: "1m 52s" },
          { path: "/projects", views: 3882, unique: 2150, avgTime: "2m 45s" },
          { path: "/about", views: 1682, unique: 940, avgTime: "1m 20s" },
          { path: "/contact", views: 906, unique: 520, avgTime: "2m 58s" },
        ],
        devices: [
          { device: "Desktop", count: 8411, percentage: 65 },
          { device: "Mobile", count: 3882, percentage: 30 },
          { device: "Tablet", count: 647, percentage: 5 },
        ],
        countries: [
          { country: "India", code: "IN", views: 5823, percentage: 45 },
          { country: "United States", code: "US", views: 4529, percentage: 35 },
          { country: "United Kingdom", code: "GB", views: 1294, percentage: 10 },
          { country: "Germany", code: "DE", views: 1294, percentage: 10 },
        ],
      };
    case "90days":
      return {
        stats: [
          { label: "Total Visitors", value: "11,492", change: "+24.2%", isPositive: true, icon: Users },
          { label: "Page Views", value: "39,120", change: "+20.5%", isPositive: true, icon: BarChart3 },
          { label: "Bounce Rate", value: "42.8%", change: "-1.4%", isPositive: true, icon: TrendingUp },
          { label: "Avg. Session Time", value: "2m 41s", change: "+22s", isPositive: true, icon: Clock },
        ],
        chartData: [
          { label: "Month 1", value: 11200 },
          { label: "Month 2", value: 12900 },
          { label: "Month 3", value: 15020 },
        ],
        sources: [
          { source: "Google", count: 17212, percentage: 44 },
          { source: "Direct / None", count: 12127, percentage: 31 },
          { source: "LinkedIn", count: 6259, percentage: 16 },
          { source: "GitHub", count: 3522, percentage: 9 },
        ],
        pages: [
          { path: "/", views: 19560, unique: 9840, avgTime: "1m 58s" },
          { path: "/projects", views: 11736, unique: 6890, avgTime: "2m 51s" },
          { path: "/about", views: 5085, unique: 2950, avgTime: "1m 24s" },
          { path: "/contact", views: 2739, unique: 1610, avgTime: "3m 12s" },
        ],
        devices: [
          { device: "Desktop", count: 25428, percentage: 65 },
          { device: "Mobile", count: 11736, percentage: 30 },
          { device: "Tablet", count: 1956, percentage: 5 },
        ],
        countries: [
          { country: "India", code: "IN", views: 17604, percentage: 45 },
          { country: "United States", code: "US", views: 13692, percentage: 35 },
          { country: "United Kingdom", code: "GB", views: 3912, percentage: 10 },
          { country: "Germany", code: "DE", views: 3912, percentage: 10 },
        ],
      };
    case "year":
      return {
        stats: [
          { label: "Total Visitors", value: "48,209", change: "+32.1%", isPositive: true, icon: Users },
          { label: "Page Views", value: "164,908", change: "+29.4%", isPositive: true, icon: BarChart3 },
          { label: "Bounce Rate", value: "41.9%", change: "-2.8%", isPositive: true, icon: TrendingUp },
          { label: "Avg. Session Time", value: "2m 48s", change: "+31s", isPositive: true, icon: Clock },
        ],
        chartData: [
          { label: "Jan-Mar", value: 35000 },
          { label: "Apr-Jun", value: 41000 },
          { label: "Jul-Sep", value: 39908 },
          { label: "Oct-Dec", value: 49000 },
        ],
        sources: [
          { source: "Google", count: 74208, percentage: 45 },
          { source: "Direct / None", count: 49472, percentage: 30 },
          { source: "LinkedIn", count: 24736, percentage: 15 },
          { source: "GitHub", count: 16492, percentage: 10 },
        ],
        pages: [
          { path: "/", views: 82454, unique: 41920, avgTime: "2m 04s" },
          { path: "/projects", views: 49472, unique: 29810, avgTime: "2m 58s" },
          { path: "/about", views: 21438, unique: 12900, avgTime: "1m 29s" },
          { path: "/contact", views: 11544, unique: 7100, avgTime: "3m 22s" },
        ],
        devices: [
          { device: "Desktop", count: 107190, percentage: 65 },
          { device: "Mobile", count: 49472, percentage: 30 },
          { device: "Tablet", count: 8246, percentage: 5 },
        ],
        countries: [
          { country: "India", code: "IN", views: 74208, percentage: 45 },
          { country: "United States", code: "US", views: 57717, percentage: 35 },
          { country: "United Kingdom", code: "GB", views: 16491, percentage: 10 },
          { country: "Germany", code: "DE", views: 16492, percentage: 10 },
        ],
      };
    case "7days":
    default:
      return {
        stats: [
          { label: "Total Visitors", value: "984", change: "+15.2%", isPositive: true, icon: Users },
          { label: "Page Views", value: "3,142", change: "+11.8%", isPositive: true, icon: BarChart3 },
          { label: "Bounce Rate", value: "42.1%", change: "-1.5%", isPositive: true, icon: TrendingUp },
          { label: "Avg. Session Time", value: "2m 28s", change: "+12s", isPositive: true, icon: Clock },
        ],
        chartData: [
          { label: "Mon", value: 240 },
          { label: "Tue", value: 380 },
          { label: "Wed", value: 410 },
          { label: "Thu", value: 312 },
          { label: "Fri", value: 590 },
          { label: "Sat", value: 680 },
          { label: "Sun", value: 530 },
        ],
        sources: [
          { source: "Google", count: 1382, percentage: 44 },
          { source: "Direct / None", count: 942, percentage: 30 },
          { source: "LinkedIn", count: 502, percentage: 16 },
          { source: "GitHub", count: 316, percentage: 10 },
        ],
        pages: [
          { path: "/", views: 1571, unique: 740, avgTime: "1m 48s" },
          { path: "/projects", views: 942, unique: 510, avgTime: "2m 38s" },
          { path: "/about", views: 408, unique: 230, avgTime: "1m 18s" },
          { path: "/contact", views: 221, unique: 110, avgTime: "3m 02s" },
        ],
        devices: [
          { device: "Desktop", count: 2042, percentage: 65 },
          { device: "Mobile", count: 942, percentage: 30 },
          { device: "Tablet", count: 158, percentage: 5 },
        ],
        countries: [
          { country: "India", code: "IN", views: 1413, percentage: 45 },
          { country: "United States", code: "US", views: 1099, percentage: 35 },
          { country: "United Kingdom", code: "GB", views: 315, percentage: 10 },
          { country: "Germany", code: "DE", views: 315, percentage: 10 },
        ],
      };
  }
};

export default function AnalyticsDashboardPage() {
  const [filter, setFilter] = useState<"today" | "7days" | "30days" | "90days" | "year">("7days");
  const data = getMockAnalytics(filter);

  // Constants for SVG chart dimensions
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = 30;

  // Calculate points for the line chart SVG path
  const maxVal = Math.max(...data.chartData.map((d) => d.value)) || 1;
  const minVal = 0;
  const range = maxVal - minVal;

  const points = data.chartData
    .map((d, index) => {
      const x = padding + (index / (data.chartData.length - 1)) * (chartWidth - padding * 2);
      const y = chartHeight - padding - ((d.value - minVal) / range) * (chartHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-h1 font-bold tracking-tight">Analytics</h1>
          <p className="text-small text-muted">
            Monitor real-time audience metrics, page views, and traffic trends.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex border border-border rounded-sm overflow-hidden shrink-0">
          {(
            [
              { key: "today", label: "Today" },
              { key: "7days", label: "7 Days" },
              { key: "30days", label: "30 Days" },
              { key: "90days", label: "90 Days" },
              { key: "year", label: "Year" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                filter === item.key
                  ? "bg-foreground text-background"
                  : "bg-background text-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-6 space-y-2">
              <div className="flex justify-between items-center text-muted">
                <span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
                <Icon className="h-4 w-4 shrink-0" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-h2 font-black tracking-tight">{stat.value}</span>
                <span
                  className={`text-[10px] font-bold flex items-center ${
                    stat.isPositive ? "text-foreground" : "text-muted"
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight className="h-3 w-3 mr-0.5 shrink-0" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-0.5 shrink-0" />
                  )}
                  {stat.change}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* SVG Line Chart */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-small font-bold uppercase tracking-wider text-muted">
            Traffic Over Time (Page Views)
          </h2>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] h-[200px] relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                const y = padding + r * (chartHeight - padding * 2);
                return (
                  <line
                    key={i}
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                );
              })}

              {/* Line path */}
              <polyline
                fill="none"
                stroke="var(--foreground)"
                strokeWidth="2.5"
                points={points}
              />

              {/* Data points */}
              {data.chartData.map((d, index) => {
                const x = padding + (index / (data.chartData.length - 1)) * (chartWidth - padding * 2);
                const y = chartHeight - padding - ((d.value - minVal) / range) * (chartHeight - padding * 2);
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    className="fill-background stroke-foreground stroke-2"
                  />
                );
              })}

              {/* X-Axis labels */}
              {data.chartData.map((d, index) => {
                const x = padding + (index / (data.chartData.length - 1)) * (chartWidth - padding * 2);
                return (
                  <text
                    key={index}
                    x={x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    className="text-[9px] fill-muted font-bold uppercase tracking-wider"
                  >
                    {d.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-small font-bold uppercase tracking-wider text-muted">
              Top Visited Pages
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-small">
              <thead>
                <tr className="border-b border-border text-muted font-bold text-[10px] uppercase tracking-wider">
                  <th className="pb-3">Page Path</th>
                  <th className="pb-3 text-right">Views</th>
                  <th className="pb-3 text-right">Unique</th>
                  <th className="pb-3 text-right">Avg. Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.pages.map((p, i) => (
                  <tr key={i} className="hover:bg-surface/30 transition-colors">
                    <td className="py-3 font-semibold text-foreground">{p.path}</td>
                    <td className="py-3 text-right text-muted">{p.views.toLocaleString()}</td>
                    <td className="py-3 text-right text-muted">{p.unique.toLocaleString()}</td>
                    <td className="py-3 text-right text-muted">{p.avgTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-small font-bold uppercase tracking-wider text-muted">
              Referrer Channels
            </h2>
          </div>

          <div className="space-y-4">
            {data.sources.map((source, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-small">
                  <span className="font-semibold text-foreground">{source.source}</span>
                  <span className="text-muted">{source.count.toLocaleString()} ({source.percentage}%)</span>
                </div>
                {/* Custom B&W Bar Chart */}
                <div className="h-2 w-full bg-surface border border-border rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all duration-500"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Laptop className="h-4 w-4 text-muted" />
            <h2 className="text-small font-bold uppercase tracking-wider text-muted">
              Device Types
            </h2>
          </div>

          <div className="space-y-4">
            {data.devices.map((dev, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-small">
                  <span className="font-semibold text-foreground">{dev.device}</span>
                  <span className="text-muted">{dev.count.toLocaleString()} ({dev.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-surface border border-border rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all duration-500"
                    style={{ width: `${dev.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Geographic Breakdown */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Globe2 className="h-4 w-4 text-muted" />
            <h2 className="text-small font-bold uppercase tracking-wider text-muted">
              Geographic Breakdown
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-small">
              <thead>
                <tr className="border-b border-border text-muted font-bold text-[10px] uppercase tracking-wider">
                  <th className="pb-3">Country</th>
                  <th className="pb-3 text-right">Views</th>
                  <th className="pb-3 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.countries.map((c, i) => (
                  <tr key={i} className="hover:bg-surface/30 transition-colors">
                    <td className="py-3 flex items-center space-x-3">
                      <span className="text-[10px] font-bold bg-surface border border-border px-1.5 py-0.5 rounded-sm">
                        {c.code}
                      </span>
                      <span className="font-semibold text-foreground">{c.country}</span>
                    </td>
                    <td className="py-3 text-right text-muted">{c.views.toLocaleString()}</td>
                    <td className="py-3 text-right text-muted">{c.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
