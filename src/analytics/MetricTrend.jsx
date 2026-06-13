import React from "react";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import { motion } from "motion/react";

/**
 * Deterministically generates a 30-day historical timeline based on baseVal, seed properties, and trend strategy.
 */
function compute30DayTrend(baseValue, type, seed) {
  const points = [];
  let val = baseValue;
  
  // Create solid, stable hash multiplier from seed string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (let i = 0; i < 30; i++) {
    const pseudoRandom = Math.abs(Math.sin(hash + i));

    if (type === "up") {
      val = val + pseudoRandom * Math.max(1, val * 0.05);
    } else if (type === "down") {
      val = Math.max(0, val - pseudoRandom * Math.max(1, val * 0.06));
    } else if (type === "volatile") {
      val = val + (pseudoRandom - 0.5) * Math.max(2, val * 0.18);
    } else {
      val = val + (pseudoRandom - 0.5) * Math.max(1, val * 0.04);
    }

    val = Math.max(0, val);
    points.push({
      day: 30 - i, // Counting down to day 0 (today)
      value: Number(val.toFixed(1)),
    });
  }

  return points.reverse(); // Standard chronological left-to-right order
}

/**
 * Calculates statistical rate of change and trend metrics from the historical series.
 */
function analyzeHistoricalReputation(points, reverseSentiment) {
  if (points.length < 2) {
    return { formattedChange: "0.0%", isPositive: true };
  }

  const initialVal = points[0].value;
  const terminalVal = points[points.length - 1].value;

  if (initialVal === 0 && terminalVal === 0) {
    return { formattedChange: "Stable", isPositive: true };
  }

  if (initialVal === 0) {
    return { formattedChange: `+${terminalVal.toFixed(0)}`, isPositive: true };
  }

  const rawChange = terminalVal - initialVal;
  const percentChange = (rawChange / initialVal) * 100;

  // Sentiment mapping: Deciding if the change is "positive" (growth/healthy state)
  const isGrowth = percentChange >= 0;
  const isPositive = reverseSentiment ? !isGrowth : isGrowth;

  const sign = percentChange > 0 ? "+" : "";
  const formattedChange = `${sign}${percentChange.toFixed(1)}%`;

  return { formattedChange, isPositive };
}

/**
 * MetricTrend - Clean, highly interactive, and responsive individual KPI dashboard component.
 * Incorporates beautiful Recharts custom gradients and rich tooltips.
 */
export default function MetricTrend({
  metricId,
  title,
  icon: Icon,
  displayValue,
  baseValue,
  subtext,
  trendType,
  themeColor,
  reverseTrendSentiment = false,
}) {
  // Compute data deterministically so updates or tab switching behaves stably
  const history = React.useMemo(() => {
    return compute30DayTrend(baseValue, trendType, `${metricId}-${baseValue}`);
  }, [baseValue, trendType, metricId]);

  const { formattedChange, isPositive } = React.useMemo(() => {
    return analyzeHistoricalReputation(history, reverseTrendSentiment);
  }, [history, reverseTrendSentiment]);

  // Determine Badge Styling depending on sentiment
  const sentimentClass = isPositive
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    : "text-rose-400 bg-rose-500/10 border-rose-500/20";

  return (
    <motion.div
      id={`metric-card-${metricId}`}
      whileHover={{ y: -3 }}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between h-full select-none transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-black/30"
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-3 text-zinc-400">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-450">
            {title}
          </span>
          <div className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <Icon className="w-4.5 h-4.5 text-indigo-400" />
          </div>
        </div>

        {/* Value and Percentage Indicator row */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl font-bold font-sans text-zinc-100 tracking-tight">
            {displayValue}
          </div>
          <span
            className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border ${sentimentClass}`}
            title="30-day computed performance trend"
          >
            {formattedChange}
          </span>
        </div>

        {/* Growth/Decline text below main value */}
        <div className="text-[10px] text-zinc-500 font-mono mt-1 flex items-center gap-1 select-none">
          <span className={isPositive ? "text-emerald-400/80" : "text-rose-400/80"}>
            {isPositive ? "▲" : "▼"} {formattedChange}
          </span>
          <span className="text-zinc-500 font-sans">vs previous 30-day period</span>
        </div>

        {/* Interactive mini sparkline charting panel */}
        <div className="h-12 w-full mt-4 overflow-hidden relative group/spark">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 2, bottom: 2, left: 1, right: 1 }}>
              <defs>
                <linearGradient id={`gradient-${metricId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={themeColor} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={themeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div className="bg-zinc-950/95 border border-zinc-800 px-2 py-1 rounded text-[9px] font-mono text-zinc-350 shadow-xl">
                        <span className="text-zinc-500 mr-1">Day {dataPoint.day}:</span>
                        <span className="font-bold text-zinc-100">{dataPoint.value}</span>
                      </div>
                    );
                  }
                  return null;
                }}
                offset={10}
                cursor={{ stroke: themeColor, strokeWidth: 0.5, strokeDasharray: "2 2" }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke={themeColor}
                strokeWidth={1.5}
                fill={`url(#gradient-${metricId})`}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 1, fill: "#ffffff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer descriptor bar */}
      <div className="text-[10px] text-zinc-405 mt-2.5 font-mono flex items-center justify-between border-t border-zinc-800/50 pt-2 shrink-0">
        <span className="text-zinc-500">{subtext}</span>
        <span className="text-[9px] text-zinc-650 uppercase tracking-tight">30d Trend</span>
      </div>
    </motion.div>
  );
}
