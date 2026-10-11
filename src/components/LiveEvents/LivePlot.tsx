import cn from 'classnames';
import { type Ref, useMemo } from 'react';

import { activeColor } from 'components/App/store';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LiveEvent } from 'store/live';

import S from './LivePlot.styl';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const LINE_CHART_MARGIN = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 0,
};

function chooseBucket(span: number) {
  if (span <= 6 * HOUR) return MINUTE;
  if (span <= 2 * DAY) return 15 * MINUTE;
  if (span <= 14 * DAY) return HOUR;
  if (span <= 62 * DAY) return 6 * HOUR;
  return DAY;
}

function formatLabel(ts: number, bucket: number) {
  const date = new Date(ts);

  if (bucket >= DAY) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  if (bucket >= HOUR) {
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function bucketEvents(events: LiveEvent[], from: number, to: number) {
  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) return [];

  const now = Date.now();
  // A local "today" can still start in the future in UTC. Draw that day
  // instead of collapsing the plot.
  const axisEnd = now < from ? to : Math.min(to, now);

  const bucketMs = chooseBucket(Math.max(axisEnd - from, MINUTE));
  const startBucket = Math.floor(from / bucketMs) * bucketMs;
  const endBucket = Math.floor(axisEnd / bucketMs) * bucketMs;
  const buckets: Record<number, number> = {};

  for (let t = startBucket; t <= endBucket; t += bucketMs) {
    buckets[t] = 0;
  }

  events.forEach(({ time }) => {
    const ts = new Date(time).getTime();
    if (Number.isNaN(ts)) return;
    const bucket = Math.floor(ts / bucketMs) * bucketMs;
    if (buckets[bucket] === undefined) return;
    buckets[bucket] += 1;
  });

  return Object.entries(buckets).map(([ts, count]) => ({
    time: Number(ts),
    label: formatLabel(Number(ts), bucketMs),
    count,
  }));
}

interface Props {
  events: LiveEvent[];
  from: number;
  to: number;
  className?: string;
  height?: number | null;
  rootRef?: Ref<HTMLDivElement>;
}

export function LivePlot({
  events,
  from,
  to,
  className,
  height,
  rootRef,
}: Props) {
  const chartData = useMemo(
    () => bucketEvents(events, from, to),
    [events, from, to],
  );

  return (
    <div
      ref={rootRef}
      className={cn(S.root, className)}
      style={height == null ? undefined : { height }}
    >
      <ResponsiveContainer>
        <LineChart data={chartData} margin={LINE_CHART_MARGIN}>
          <XAxis
            dataKey="label"
            fontSize={10}
            className={S.xAxis}
            minTickGap={28}
          />
          <YAxis fontSize={10} className={S.yAxis} allowDecimals={false} />
          <Tooltip
            content={d => {
              const { value, payload } = d.payload?.[0] ?? {};
              return (
                <div className={S.tooltip}>
                  <b>{value}</b>
                  <br />
                  <span className={S.tooltipLabel}>{payload?.label}</span>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={activeColor}
            dot={false}
            activeDot={{ r: 6 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
